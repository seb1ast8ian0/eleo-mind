import pandas as pd

class Article:
    sku: str
    coating: str
    producer_id: int
    delivery_time: int
    production_line: int

    def __init__(self, sku: str, coating:str, producer_id: int, duration: int, production_line: int):
        self.sku = sku
        self.coating = coating
        self.producer_id = producer_id
        self.delivery_time = duration
        self.production_line = production_line

def get_articles_from_df(df: pd.DataFrame) -> list[Article]:
    all_articles = df.apply(
        lambda row: Article(
            sku=row["SKU"],
            coating=row["Beschichtung"],
            producer_id=row["producer"],
            duration=row["duration"],
            production_line=row["production_line"]
        ),
        axis=1
    ).to_list()

    return all_articles




