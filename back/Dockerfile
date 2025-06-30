# Dockerfile

# 1. Image de base légère
FROM python:3.10-slim

# 2. Définir le dossier de travail
WORKDIR /app

# 3. Copier les fichiers de dépendances et les installer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copier tout le reste du projet
COPY . .

# 5. Exposer le port par défaut de Flask
EXPOSE 5001

# 6. Variable d’environnement pour éviter erreurs au lancement
ENV FLASK_APP=app.py

# 7. Commande de démarrage
CMD ["python", "app.py"]
