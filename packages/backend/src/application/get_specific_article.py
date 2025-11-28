from domain.service.service import Service


class GetSpecificArticleRout:

    svc: Service

    def __init__(self, svc: Service):
        self.svc = svc

    def get_specific_article(self, article_id: str):
        return self.svc.get_article_by_id(article_id)