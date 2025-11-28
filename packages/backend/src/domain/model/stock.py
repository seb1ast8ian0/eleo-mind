import pandas as pd
import logging

class Stock:

    logger: logging.Logger

    df: pd.DataFrame
    all_articles_df: pd.DataFrame

    def __init__(self, df: pd.DataFrame):
        self.logger = logging.getLogger(__name__)
        self.df = df
        self.all_articles_df = df.copy()

        self.logger.info(f"Initialized stock with: {len(self.all_articles_df)} articles")

    def get_article(self, article_id: str):
        return self.df[self.df["SKU"].apply(str) == article_id]

    def get_all_articles(self) -> pd.DataFrame:
        return self.all_articles_df