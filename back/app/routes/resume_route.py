from flask import Blueprint, request, jsonify
from app.controllers.resume_controller import upload_and_summarize_pdf
import traceback
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.summary_model import Summary
from app.models import db
from app.models.user_model import User

resume_bp = Blueprint('pdf', __name__)


@resume_bp.route('/upload', methods=['POST'])
def generate_resume():
    if 'file' not in request.files:
        return jsonify({"error": "Aucun fichier fourni"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "Nom de fichier vide"}), 400

    try:
        result = upload_and_summarize_pdf(file, user_id=None, save_to_db=False)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@resume_bp.route('/upload/save', methods=['POST'])
@jwt_required()
def save_resume():
    data = request.get_json()
    filename = data.get("filename")
    summary_text = data.get("summary_text")

    if not filename or not summary_text:
        return jsonify({"error": "Champs manquants"}), 400

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    summary = Summary(filename=filename, summary_text=summary_text, user=user)
    db.session.add(summary)
    db.session.commit()

    return jsonify({"message": "Résumé enregistré avec succès"}), 201


@resume_bp.route('/history', methods=['GET'])
@jwt_required()
def list_history():
    user_id = get_jwt_identity()
    summaries = Summary.query.filter_by(user_id=user_id).order_by(Summary.created_at.desc()).all()
    return jsonify([{
        "id": s.id,
        "filename": s.filename,
        "summary": s.summary_text,
        "created_at": s.created_at.isoformat()
    } for s in summaries])


@resume_bp.route('/history/<int:summary_id>', methods=['DELETE'])
@jwt_required()
def delete_summary(summary_id):
    user_id = get_jwt_identity()
    summary = Summary.query.filter_by(id=summary_id, user_id=user_id).first()
    if not summary:
        return jsonify({"error": "Résumé non trouvé"}), 404

    db.session.delete(summary)
    db.session.commit()
    return jsonify({"msg": "Résumé supprimé"})
