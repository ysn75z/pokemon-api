# Publication sur GitHub

## 1. Vérifier Git

```bash
git --version
```

Sur Mac, accepter l'installation des outils de développement si macOS le propose. Sur Windows, installer Git depuis https://git-scm.com/.

Configurer son identité une seule fois :

```bash
git config --global user.name "Votre nom"
git config --global user.email "votre-email@example.com"
```

## 2. Créer un dépôt vide

Sur https://github.com/new, créer un dépôt public nommé `pokemon-api`. Ne pas cocher README, `.gitignore` ou licence.

## 3. Publier le projet

Dans le terminal, à la racine de `pokemon-api` :

```bash
git init
git add .
git status
```

Vérifier que `.env` et `node_modules` ne figurent pas parmi les fichiers suivis. Puis :

```bash
git commit -m "API Pokémon"
git branch -M main
git remote add origin https://github.com/VOTRE-NOM/pokemon-api.git
git push -u origin main
```

Remplacer `VOTRE-NOM` par son nom d'utilisateur GitHub.

## 4. Si GitHub demande un mot de passe

GitHub n'accepte plus le mot de passe habituel du compte pour les opérations Git en HTTPS. Créer un token personnel dans les paramètres GitHub, lui donner les droits nécessaires pour le dépôt, puis saisir ce token comme mot de passe lors du push. Ne jamais l'ajouter à un fichier du projet.
