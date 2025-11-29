from application.router import AppRouter

from domain.service.service import Service
from domain.model.stock import Stock
from domain.config.logger_cfg import setup_logging

from initlize_data.initialize_stock_df import get_stock_df

def initialize_router() -> AppRouter:
    setup_logging()

    stock_df = get_stock_df()
    stock_service = Stock(stock_df)

    svc = Service(
        stock_service=stock_service
    )

    router = AppRouter(svc)

    return router