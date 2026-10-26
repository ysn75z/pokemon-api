# Requêtes Postman

Base URL : `http://localhost:3000`

Pour chaque requête POST avec un body, sélectionner **Body > raw > JSON**.

## 1. Créer les attaques

POST `/attaques`

```json
{"nom":"Éclair","damage":25,"usageLimit":5}
```

POST `/attaques`

```json
{"nom":"Vive-Attaque","damage":15,"usageLimit":8}
```

POST `/attaques`

```json
{"nom":"Flammèche","damage":30,"usageLimit":4}
```

POST `/attaques`

```json
{"nom":"Charge","damage":10,"usageLimit":10}
```

## 2. Créer les Pokémon

POST `/pokemons`

```json
{"nom":"Pikachu","lifePoint":100,"lifePointMax":100}
```

POST `/pokemons`

```json
{"nom":"Salamèche","lifePoint":100,"lifePointMax":100}
```

POST `/pokemons`

```json
{"nom":"Carapuce","lifePoint":100,"lifePointMax":100}
```

POST `/pokemons`

```json
{"nom":"Bulbizarre","lifePoint":100,"lifePointMax":100}
```

## 3. Apprendre les attaques

POST `/pokemons/1/apprendre`

```json
{"attaqueId":1}
```

POST `/pokemons/1/apprendre`

```json
{"attaqueId":2}
```

POST `/pokemons/2/apprendre`

```json
{"attaqueId":3}
```

POST `/pokemons/2/apprendre`

```json
{"attaqueId":4}
```

POST `/pokemons/3/apprendre`

```json
{"attaqueId":1}
```

POST `/pokemons/3/apprendre`

```json
{"attaqueId":4}
```

POST `/pokemons/4/apprendre`

```json
{"attaqueId":3}
```

POST `/pokemons/4/apprendre`

```json
{"attaqueId":2}
```

## 4. Créer les dresseurs

POST `/dresseurs`

```json
{"nom":"Sacha"}
```

POST `/dresseurs`

```json
{"nom":"Ondine"}
```

## 5. Attribuer les Pokémon

POST `/dresseurs/1/pokemons`

```json
{"pokemonId":1}
```

POST `/dresseurs/1/pokemons`

```json
{"pokemonId":2}
```

POST `/dresseurs/2/pokemons`

```json
{"pokemonId":3}
```

POST `/dresseurs/2/pokemons`

```json
{"pokemonId":4}
```

## 6. Vérifier les données

GET `/attaques`

GET `/pokemons`

GET `/dresseurs`

GET `/dresseurs/1`

GET `/dresseurs/2`

## 7. Lancer les quatre modes de combat

POST `/combats/aleatoire`

```json
{"dresseur1Id":1,"dresseur2Id":2}
```

POST `/combats/arene1`

```json
{"dresseur1Id":1,"dresseur2Id":2}
```

POST `/combats/deterministe`

```json
{"dresseur1Id":1,"dresseur2Id":2}
```

POST `/combats/arene2`

```json
{"dresseur1Id":1,"dresseur2Id":2}
```

Les combats modifient les données. Pour comparer les modes dans des conditions identiques, soigner les deux équipes avec `POST /dresseurs/1/taverne` et `POST /dresseurs/2/taverne` avant chaque essai. Les identifiants ci-dessus supposent une base vide au départ.
