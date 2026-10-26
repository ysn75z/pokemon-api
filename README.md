# API Pokémon

API REST de gestion de Pokémon développée avec Express 5, TypeScript et PostgreSQL.

## Installation

1. Installer Node.js LTS et PostgreSQL.
2. Créer la base `pokemon`, puis exécuter `database.sql`.
3. Copier `.env.example` vers `.env` et renseigner `DB_PASSWORD`.
4. Installer les dépendances avec `npm install`.
5. Lancer le serveur avec `npm run dev`.
6. Vérifier `http://localhost:3000/dresseurs`.

## Routes

| Méthode | URL | Exemple de body |
|---|---|---|
| GET | `/attaques` | Aucun |
| GET | `/attaques/:id` | Aucun |
| POST | `/attaques` | `{"nom":"Éclair","damage":20,"usageLimit":5}` |
| GET | `/pokemons` | Aucun |
| GET | `/pokemons/:id` | Aucun |
| POST | `/pokemons` | `{"nom":"Pikachu","lifePoint":100,"lifePointMax":100}` |
| POST | `/pokemons/:id/apprendre` | `{"attaqueId":1}` |
| POST | `/pokemons/:id/soigner` | Aucun |
| POST | `/pokemons/:id/attaquer/:cibleId` | Aucun |
| GET | `/dresseurs` | Aucun |
| GET | `/dresseurs/:id` | Aucun |
| POST | `/dresseurs` | `{"nom":"Sacha"}` |
| POST | `/dresseurs/:id/pokemons` | `{"pokemonId":1}` |
| POST | `/dresseurs/:id/taverne` | Aucun |
| POST | `/dresseurs/:id/experience` | `{"points":4}` |
| POST | `/combats/aleatoire` | `{"dresseur1Id":1,"dresseur2Id":2}` |
| POST | `/combats/arene1` | `{"dresseur1Id":1,"dresseur2Id":2}` |
| POST | `/combats/deterministe` | `{"dresseur1Id":1,"dresseur2Id":2}` |
| POST | `/combats/arene2` | `{"dresseur1Id":1,"dresseur2Id":2}` |

## Commandes

- `npm run dev` : serveur en développement.
- `npm run build` : compilation TypeScript.
- `npm start` : démarrage de la version compilée.

## Réponses d'erreur

L'API renvoie `400` pour une requête invalide et `404` lorsqu'un élément demandé n'existe pas.
