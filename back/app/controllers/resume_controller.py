import requests
import os
from PyPDF2 import PdfReader  # pip install PyPDF2

HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/csebuetnlp/mT5_multilingual_XLSum"
HUGGINGFACE_API_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN")

headers = {
    "Authorization": f"Bearer {HUGGINGFACE_API_TOKEN}"
}


def extract_text_from_pdf(file_storage):
    reader = PdfReader(file_storage)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text


def upload_and_summarize_pdf(file_storage):
    full_text = extract_text_from_pdf(file_storage)

    # Troncature : XLSum tolère un peu plus, mais on limite pour éviter erreurs
    short_text = full_text[:4000]

    payload = {
        "inputs": f"summarize: {short_text}"
    }

    response = requests.post(HUGGINGFACE_API_URL, headers=headers, json=payload)

    if response.status_code != 200:
        raise Exception(f"HuggingFace API error: {response.text}")

    result = response.json()
    return result[0]['summary_text']
