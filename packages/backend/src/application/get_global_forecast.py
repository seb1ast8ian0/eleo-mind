from application.models.global_sales_response import GlobalForecastResponse, GlobalForecast
from domain.service.service import Service
from domain.model.global_sales_forecast import GlobalSalesForecast

class GetGlobalForecastRout:

    svc: Service

    def __init__(self, svc: Service):
        self.svc = svc

    def get_global_forecast(self) -> GlobalForecastResponse:
        domain_global_forecast: GlobalSalesForecast = self.svc.get_global_forecast()

        global_forecast: list[GlobalForecast] = []

        for domain_forecast in domain_global_forecast.forecast:
            global_forecast.append(
                GlobalForecast(
                    date=domain_forecast.date,
                    amount=domain_forecast.amount,
                    weather_temperature=domain_forecast.temperature,
                    weather_condition=domain_forecast.weather_condition,
                    is_sale=domain_forecast.is_sale,
                    sale_type=domain_forecast.sale_type
                )
            )
        return GlobalForecastResponse(
            sales_forecast=domain_global_forecast.sales_forecast,
            sales_last_month=domain_global_forecast.sales_last_month,
            forecast=global_forecast
        )