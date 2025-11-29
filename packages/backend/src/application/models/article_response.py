from pydantic import BaseModel

from domain.model.article import Article
import random

class ArticleResponse(BaseModel):
    article_id: str
    article_name: str | None = None
    category: str | None = None
    image_path: str | None = None
    image_alt: str | None = None
    stock_current: int = random.randint(5, 20)
    unit: str = "Stück"
    delivery_time_days: int
    producer_id: int
    division_id: int



class ArticlesResponse(BaseModel):
    articles: list[ArticleResponse]

def article_response_from_domain_article(domain_article: Article) -> ArticleResponse:
    return ArticleResponse(
        article_id=domain_article.sku,
        delivery_time_days=domain_article.delivery_time,
        producer_id=domain_article.producer_id,
        division_id=domain_article.production_line
    )
