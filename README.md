# MSIT(JWT) : Authentification sécurisée (Hackathon MSIT)

Dans le cadre d’un hackathon proposé par MSIT, le projet **MSIT(JWT)** vise à mettre en place un système d’authentification sécurisé dans une application web moderne.  
Le backend est développé avec Node.js et Express, et utilise les JSON Web Tokens (JWT) pour gérer la session utilisateur.  
Le frontend est une application React créée avec Vite, utilisant TypeScript et TailwindCSS pour une interface claire et responsive.

---

## Fonctionnalités principales

- **Inscription et connexion** : création de compte et login des utilisateurs, avec gestion des erreurs.
- **Gestion des JWT** : utilisation de JSON Web Tokens pour l’authentification avec un *access token* (durée 15 min) et un *refresh token* (7 jours) stockés dans des cookies HttpOnly.
- **Renouvellement de token** : endpoint `/refresh` pour obtenir un nouveau access token.
- **Base de données MySQL** : tables `users` (informations utilisateurs) et `sessions` (historique de connexion avec IP et userAgent).
- **ORM Prisma** : accès aux données via Prisma pour éviter les injections SQL.
- **Hashage des mots de passe** : `bcrypt` pour hacher les mots de passe.
- **Validation des entrées** : `express-validator` pour vérifier les données envoyées par l'utilisateur.
- **Protection des routes** : middleware Express pour protéger les routes sensibles.

---

## Technologies utilisées

- **Backend** : Node.js, Express, MySQL, Prisma ORM, JSON Web Token, bcrypt, express-validator, cookie-parser, cors, dotenv.
- **Frontend** : React, Vite, TypeScript, TailwindCSS.

---

## Architecture

- **Client (React)** : interface de login et register.
- **Serveur (Express)** : API REST gérant l'authentification.
- **Base de données (MySQL)** : stockage des utilisateurs et sessions.

> Flux : Client React ➔ API Express ➔ Prisma ➔ MySQL

---

## Installation et lancement

### 1. Cloner le projet
```bash
git clone https://github.com/Islem-Chammakhi/MSIT-JWT.git
```
### 2. Backend
```bash
cd API
npm install
# Créer un fichier .env avec :
# DATABASE_URL, RefreshToken, AccessToken,PORT
npx prisma migrate dev
npm run dev
```
### 3. Frontend
```CLIENT
cd client
npm install
npm run dev
```

