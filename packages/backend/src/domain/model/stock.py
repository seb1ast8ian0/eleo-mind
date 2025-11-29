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

    def get_current_stock(self) -> pd.DataFrame:
        return self.df

    def get_sku_from_series(self, series: pd.Series) -> str:
        sku: str = str(series["SKU"])

        if sku == '':
            msg = f"Tried to get SKU for pd.Series: {series}, but sku is ''"
            self.logger.error(msg)
            raise ValueError(msg)

        return sku

    def get_duration_from_series(self, series: pd.Series):
        duration: int = int(series["duration"])

        if duration == 0:
            msg = f"Tried to get duration for pd.Series: {series}, but duration is 0"
            self.logger.error(msg)
            raise ValueError(msg)

        return duration

    def get_current_stock_for_article(self, article_id: str) -> int:
        article_df = self.get_article(article_id)

        current_in_stock = article_df["amount"]
        if current_in_stock is None:
            msg: str = f"tried to retrieve amount for article {article_id}, but 'amount' is None for df: {article_df}"
            self.logger.error(msg)
            raise ValueError(msg)

        self.logger.debug(f"Got current_in_stock for article: {article_id}: {current_in_stock}")

        return int(current_in_stock.item())

    def get_min_stock_for_article(self, article_id: str) -> int:
        article_df = self.get_article(article_id)

        min_stock = article_df["min_amount"]
        if min_stock is None:
            msg: str = f"tried to retrieve min_amount for article {article_id}, but 'min_amount' is None for df: {article_df}"
            self.logger.error(msg)
            raise ValueError(msg)

        self.logger.debug(f"Got min_stock for article_id: {article_id}: {min_stock}")

        return int(min_stock.item())


