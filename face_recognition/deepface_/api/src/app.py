# 3rd parth dependencies
from flask import Flask
from flask_cors import CORS

# project dependencies
from deepface_ import DeepFace
from deepface_.api.src.modules.core.routes import blueprint
from deepface_.commons.logger import Logger

logger = Logger()


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(blueprint)
    logger.info(f"Welcome to DeepFace API v{DeepFace.__version__}!")
    return app
