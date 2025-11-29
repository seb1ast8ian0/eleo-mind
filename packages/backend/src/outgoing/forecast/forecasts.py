import pandas as pd

import os
current_file = os.path.abspath(__file__)
current_dir = os.path.dirname(current_file)

csv_path = f"{current_dir}/deepar_full_forecast_patched.csv"

df = pd.read_csv(csv_path)
df["date"] = pd.to_datetime(df["date"])

daily = (
    df.groupby("date", as_index=False)
      .agg({
          "qty": "sum",
          "tavg": "first",
          "prcp": "first",
          "tsun": "first",
          "sale_percent": "max",
          "weather_label": "first",
          "sale_active": "any",
      })
)

def get_sku_forecast(sku, start_date, end_date):
    start_date = pd.Timestamp(start_date)
    end_date = pd.Timestamp(end_date)
    sku = sku.lower()

    mask = (df["date"] >= start_date) & (df["date"] <= end_date) & (df["SKU"] == sku)
    return df.loc[mask, ["date", "qty", "tavg", "sale_percent", "sale_active", "weather_label"]]

def get_daily_forecast(start_date, end_date):
    start_date = pd.Timestamp(start_date)
    end_date = pd.Timestamp(end_date)

    mask = (daily["date"] >= start_date) & (daily["date"] <= end_date)
    return daily.loc[mask, ["date", "qty", "tavg", "sale_percent", "sale_active", "weather_label"]]
