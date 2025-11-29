from logging.config import dictConfig

def setup_logging():
    dictConfig({
        "version": 1,
        "disable_existing_loggers": False,

        "formatters": {
            "standard": {
                "format": "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
            }
        },

        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "standard",
            }
        },

        # To see wich loggers are available use root.level=DEBUG
        "root": {
            "level": "INFO",
            "handlers": ["console"]
        },

        # Optional: FastAPI/Uvicorn Logger anpassen
        "loggers": {
            "uvicorn": {"level": "DEBUG"},
            "uvicorn.error": {"level": "ERROR"},
            "uvicorn.access": {"level": "INFO"},

            # Loggers of this application
            #"application": {"level": "DEBUG"},
            #"domain": {"level": "DEBUG"},
        }
    })