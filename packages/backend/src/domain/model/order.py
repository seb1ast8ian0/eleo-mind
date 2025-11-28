from datetime import date

class Order:
    article_id: str
    quantity: int
    when_to_order: date

    def __init__(self, article_id: str, quantity: int, deadline: date):
        self.article_id = article_id,
        self.quantity = quantity,
        self.when_to_order = deadline

    def __str__(self):
        return f"Order(article_id: {self.article_id} | quantity: {self.quantity} | deadline: {self.when_to_order})"