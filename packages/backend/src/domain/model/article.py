import pandas as pd
from pydantic import BaseModel

class Article(BaseModel):
    sku: str
    coating: str
    producer_id: int
    delivery_time: int
    production_line: int

    def __str__(self):
        return (f"Article("
                f"sku: {self.sku} | "
                f"coating: {self.coating} | "
                f"producer_id: {self.producer_id} | "
                f"delivery_time: {self.delivery_time} | "
                f"production_line: {self.production_line}"
                f")")

def get_articles_from_df(article_df: pd.DataFrame) -> list[Article]:
    all_articles = article_df.apply(
        lambda row: Article(
            sku=row["SKU"],
            coating=row["Beschichtung"],
            producer_id=row["producer"],
            delivery_time=row["duration"],
            production_line=row["production_line"]
        ),
        axis=1
    ).to_list()

    return all_articles


def get_specific_article_from_df(article_df: pd.DataFrame) -> Article:
    return Article(
        sku=str(article_df["SKU"].item()),
        coating=str(article_df["Beschichtung"].item()),
        producer_id=int(article_df["producer"].item()),
        delivery_time=int(article_df["duration"].item()),
        production_line=int(article_df["production_line"].item())
    )





