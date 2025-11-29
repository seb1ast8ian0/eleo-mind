from datetime import datetime

from domain.service.service import Service
from application.models.orderAlertForArticle import OrderAlertForArticleRequest, OrderAlertForArticleResponse, ForecastResponse


class GetForecastForArticleRout:

    svc: Service

    def __init__(self, svc: Service):
        self.svc = svc

    def get_forecast_for_article(self, req: OrderAlertForArticleRequest):
        order_with_forecast = self.svc.get_forecast_for_article(
            req.article_id, req.current_stock_for_article, req.min_stock_for_article
        )

        forecast_resp_list: list[ForecastResponse] = []
        for forecast in order_with_forecast.forecast:
            forecast_resp_list.append(
                ForecastResponse(
                    date=forecast.date,
                    stock_forecast_for_date=forecast.stock_forecast_for_date
                )
            )


        return OrderAlertForArticleResponse(
            article_id=order_with_forecast.order.article.sku,
            stock_current=req.current_stock_for_article,
            delivery_time_days=order_with_forecast.order.article.delivery_time,
            critical_date_min_stock_breach=order_with_forecast.order.critical_min_stock_date,
            recommended_order_date=order_with_forecast.order.recommended_order_date,
            recommended_order_quantity=order_with_forecast.order.quantity,
            producer_id=order_with_forecast.order.article.producer_id,
            division_id=order_with_forecast.order.article.production_line,
            forecast=forecast_resp_list
        )