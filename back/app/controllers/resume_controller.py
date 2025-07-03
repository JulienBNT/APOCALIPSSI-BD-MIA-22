import requests
from PyPDF2 import PdfReader

OLLAMA_API_URL = "http://localhost:11434/api/chat"
MAX_TEXT_LENGTH = 4000

def extract_text_from_pdf(file):
    reader = PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text.strip()

def upload_and_summarize_pdf(file):
    text = extract_text_from_pdf(file)

    if not text:
        raise ValueError("❌ Le PDF est vide ou le contenu est illisible.")

    if len(text) > MAX_TEXT_LENGTH:
        text = text[:MAX_TEXT_LENGTH]

    prompt = f"""
Tu es une intelligence artificielle experte en résumé. Lis ce document et produis un résumé clair, naturel et concis, comme si tu l'expliquais à quelqu’un à l’oral.

Document :
{text}
"""

    try:
        response = requests.post(OLLAMA_API_URL, json={
            "model": "mistral",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "stream": False
        }, timeout=240)

        response.raise_for_status()

    except requests.exceptions.ConnectionError:
        raise Exception("❌ Ollama ne répond pas. Vérifie qu’il est lancé avec : `ollama run mistral`")
    except requests.exceptions.Timeout:
        raise Exception("❌ Temps d’attente dépassé (60s).")
    except requests.exceptions.RequestException as e:
        raise Exception(f"❌ Erreur HTTP Ollama : {e}")

    result = response.json()
    summary = result.get("message", {}).get("content", "").strip()

    if not summary:
        raise Exception("❌ Résumé vide ou invalide.")

    return {
        "summary": summary,
        "model": "mistral",
        "input_length": len(text)
    }
