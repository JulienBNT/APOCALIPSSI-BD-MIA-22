from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine

analyzer = AnalyzerEngine()  # Par défaut en anglais
anonymizer = AnonymizerEngine()

def anonymize_text(text):
    results = analyzer.analyze(text=text, language='en')
    if not results:
        print("Aucun PII détecté")
        return text
    anonymized_result = anonymizer.anonymize(text=text, analyzer_results=results)
    return anonymized_result.text