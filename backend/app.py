from flask import Flask
from flask_cors import CORS

from api import register_blueprints


def create_app() -> Flask:
    app = Flask(__name__)

    CORS(app)

    register_blueprints(app)

    @app.get("/")
    def index():
        return {
            "application": "OHL Eigenfaces",
            "status": "running",
            "version": "1.0.0",
        }

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        debug=True,
    )