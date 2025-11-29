from fastapi import APIRouter

from application.get_articles import GetArticlesRout
from application.get_specific_article import GetSpecificArticleRout
from application.get_order_alerts import GetOrderAlertsRout
from application.models.article_response import ArticlesResponse, ArticleResponse
from application.models.order_alerts_response import OrderAlerts
from domain.service.service import Service

class AppRouter:

    router: APIRouter
    svc: Service

    def __init__(self, svc: Service):
        self.router = APIRouter()
        self.svc = svc

        self._initialize_routes()

    def _initialize_routes(self):
        get_articles_rout = GetArticlesRout(self.svc)
        self.router.add_api_route(
            "/article",
            get_articles_rout.get_articles,
            methods=["GET"],
            operation_id="get_articles",
            response_model=ArticlesResponse
        )

        get_specific_article_rout = GetSpecificArticleRout(self.svc)
        self.router.add_api_route(
            "/article/{article_id}",
            get_specific_article_rout.get_specific_article,
            methods=["GET"],
            operation_id="get_specific_article",
            response_model=ArticleResponse
        )

        get_order_alerts_rout = GetOrderAlertsRout(self.svc)
        self.router.add_api_route(
            "/order_alerts",
            get_order_alerts_rout.get_order_prediction,
            methods=["GET"],
            operation_id="get_order_alerts",
            response_model=OrderAlerts
        )