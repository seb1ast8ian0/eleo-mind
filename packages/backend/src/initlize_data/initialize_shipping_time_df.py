import pandas as pd
import logging

PRODUCER_COL_NAME: str = "producer" # col for wich producer 1 to 4
DURATION_PRODUCER_COL_NAME: str = "duration_producer" # col for duration from producer
DURATION_COATING_COL_NAME: str = "duration_coating" # col for duration of coating
DURATION_COL_NAME: str = "duration" # whole production duration
PRODUCTION_LINE_COL_NAME: str = "production_line" # The production line

def _get_cleaned_production_time(df):

    ## Handle lists in SKU col
    df["SKU"] = df["SKU"].apply(str).str.replace(" ", "")

    # 2. In Liste umwandeln
    df["SKU"] = df["SKU"].str.split(",")

    # 3. Exploden → jede SKU bekommt ihre eigene Zeile
    df = df.explode("SKU")

    ## Extract Producer
    prod_cols = [c for c in df.columns if c.startswith("Produzent")]

    # Index der Spalte finden, die NICHT 0 ist
    # → liefert Namen wie "Produzent 3"
    df["producer_col"] = df[prod_cols].apply(lambda row: row[row != 0].index[0] if (row != 0).any() else None, axis=1)

    # Producer-Nummer extrahieren
    df[PRODUCER_COL_NAME] = df["producer_col"].str.extract(r"(\d+)").fillna(0).astype(int)

    ## Extract Producer Time
    # Duration extrahieren (Wert in der jeweiligen Produzent-Spalte)
    df[DURATION_PRODUCER_COL_NAME] = df.apply(
        lambda row: row[row["producer_col"]] if row[PRODUCER_COL_NAME] != 0 else 0,
        axis=1
    )

    ## Add duration of coating
    df[DURATION_COATING_COL_NAME] = (
            df["Duplexbeschichter"].fillna(0) +
            df["Verzinken (=Produzent 2)"].fillna(0)
    )

    ## Add the complete duration
    df[DURATION_COL_NAME] = (
            df[DURATION_PRODUCER_COL_NAME].fillna(0) +
            df[DURATION_COATING_COL_NAME].fillna(0)
    )

    ## Delete unecassary cols
    cols_to_delete = prod_cols
    cols_to_delete.extend([
        "producer_col",
        "Annahme Lagerbestand Status Quo",
        "ELEO Lager",
        "Duplexbeschichter",
        "Verzinken (=Produzent 2)"
    ])
    df = df.drop(columns=cols_to_delete)

    df["SKU"] = df["SKU"].str.upper().str.replace(r"[^A-Z0-9]", "", regex=True)

    return df

def get_article_production_duration_df() -> pd.DataFrame:
    import os
    current_file = os.path.abspath(__file__)
    current_dir = os.path.dirname(current_file)

    xlsx_file_path = f"{current_dir}/../../files/Produktionszeit_Warenfluss_Hackathon_Teilnehmer.xlsx"

    all_articles = pd.DataFrame()
    for sheet in [0, 2, 4]:
        df = pd.read_excel(xlsx_file_path, sheet_name=sheet)

        cleaned_df = _get_cleaned_production_time(df)

        prod_line = 0
        if sheet == 0:
            prod_line = 1
        elif sheet == 2:
            prod_line = 2
        elif sheet == 4:
            prod_line = 3

        cleaned_df[PRODUCTION_LINE_COL_NAME] = prod_line

        all_articles = pd.concat([all_articles, cleaned_df])

    return all_articles

if __name__ == "__main__":
    all_articles = get_article_production_duration_df()

    print(all_articles)