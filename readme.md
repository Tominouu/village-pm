# village-pm

Projet web créé avec **Node.js**, **Express** et **EJS**.

## Framework utilisé

Ce projet utilise **Express.js** comme framework principal côté serveur.

## Librairies utilisées dans le code JavaScript

Dans le fichier `app.js`, on retrouve principalement :

- **express** : pour créer le serveur web, gérer les routes et servir les fichiers statiques.
- **ejs** : utilisé comme moteur de templates pour afficher les vues.

## Fonctionnement du projet

Le serveur :

- démarre sur le port `3000`
- utilise **EJS** comme moteur de vues
- sert les fichiers statiques depuis le dossier `public`

## Dépendances du projet

### Dépendances principales
- `express`
- `ejs`

## Lancement en local

```bash
npm install
npm run dev