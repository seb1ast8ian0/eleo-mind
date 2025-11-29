from fastapi import APIRouter

from application.get_articles import GetArticlesRout
from application.get_global_forecast import GetGlobalForecastRout
from application.get_order_alerts import GetOrderAlertsRout
from application.get_forecast_for_article import GetForecastForArticleRout
from application.models.article_response import ArticlesResponse, ArticleResponse
from application.get_alerts import GetAlertsRout
from application.models.alerts_response import OrderAlertsResponse
from application.models.global_sales_response import GlobalForecastResponse
from application.models.order_alert_for_article import OrderAlertForArticleResponse, OrderAlertForArticleRequest
from domain.service.service import Service

class AppRouter:

    router: APIRouter
    svc: Service

    def __init__(self, svc: Service):
        self.router = APIRouter()
        self.svc = svc

        self._initialize_routes()

    def _initialize_routes(self):
        # GET "/articles" über alle article
        get_articles_rout = GetArticlesRout(self.svc)
        self.router.add_api_route(
            "/article",
            get_articles_rout.get_articles,
            methods=["GET"],
            operation_id="get_articles",
            response_model=ArticlesResponse,
            description="Gets all articles"
        )

        get_order_alerts_rout = GetOrderAlertsRout(self.svc)
        self.router.add_api_route(
            "/order_alerts",
            get_order_alerts_rout.get_order_prediction,
            methods=["GET"],
            operation_id="get_order_alerts",
            response_model=OrderAlertsResponse
        )

        # POST "/forecast" forcast für einen spezifischen Artikel
        get_forecast_for_article_rout = GetForecastForArticleRout(self.svc)
        self.router.add_api_route(
            "/forecast",
            get_forecast_for_article_rout.get_forecast_for_article,
            methods=["POST"],
            operation_id="get_forecast_for_article",
            response_model=OrderAlertForArticleResponse,
            description="Gets the forecast for a specific article"
        )

        # POST "/alerts" mit Top 3 kritischen Artikeln (datenstruktur:mock_alerts.json)
        get_alerts_rout = GetAlertsRout(self.svc)
        self.router.add_api_route(
            "/alerts",
            get_alerts_rout.get_critical_alerts,
            methods=["POST"],
            operation_id="get_alerts",
            response_model=OrderAlertsResponse,
            description="Gets the most critical alerts"
        )

        # GET "/global-forecast"  für forecast über alle artikel 30 Tage (datenstruktur:frontend_global_sales.json)
        get_global_forecast_rout = GetGlobalForecastRout(self.svc)
        self.router.add_api_route(
            "/global-forecast",
            get_global_forecast_rout.get_global_forecast,
            methods=["GET"],
            operation_id="get_global_forecast",
            response_model=GlobalForecastResponse
        )