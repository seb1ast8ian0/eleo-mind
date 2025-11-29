import logging

from domain.service.service import Service
from domain.model.order import Order
from application.models.alerts_response import GetOrderAlertsRequest, OrderAlertsResponse, OrderPredictionResponse


class GetAlertsRout:

    # GET „/alerts“ mit Top kritischen Artikeln

    svc: Service
    logger: logging.Logger = logging.getLogger(__name__)

    def __init__(self, svc: Service):
        self.svc = svc

    def get_critical_alerts(self, req: GetOrderAlertsRequest) -> OrderAlertsResponse:

        self.logger.info(f"/alerts got called with request body: {req}")

        critical_alerts: list[Order] = self.svc.get_critical_alerts(
            req.global_current_stock, req.global_min_stock, req.amount_of_alerts
        )

        prediction_response: list[OrderPredictionResponse] = []

        for alert in critical_alerts:
            prediction_response.append(
                OrderPredictionResponse(
                    article_id=alert.article.sku,
                    coating=alert.article.coating,
                    recommended_order_date=alert.recommended_order_date,
                    recommended_order_quantity=alert.quantity,
                    critical_date_min_stock_breach=alert.critical_min_stock_date,
                    division_id=alert.article.production_line,
                    producer_id=alert.article.producer_id,
                    stock_current=req.global_current_stock,
                    delivery_time_in_days=alert.article.delivery_time
                )
            )

        return OrderAlertsResponse(
            alerts=prediction_response
        )



