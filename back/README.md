# 🧠 Résumeur de PDF – Backend Flask

API REST en Flask permettant d'uploader un fichier PDF, d'en extraire le texte et de le résumer automatiquement grâce à un modèle Hugging Face.

---

## 📁 Structure du projet

```
backend/
├── app.py                      # Point d'entrée Flask
├── controllers/
│   └── pdf_controller.py       # Logique d'extraction et de résumé
├── routes/
│   └── pdf_route.py            # Route d'upload PDF
├── .env                        # Variables d'environnement (non versionné)
├── requirements.txt            # Dépendances Python
└── README.md                   # Ce fichier
```

---

## 🔧 Prérequis

- Python 3.8+
- Compte Hugging Face avec token API
- `pip` ou `venv` pour gestion des paquets

---

## ⚙️ Installation

### 🔹 1. Cloner le projet

```bash
git clone https://github.com/JulienBNT/APOCALIPSSI-BD-MIA-22.git
cd mon-projet/back
```

### 🔹 2. Créer un environnement virtuel

```bash
python -m venv venv
source venv/bin/activate   # sous Windows : venv\Scripts\activate
```

### 🔹 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 🔹 4. Ajouter un fichier .env

Crée un fichier `.env` à la racine de `backend/` :

```env
HUGGINGFACE_API_TOKEN=hf_votre_token
```

Tu peux générer ton token ici : [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

---

## ▶️ Lancer le serveur

```bash
python app.py
```

L'application démarre sur :
👉 [http://127.0.0.1:5000/api/upload](http://127.0.0.1:5000/api/upload)

---

## 📤 Utilisation de l'API

### 📌 Endpoint : `/api/upload`

- **Méthode** : `POST`
- **Form-data** :
  - `file`: fichier PDF

### 🧪 Exemple avec curl :

```bash
curl -X POST -F "file=@test.pdf" http://127.0.0.1:5000/pdf/upload
```

**Réponse :**
```json
{
  "summary": "Résumé généré du contenu PDF."
}
```

---

## 🧠 Modèle utilisé

- **Modèle** : `csebuetnlp/mT5_multilingual_XLSum`
- Prend en charge plusieurs langues, dont le français
- Utilisation via l'API Hugging Face
- Résume des textes jusqu'à ~4000 caractères