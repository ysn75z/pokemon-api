import { Router } from "express";
import { connexion } from "../database/connexion";
import {
  apprendreAttaquePokemon, chargerAttaque, chargerPokemon, creerPokemon,
  listerPokemons, sauvegarderPokemon, convertirId
} from "../database/requetes";

const router = Router();

router.get("/", async (_req, res) => {
  res.json(await listerPokemons());
});

router.get("/:id", async (req, res) => {
  const id = convertirId(req.params.id);
  if (id === null) return res.status(404).json({ erreur: "Pokémon introuvable." });
  const resultat = await connexion.query("SELECT * FROM pokemons WHERE id = $1", [id]);
  if (!resultat.rows[0]) return res.status(404).json({ erreur: "Pokémon introuvable." });
  const pokemon = await chargerPokemon(id);
  res.json({ ...resultat.rows[0], attaques: pokemon?.attaques });
});

router.post("/", async (req, res) => {
  const body = req.body || {};
  const { nom, lifePoint, lifePointMax } = body;
  const max = lifePointMax ?? lifePoint;
  if (typeof nom !== "string" || !nom.trim() || !Number.isInteger(lifePoint) || lifePoint <= 0 || !Number.isInteger(max) || max <= 0 || lifePoint > max) {
    return res.status(400).json({ erreur: "nom, lifePoint positif et lifePointMax supérieur ou égal aux PV sont obligatoires." });
  }
  res.status(201).json(await creerPokemon(nom.trim(), lifePoint, max));
});

router.post("/:id/apprendre", async (req, res) => {
  const id = convertirId(req.params.id);
  if (id === null) return res.status(404).json({ erreur: "Pokémon introuvable." });
  const body = req.body || {};
  const attaqueId = convertirId(String(body.attaqueId ?? ""));
  const pokemon = await chargerPokemon(id);
  if (!pokemon) return res.status(404).json({ erreur: "Pokémon introuvable." });
  if (attaqueId === null) return res.status(400).json({ erreur: "attaqueId est obligatoire." });
  const attaque = await chargerAttaque(attaqueId);
  if (!attaque) return res.status(404).json({ erreur: "Attaque introuvable." });
  try {
    pokemon.apprendreAttaque(attaque);
  } catch (error) {
    return res.status(400).json({ erreur: error instanceof Error ? error.message : "Règle non respectée." });
  }
  try {
    await apprendreAttaquePokemon(id, attaqueId);
  } catch {
    return res.status(400).json({ erreur: "Cette attaque est déjà connue par ce Pokémon." });
  }
  res.json({ message: "Attaque apprise.", pokemon: { nom: pokemon.nom, attaques: pokemon.attaques } });
});

router.post("/:id/soigner", async (req, res) => {
  const id = convertirId(req.params.id);
  if (id === null) return res.status(404).json({ erreur: "Pokémon introuvable." });
  const pokemon = await chargerPokemon(id);
  if (!pokemon) return res.status(404).json({ erreur: "Pokémon introuvable." });
  pokemon.soigner();
  await sauvegarderPokemon(id, pokemon);
  res.json({ message: "Pokémon soigné.", pokemon });
});

router.post("/:id/attaquer/:cibleId", async (req, res) => {
  const id = convertirId(req.params.id);
  const cibleId = convertirId(req.params.cibleId);
  if (id === null || cibleId === null) return res.status(404).json({ erreur: "Pokémon introuvable." });
  const pokemon = await chargerPokemon(id);
  const cible = await chargerPokemon(cibleId);
  if (!pokemon || !cible) return res.status(404).json({ erreur: "Pokémon introuvable." });
  try {
    const message = pokemon.attaquer(cible);
    await sauvegarderPokemon(id, pokemon);
    await sauvegarderPokemon(cibleId, cible);
    res.json({ message, pokemon, cible });
  } catch (error) {
    res.status(400).json({ erreur: error instanceof Error ? error.message : "Combat impossible." });
  }
});

export default router;