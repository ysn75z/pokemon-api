CREATE TABLE IF NOT EXISTS dresseurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
    experience INTEGER NOT NULL DEFAULT 0 CHECK (experience >= 0)
);

CREATE TABLE IF NOT EXISTS pokemons (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    life_point INTEGER NOT NULL CHECK (life_point >= 0),
    life_point_max INTEGER NOT NULL CHECK (life_point_max > 0),
    CHECK (life_point <= life_point_max)
);

CREATE TABLE IF NOT EXISTS attaques (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    damage INTEGER NOT NULL CHECK (damage > 0),
    usage_limit INTEGER NOT NULL CHECK (usage_limit > 0)
);

CREATE TABLE IF NOT EXISTS pokemon_attaques (
    pokemon_id INTEGER NOT NULL REFERENCES pokemons(id) ON DELETE CASCADE,
    attaque_id INTEGER NOT NULL REFERENCES attaques(id) ON DELETE RESTRICT,
    compteur_usage INTEGER NOT NULL DEFAULT 0 CHECK (compteur_usage >= 0),
    PRIMARY KEY (pokemon_id, attaque_id)
);

CREATE TABLE IF NOT EXISTS dresseur_pokemons (
    dresseur_id INTEGER NOT NULL REFERENCES dresseurs(id) ON DELETE CASCADE,
    pokemon_id INTEGER NOT NULL UNIQUE REFERENCES pokemons(id) ON DELETE CASCADE,
    PRIMARY KEY (dresseur_id, pokemon_id)
);