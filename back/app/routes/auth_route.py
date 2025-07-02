from flask import Blueprint, request, jsonify
from app.models.user_model import User, db
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"error": "Champs manquants"}), 400

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Utilisateur déjà existant"}), 409

    user = User(username=data["username"])
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Inscription réussie ✅"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data["username"]).first()

    if user and user.check_password(data["password"]):
        user_id_str = str(user.id)
        token = create_access_token(identity=user_id_str)
        return jsonify({"token": token})
    return jsonify({"error": "Identifiants invalides"}), 401