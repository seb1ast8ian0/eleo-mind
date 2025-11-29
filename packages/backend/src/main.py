from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from domain.initialize.initialize_rest_application import initialize_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    app_router = initialize_router()

    app.include_router(app_router.router)

    # for route in app.routes:
    #     print(route.path, route.methods)

    uvicorn.run(app, host="0.0.0.0", port=8080, ws="none")