from flask import Blueprint

from api.health import health_bp
from api.recognition import recognition_bp
from api.dataset import dataset_bp
from api.gallery import gallery_bp


def register_blueprints(app):
    app.register_blueprint(health_bp)
    app.register_blueprint(recognition_bp)
    app.register_blueprint(dataset_bp)
    app.register_blueprint(gallery_bp)