from domain.model.stock import Stock

from domain.model.article import get_articles_from_df, Article

class Service:

    stock_service: Stock

    def __init__(self, stock_service: Stock):
        self.stock_service = stock_service

    def get_article_by_id(self, article_id: str):
        return self.stock_service.get_article(article_id)

    def get_articles(self) -> list[Article]:
        all_articles_df = self.stock_service.get_all_articles()
        return get_articles_from_df(all_articles_df)
