from datetime import date
from domain.model.article import Article

class Order:
    article: Article
    quantity: int
    recommended_order_date: date
    critical_min_stock_date: date
    current_stock: int

    def __init__(self, article: Article, quantity: int, deadline: date, min_stock_date: date, current_stock: int):
        print(f"article: {article}")
        self.article = article
        self.quantity = quantity
        self.recommended_order_date = deadline
        self.critical_min_stock_date = min_stock_date
        self.current_stock = current_stock

    def __str__(self):
        return (f"Order("
                f"article_id: {self.article} |"
                f" quantity: {self.quantity} |"
                f" deadline: {self.recommended_order_date} |"
                f" critical_min_stock_date: {self.critical_min_stock_date} |"
                f" current_stock: {self.current_stock})")