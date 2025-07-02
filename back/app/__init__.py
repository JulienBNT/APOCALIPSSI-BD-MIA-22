from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.routes.resume_route import resume_bp
from app.routes.auth_route import auth_bp
from app.models import db
from dotenv import load_dotenv
import os

load_dotenv()

jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    app.register_blueprint(resume_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')

    app.config['JWT_SECRET_KEY'] = 'super-secret'
    jwt.init_app(app)

    with app.app_context():
        db.create_all()
    return app
