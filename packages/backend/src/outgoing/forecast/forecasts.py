import pandas as pd

df = pd.read_csv("/Users/rhombus19/projects/eleo/eleo-mind/packages/backend/src/outgoing/forecast/sku_forecast_poisson_full.csv")
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
    start_date = pd.to_datetime(start_date)
    end_date = pd.to_datetime(end_date)

    mask = (df["date"] >= start_date) & (df["date"] <= end_date) & (df["SKU"] == sku)
    return df.loc[mask, ["date", "qty", "tavg", "sale_percent", "sale_active", "weather_label"]]

def get_daily_forecast(start_date, end_date):
    start_date = pd.to_datetime(start_date)
    end_date = pd.to_datetime(end_date)

    mask = (daily["date"] >= start_date) & (daily["date"] <= end_date)
    return daily.loc[mask, ["date", "qty", "tavg", "sale_percent", "sale_active", "weather_label"]]
