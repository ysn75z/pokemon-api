# Guide d'installation

## 1. Installer Node.js

Vérifier l'installation :

```bash
node -v
npm -v
```

Si Node.js n'est pas installé, télécharger la version LTS depuis https://nodejs.org puis relancer le terminal.

## 2. Installer PostgreSQL

Vérifier :

```bash
psql --version
```

Sur macOS, vérifier aussi le dossier Applications pour PostgreSQL ou Postgres.app. Si PostgreSQL est absent, utiliser l'installeur officiel : https://www.postgresql.org/download/. Garder le port `5432` et noter le mot de passe de l'utilisateur `postgres`.

Sur macOS, ne pas utiliser Homebrew pour cette installation si sa compilation prend trop de temps. Sur macOS, le dossier `bin` est souvent `/Library/PostgreSQL/<version>/bin`. Sous Windows, il est souvent `C:\\Program Files\\PostgreSQL\\<version>\\bin`. Ajouter le dossier correspondant au PATH si `psql` n'est pas reconnu.

## 3. Créer le dossier du projet

Sur Mac, dans Terminal :

```bash
mkdir -p ~/Desktop/pokemon-api
cd ~/Desktop/pokemon-api
code .
```

Sur Windows, dans PowerShell :

```powershell
New-Item -ItemType Directory -Force "$HOME\Desktop\pokemon-api"
Set-Location "$HOME\Desktop\pokemon-api"
code .
```

Si `code .` n'est pas reconnu, ouvrir VS Code depuis le menu Applications/Démarrer puis utiliser Fichier > Ouvrir un dossier et choisir `pokemon-api`.

Copier tous les fichiers du projet dans ce dossier en conservant les sous-dossiers `src`.

## 4. Installer les dépendances

Dans le terminal intégré de VS Code, vérifier que le dossier courant est `pokemon-api`, puis :

```bash
npm install
```

## 5. Créer la base et les tables

Dans un terminal, à la racine du projet :

```bash
createdb -U postgres pokemon
psql -U postgres -d pokemon -f database.sql
```

Le mot de passe ne s'affiche pas quand il est saisi. C'est normal.

Pour éviter de le retaper, uniquement pendant la session courante :

Mac :

```bash
export PGPASSWORD='votre_mot_de_passe'
createdb -U postgres pokemon
psql -U postgres -d pokemon -f database.sql
unset PGPASSWORD
```

Windows PowerShell :

```powershell
$env:PGPASSWORD="votre_mot_de_passe"
createdb -U postgres pokemon
psql -U postgres -d pokemon -f database.sql
Remove-Item Env:PGPASSWORD
```

Si la base existe déjà, la commande `createdb` signale une erreur. Dans ce cas, ne la recrée pas : lance uniquement `psql -U postgres -d pokemon -f database.sql`.

## 6. Créer le fichier `.env`

Mac :

```bash
cp .env.example .env
```

Windows PowerShell :

```powershell
Copy-Item .env.example .env
```

Ouvre `.env` dans VS Code. Renseigne impérativement ces lignes :

```dotenv
DB_USER=postgres
DB_PASSWORD=le_mot_de_passe_choisi_pour_postgres
```

Remplace la valeur de `DB_PASSWORD` par le vrai mot de passe PostgreSQL. Sans cette valeur, la connexion échouera. Ne publie jamais `.env`.

## 7. Lancer le serveur

```bash
npm run dev
```

Ouvre http://localhost:3000/dresseurs. La réponse attendue pour une base vide est `[]`.

La racine http://localhost:3000/ renvoie un message de fonctionnement. Si une autre API sans route racine renvoie `Cannot GET /`, cela signifie simplement que cette route n'est pas définie.

Dans un second terminal, compiler pour vérifier TypeScript :

```bash
npm run build
```

## 8. Problèmes fréquents

- **Commande introuvable** : vérifier l'installation et le PATH, puis fermer et rouvrir le terminal.
- **Mot de passe PostgreSQL incorrect** : vérifier `DB_PASSWORD` dans `.env` et le mot de passe de `postgres`.
- **Port 3000 déjà utilisé** : arrêter l'autre serveur ou modifier `PORT` dans `.env`.
- **No space left on device** : libérer de l'espace disque puis relancer `npm install`.
- **Fichier `.env` oublié** : le copier depuis `.env.example` et remplir `DB_PASSWORD`.
- **Commande lancée depuis le mauvais dossier** : revenir à la racine du projet avec `cd ~/Desktop/pokemon-api` sur Mac ou `Set-Location "$HOME\Desktop\pokemon-api"` sur Windows.
- **Mot de passe postgres oublié** : localiser `pg_hba.conf`, sauvegarder le fichier, changer temporairement la méthode d'authentification locale en `trust`, redémarrer ou recharger le service PostgreSQL, puis exécuter `psql -U postgres -d postgres` et `ALTER USER postgres WITH PASSWORD 'nouveau_mot_de_passe';`. Remettre immédiatement la configuration d'origine et redémarrer PostgreSQL. Le chemin du fichier et la procédure de redémarrage dépendent de l'installation ; sur Windows, le fichier se trouve généralement sous `C:\Program Files\PostgreSQL\<version>\data`, et sur macOS sous le répertoire de données choisi par l'installeur. Ne laissez jamais `trust` activé.

