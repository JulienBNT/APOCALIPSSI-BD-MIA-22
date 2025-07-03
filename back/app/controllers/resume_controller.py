import requests
from PyPDF2 import PdfReader
import os
from flask_jwt_extended import get_jwt_identity
from app.models.user_model import User
from app.models.summary_model import Summary
from app.models import db
from app.utils import anonymize_text

OLLAMA_API_URL = "http://localhost:11434/api/chat"
MAX_TEXT_LENGTH = 4000

def extract_text_from_pdf(file):
    reader = PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text


def upload_and_summarize_pdf(file, user_id=None, save_to_db=True):
    text = extract_text_from_pdf(file)

    if not text.strip():
        raise ValueError("Le PDF semble vide ou le texte est illisible.")

    text = text[:MAX_TEXT_LENGTH]

    # 🔒 Anonymisation PII
    anonymized_text = anonymize_text(text)

    prompt = f"""
Tu es une intelligence artificielle experte en résumé. Lis ce document et produis un résumé clair et fluide, comme si tu l'expliquais à quelqu'un à l'oral. Sois synthétique mais complet.

Voici le contenu à résumer :

{anonymized_text}
"""

    try:
        response = requests.post(OLLAMA_API_URL, json={
            "model": "mistral",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "stream": False
        }, timeout=30)
    except requests.exceptions.ConnectionError:
        raise Exception("⚠️ Ollama ne répond pas. Vérifie qu’il est bien lancé.")
    except requests.exceptions.Timeout:
        raise Exception("⚠️ Temps d’attente dépassé lors de la génération.")

    if response.status_code != 200:
        raise Exception(f"Ollama error: {response.status_code} - {response.text}")

    result = response.json()
    summary_text = result["message"]["content"]

    if save_to_db:
        if not user_id:
            raise ValueError("Impossible d'enregistrer sans utilisateur connecté.")
        user = User.query.get(user_id)
        if not user:
            raise ValueError("Utilisateur introuvable.")

        summary = Summary(
            filename=file.filename,
            summary_text=summary_text,
            original_text=text,
            anonymized_text=anonymized_text,
            user=user
        )
        db.session.add(summary)
        db.session.commit()

    return {
        "summary": summary_text,
        "input_length": len(anonymized_text),
        "filename": file.filename,
    }
