from flask import Blueprint, request, jsonify
from app.controllers.resume_controller import upload_and_summarize_pdf
import traceback

pdf_bp = Blueprint('pdf', __name__)


@pdf_bp.route('/upload', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and file.filename.lower().endswith('.pdf'):
        try:
            summary = upload_and_summarize_pdf(file)
            return jsonify({'summary': summary})
        except Exception as e:
            print("❌ ERREUR INTERNE SERVEUR :")
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'File is not a PDF'}), 400