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

    def get_article(self, article_id: str) -> pd.DataFrame:
        article_df = self.df[self.df["SKU"].apply(str) == article_id]
        if article_df is None:
            msg: str = f"tried to retrieve information about article: {article_id}, but article is None"
            self.logger.error(msg)
            raise ValueError(msg)

        return article_df

    def get_all_articles(self) -> pd.DataFrame:
        return self.all_articles_df

    def get_current_stock_for_article(self, article_id: str):
        article_df = self.get_article(article_id)

        current_in_stock = article_df["amount"]
        if current_in_stock is None:
            msg: str = f"tried to retrieve amount for article {article_id}, but 'amount' is None for df: {article_df}"
            self.logger.error(msg)
            raise ValueError(msg)

        return current_in_stock

    def get_min_stock_for_article(self, article_id: str):
        article_df = self.get_article(article_id)

        min_stock = article_df["min_amount"]
        if min_stock is None:
            msg: str = f"tried to retrieve min_amount for article {article_id}, but 'min_amount' is None for df: {article_df}"
            self.logger.error(msg)
            raise ValueError(msg)


