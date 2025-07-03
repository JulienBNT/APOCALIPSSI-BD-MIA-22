# 🧠 Résumeur de PDF – Backend Flask

API REST en Flask permettant d'uploader un fichier PDF, d'en extraire le texte et de le résumer automatiquement grâce à Ollama avec le modèle Mistral en local.

---

## 📁 Structure du projet

```
back/
├── app/
│   ├── controllers/
│   │   └── resume_controller.py    # Logique d'extraction et de résumé
│   ├── models/
│   │   ├── __init__.py
│   │   ├── summary_model.py        # Modèle pour les résumés
│   │   └── user_model.py           # Modèle utilisateur
│   ├── routes/
│   │   ├── auth_route.py           # Routes d'authentification
│   │   └── resume_route.py         # Routes pour les résumés PDF
│   ├── __init__.py
│   └── utils.py                    # Utilitaires
├── venv/                           # Environnement virtuel
├── .dockerignore
├── .env                            # Variables d'environnement (non versionné)
├── .gitignore
├── app.py                          # Point d'entrée Flask
├── Dockerfile                      # Configuration Docker
├── README.md                       # Ce fichier
├── requirements.txt                # Dépendances Python
├── test.pdf                        # Fichier de test
├── test.txt                        # Fichier de test
└── test_unit.py                    # Tests unitaires
```

---

## 🔧 Prérequis

- Python 3.8+
- PostgreSQL 12+
- Ollama installé localement
- Modèle Mistral téléchargé via Ollama
- `pip` ou `venv` pour gestion des paquets

---

## ⚙️ Installation

### 🔹 1. Installer PostgreSQL

```bash
# Sur Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Sur macOS avec Homebrew
brew install postgresql

# Sur Windows
# Télécharger depuis https://www.postgresql.org/download/windows/
```

### 🔹 2. Créer la base de données

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données et l'utilisateur
CREATE DATABASE resume_db;
CREATE USER resume_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE resume_db TO resume_user;
\q
```

### 🔹 3. Installer Ollama

```bash
# Sur macOS/Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Sur Windows
# Télécharger depuis https://ollama.ai/download
```

### 🔹 4. Télécharger le modèle Mistral

```bash
ollama pull mistral
```

### 🔹 5. Cloner le projet

```bash
git clone https://github.com/JulienBNT/APOCALIPSSI-BD-MIA-22.git
cd APOCALIPSSI-BD-MIA-22/back
```

### 🔹 6. Créer un environnement virtuel

```bash
python -m venv venv
source venv/bin/activate   # sous Windows : venv\Scripts\activate
```

### 🔹 7. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 🔹 8. Configurer les variables d'environnement

Crée un fichier `.env` à la racine de `back/` :

```env
# Base de données
DATABASE_URL=postgresql://resume_user:votre_mot_de_passe@localhost:5432/resume_db
```

---

## ▶️ Lancer l'application

### 1. Démarrer PostgreSQL

```bash
# Sur Linux/macOS
sudo systemctl start postgresql
# ou
brew services start postgresql

# Sur Windows (si installé comme service)
net start postgresql-x64-14
```

### 2. Démarrer Ollama

```bash
ollama serve
```

### 3. Lancer le serveur Flask

```bash
python app.py
```

L'application démarre sur :
👉 [http://127.0.0.1:5001](http://127.0.0.1:5001)

---

## 📤 Utilisation de l'API

### 🔐 Authentification

#### Inscription
```bash
curl -X POST http://127.0.0.1:5001/api/register \
  -H "Content-Type: application/json" \
  -d '{"username": "monusername", "password": "monpassword"}'
```

**Réponse :**
```json
{
  "message": "Inscription réussie ✅"
}
```

#### Connexion
```bash
curl -X POST http://127.0.0.1:5001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "monusername", "password": "monpassword"}'
```

**Réponse :**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 📄 Gestion des résumés

#### Générer un résumé (sans sauvegarde)
```bash
curl -X POST http://127.0.0.1:5001/api/upload \
  -F "file=@test.pdf"
```

**Réponse :**
```json
{
  "summary": "Résumé généré du contenu PDF.",
  "filename": "test.pdf",
  "text_length": 1234
}
```

#### Sauvegarder un résumé (authentifié)
```bash
curl -X POST http://127.0.0.1:5001/api/upload/save \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"filename": "test.pdf", "summary_text": "Résumé à sauvegarder..."}'
```

**Réponse :**
```json
{
  "message": "Résumé enregistré avec succès"
}
```

#### Consulter l'historique (authentifié)
```bash
curl -X GET http://127.0.0.1:5001/api/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Réponse :**
```json
[
  {
    "id": 1,
    "filename": "test.pdf",
    "summary": "Résumé du document...",
    "created_at": "2025-01-15T10:30:00"
  }
]
```

#### Supprimer un résumé (authentifié)
```bash
curl -X DELETE http://127.0.0.1:5001/api/history/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Réponse :**
```json
{
  "msg": "Résumé supprimé"
}
```

---

## 🗄️ Base de données

### Structure des tables principales :

- **user** : Gestion des utilisateurs
- **summary** : Stockage des résumés générés

---

## 🧠 Modèle utilisé

- **Modèle** : `Mistral 7B`
- **Plateforme** : Ollama (exécution locale)
- Prend en charge plusieurs langues, dont le français
- Exécution 100% locale, pas besoin de connexion internet
- Confidentialité des données garantie