from domain.service.service import Service
from domain.model.order import Order

from application.models.order_alerts_response import OrderPredictionResponse, OrderAlerts


class GetOrderAlertsRout:

    svc: Service

    def __init__(self, svc: Service):
        self.svc = svc

    def get_order_prediction(self):
        domain_orders: list[Order] = self.svc.get_orders()

        order_alerts: list[OrderPredictionResponse] = []

        for domain_order in domain_orders:
            order_alerts.append(OrderPredictionResponse(
                article_id=domain_order.article.sku,
                stock_current=domain_order.current_stock,
                delivery_time_in_days=domain_order.article.delivery_time,
                division_id=domain_order.article.production_line,
                producer_id=domain_order.article.producer_id,
                recommended_order_date=domain_order.recommended_order_date,
                recommended_order_quantity=domain_order.quantity,
                critical_date_min_stock_breach=domain_order.critical_min_stock_date
            ))

        return OrderAlerts(alerts=order_alerts)