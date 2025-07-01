from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    from app.routes.resume_route import pdf_bp
    app.register_blueprint(pdf_bp, url_prefix='/api')
    return app
