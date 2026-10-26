import { connexion } from "./connexion";
import { Attaque } from "../classes/Attaque";
import { Pokemon } from "../classes/Pokemon";
import { Dresseur } from "../classes/Dresseur";

export async function listerAttaques(): Promise<Record<string, unknown>[]> {
  const resultat = await connexion.query("SELECT * FROM attaques ORDER BY id");
  return resultat.rows;
}

export async function chargerAttaque(id: number): Promise<Attaque | null> {
  const resultat = await connexion.query("SELECT * FROM attaques WHERE id = $1", [id]);
  const ligne = resultat.rows[0];
  return ligne ? new Attaque(ligne.nom, ligne.damage, ligne.usage_limit) : null;
}

export async function creerAttaque(nom: string, damage: number, usageLimit: number): Promise<Record<string, unknown>> {
  const resultat = await connexion.query(
    "INSERT INTO attaques (nom, damage, usage_limit) VALUES ($1, $2, $3) RETURNING *",
    [nom, damage, usageLimit]
  );
  return resultat.rows[0];
}

export async function sauvegarderAttaque(pokemonId: number, attaqueId: number, compteur: number): Promise<void> {
  await connexion.query(
    "UPDATE pokemon_attaques SET compteur_usage = $3 WHERE pokemon_id = $1 AND attaque_id = $2",
    [pokemonId, attaqueId, compteur]
  );
}

export async function listerPokemons(): Promise<Record<string, unknown>[]> {
  const resultat = await connexion.query(`
    SELECT p.*, COALESCE(
      json_agg(json_build_object(
        'id', a.id, 'nom', a.nom, 'damage', a.damage,
        'usageLimit', a.usage_limit, 'compteurUsage', pa.compteur_usage
      )) FILTER (WHERE a.id IS NOT NULL), '[]'
    ) AS attaques
    FROM pokemons p
    LEFT JOIN pokemon_attaques pa ON pa.pokemon_id = p.id
    LEFT JOIN attaques a ON a.id = pa.attaque_id
    GROUP BY p.id ORDER BY p.id
  `);
  return resultat.rows;
}

export async function chargerPokemon(id: number): Promise<Pokemon | null> {
  const resultat = await connexion.query(`
    SELECT p.id, p.nom, p.life_point, p.life_point_max,
      a.nom AS attaque_nom, a.damage, a.usage_limit, pa.compteur_usage
    FROM pokemons p
    LEFT JOIN pokemon_attaques pa ON pa.pokemon_id = p.id
    LEFT JOIN attaques a ON a.id = pa.attaque_id
    WHERE p.id = $1 ORDER BY a.id
  `, [id]);

  if (resultat.rows.length === 0) return null;
  const premiere = resultat.rows[0];
  const attaques = resultat.rows
    .filter((ligne) => ligne.attaque_nom !== null)
    .map((ligne) => new Attaque(ligne.attaque_nom, ligne.damage, ligne.usage_limit, ligne.compteur_usage));

  const pokemon = new Pokemon(premiere.nom, premiere.life_point, premiere.life_point_max, attaques);
  Object.assign(pokemon, { id: premiere.id });
  return pokemon;
}

export async function creerPokemon(nom: string, lifePoint: number, lifePointMax: number): Promise<Record<string, unknown>> {
  const resultat = await connexion.query(
    "INSERT INTO pokemons (nom, life_point, life_point_max) VALUES ($1, $2, $3) RETURNING *",
    [nom, lifePoint, lifePointMax]
  );
  return resultat.rows[0];
}

export async function apprendreAttaquePokemon(pokemonId: number, attaqueId: number): Promise<void> {
  await connexion.query(
    "INSERT INTO pokemon_attaques (pokemon_id, attaque_id) VALUES ($1, $2)",
    [pokemonId, attaqueId]
  );
}

export async function sauvegarderPokemon(id: number, pokemon: Pokemon): Promise<void> {
  await connexion.query(
    "UPDATE pokemons SET life_point = $2 WHERE id = $1",
    [id, pokemon.lifePoint]
  );
  for (const attaque of pokemon.attaques) {
    await connexion.query(`
      UPDATE pokemon_attaques pa
      SET compteur_usage = $3
      FROM attaques a
      WHERE pa.pokemon_id = $1 AND pa.attaque_id = a.id AND a.nom = $2
    `, [id, attaque.nom, attaque.compteurUsage]);
  }
}

export async function listerDresseurs(): Promise<Record<string, unknown>[]> {
  const resultat = await connexion.query(`
    SELECT d.id, d.nom, d.level, d.experience,
      COALESCE(json_agg(json_build_object(
        'id', p.id, 'nom', p.nom, 'lifePoint', p.life_point,
        'lifePointMax', p.life_point_max
      )) FILTER (WHERE p.id IS NOT NULL), '[]') AS pokemons
    FROM dresseurs d
    LEFT JOIN dresseur_pokemons dp ON dp.dresseur_id = d.id
    LEFT JOIN pokemons p ON p.id = dp.pokemon_id
    GROUP BY d.id ORDER BY d.id
  `);
  return resultat.rows;
}

export async function chargerDresseur(id: number): Promise<Dresseur | null> {
  const resultat = await connexion.query(`
    SELECT d.id AS dresseur_id, d.nom AS dresseur_nom, d.level, d.experience,
      p.id AS pokemon_id, p.nom AS pokemon_nom, p.life_point, p.life_point_max,
      a.nom AS attaque_nom, a.damage, a.usage_limit, pa.compteur_usage
    FROM dresseurs d
    LEFT JOIN dresseur_pokemons dp ON dp.dresseur_id = d.id
    LEFT JOIN pokemons p ON p.id = dp.pokemon_id
    LEFT JOIN pokemon_attaques pa ON pa.pokemon_id = p.id
    LEFT JOIN attaques a ON a.id = pa.attaque_id
    WHERE d.id = $1 ORDER BY p.id, a.id
  `, [id]);

  if (resultat.rows.length === 0) return null;
  const ligne = resultat.rows[0];
  const dresseur = new Dresseur(ligne.dresseur_nom, ligne.level, ligne.experience, []);
  Object.assign(dresseur, { id: ligne.dresseur_id });
  const parId = new Map<number, Pokemon>();

  for (const row of resultat.rows) {
    if (row.pokemon_id === null) continue;
    let pokemon = parId.get(row.pokemon_id);
    if (!pokemon) {
      pokemon = new Pokemon(row.pokemon_nom, row.life_point, row.life_point_max, []);
      Object.assign(pokemon, { id: row.pokemon_id });
      parId.set(row.pokemon_id, pokemon);
      dresseur.pokemons.push(pokemon);
    }
    if (row.attaque_nom !== null) {
      pokemon.attaques.push(new Attaque(row.attaque_nom, row.damage, row.usage_limit, row.compteur_usage));
    }
  }
  return dresseur;
}

export async function creerDresseur(nom: string): Promise<Record<string, unknown>> {
  const resultat = await connexion.query(
    "INSERT INTO dresseurs (nom) VALUES ($1) RETURNING *", [nom]
  );
  return resultat.rows[0];
}

export async function ajouterPokemonDresseur(dresseurId: number, pokemonId: number): Promise<void> {
  await connexion.query(
    "INSERT INTO dresseur_pokemons (dresseur_id, pokemon_id) VALUES ($1, $2)",
    [dresseurId, pokemonId]
  );
}

export async function sauvegarderDresseur(id: number, dresseur: Dresseur): Promise<void> {
  await connexion.query(
    "UPDATE dresseurs SET level = $2, experience = $3 WHERE id = $1",
    [id, dresseur.level, dresseur.experience]
  );
  for (const pokemon of dresseur.pokemons) {
    const pokemonId = (pokemon as Pokemon & { id?: number }).id;
    if (pokemonId) await sauvegarderPokemon(pokemonId, pokemon);
  }
}

export function convertirId(valeur: string): number | null {
  const id = Number(valeur);
  return Number.isInteger(id) && id > 0 ? id : null;
}