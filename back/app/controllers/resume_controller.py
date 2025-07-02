import requests
from PyPDF2 import PdfReader
import os

OLLAMA_API_URL = "http://localhost:11434/api/chat"
MAX_TEXT_LENGTH = 4000

def extract_text_from_pdf(file):
    reader = PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text


def upload_and_summarize_pdf(file):
    text = extract_text_from_pdf(file)

    if not text.strip():
        raise ValueError("Le PDF semble vide ou le texte est illisible.")

    # Tronquer le texte
    text = text[:MAX_TEXT_LENGTH]

    prompt = f"""
Tu es une intelligence artificielle experte en résumé. Lis ce document et produis un résumé clair et fluide, comme si tu l'expliquais à quelqu'un à l'oral. Sois synthétique mais complet.

Voici le contenu à résumer :

{text}
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
    summary = result["message"]["content"]

    return {
        "summary": summary,
        "model": "mistral",
        "input_length": len(text)
    }
