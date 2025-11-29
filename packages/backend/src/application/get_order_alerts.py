import logging

from domain.service.service import Service
from domain.model.order import Order

from application.models.alerts_response import OrderPredictionResponse, OrderAlertsResponse, OrderPredictionRequest


class GetOrderAlertsRout:

    svc: Service
    logger: logging.Logger = logging.getLogger(__name__)

    def __init__(self, svc: Service):
        self.svc = svc

    # def get_order_prediction(self, req: OrderPredictionRequest):
    #
    #     self.logger.info(f"/order_alerts got called with request body {req}")
    #
    #     domain_orders: list[Order] = self.svc.get_orders(
    #         req.global_current_stock, req.global_min_stock
    #     )
    #
    #     order_alerts: list[OrderPredictionResponse] = []
    #
    #     for domain_order in domain_orders:
    #         order_alerts.append(
    #             OrderPredictionResponse(
    #                 article_id=domain_order.article.sku,
    #                 coating=domain_order.article.coating,
    #                 stock_current=domain_order.current_stock,
    #                 delivery_time_in_days=domain_order.article.delivery_time,
    #                 division_id=domain_order.article.production_line,
    #                 producer_id=domain_order.article.producer_id,
    #                 recommended_order_date=domain_order.recommended_order_date,
    #                 recommended_order_quantity=domain_order.quantity,
    #                 critical_date_min_stock_breach=domain_order.critical_min_stock_date
    #             )
    #         )
    #
    #     return OrderAlertsResponse(alerts=order_alerts)