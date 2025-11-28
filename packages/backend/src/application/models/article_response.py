from pydantic import BaseModel

from domain.model.article import Article

class ArticleResponse(BaseModel):
    article_id: str
    article_name: str = "NaN"
    category: str = "NaN"
    image_path: str = "NaN"
    image_alt: str = "NaN"
    stock_current: int = 0
    unit: str = "Stück"
    delivery_time_days: int
    critical_date_min_stock_breach: str = "NaN"
    producer_id: int
    division_id: int



class ArticlesResponse(BaseModel):
    articles: list[ArticleResponse]

def article_response_from_domain_article(domain_article: Article) -> ArticleResponse:
    return ArticleResponse(
        article_id=domain_article.sku,
        producer_id=domain_article.producer_id,
        delivery_time_days=domain_article.delivery_time,
        division_id=domain_article.production_line
    )
