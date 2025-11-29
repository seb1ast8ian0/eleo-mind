from domain.service.service import Service
from domain.model.article import Article
from application.models.article_response import ArticlesResponse, ArticleResponse, article_response_from_domain_article

class GetArticlesRout:

    svc: Service

    def __init__(self, svc: Service):
        self.svc = svc

    def get_articles(self) -> ArticlesResponse:
        all_articles: list[Article] = self.svc.get_articles()

        articles_resp_list: list[ArticleResponse] = []

        for article in all_articles:
            articles_resp_list.append(
                article_response_from_domain_article(article)
            )


        return ArticlesResponse(articles=articles_resp_list)