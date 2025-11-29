import pandas as pd
from initlize_data.initialize_shipping_time_df import get_article_production_duration_df

def get_stock_df() -> pd.DataFrame:
    all_products = get_article_production_duration_df()

    all_products = all_products.drop(columns=["duration_producer", "duration_coating"])

    all_products["amount"] = int(0)

    all_products["min_amount"] = int(5)

    return all_products

