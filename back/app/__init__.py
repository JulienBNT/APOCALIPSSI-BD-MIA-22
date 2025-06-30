from flask import Flask


def create_app():
    app = Flask(__name__)

    from app.routes.resume_route import pdf_bp
    app.register_blueprint(pdf_bp, url_prefix='/api')

    return app