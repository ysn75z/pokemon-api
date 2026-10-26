import { Router } from "express";
import { connexion } from "../database/connexion";
import {
  ajouterPokemonDresseur, chargerDresseur, creerDresseur, listerDresseurs,
  sauvegarderDresseur, convertirId
} from "../database/requetes";

const router = Router();

router.get("/", async (_req, res) => {
  res.json(await listerDresseurs());
});

router.get("/:id", async (req, res) => {
  const id = convertirId(req.params.id);
  if (id === null) return res.status(404).json({ erreur: "Dresseur introuvable." });
  const dresseur = await chargerDresseur(id);
  if (!dresseur) return res.status(404).json({ erreur: "Dresseur introuvable." });
  res.json(dresseur);
});

router.post("/", async (req, res) => {
  const body = req.body || {};
  if (typeof body.nom !== "string" || !body.nom.trim()) {
    return res.status(400).json({ erreur: "Le nom du dresseur est obligatoire." });
  }
  res.status(201).json(await creerDresseur(body.nom.trim()));
});

router.post("/:id/pokemons", async (req, res) => {
  const id = convertirId(req.params.id);
  if (id === null) return res.status(404).json({ erreur: "Dresseur introuvable." });
  const body = req.body || {};
  const pokemonId = convertirId(String(body.pokemonId ?? ""));
  const dresseur = await chargerDresseur(id);
  if (!dresseur) return res.status(404).json({ erreur: "Dresseur introuvable." });
  if (pokemonId === null) return res.status(400).json({ erreur: "pokemonId est obligatoire." });
  const pokemon = await connexion.query("SELECT id FROM pokemons WHERE id = $1", [pokemonId]);
  if (!pokemon.rows[0]) return res.status(404).json({ erreur: "Pokémon introuvable." });
  try {
    await ajouterPokemonDresseur(id, pokemonId);
  } catch {
    return res.status(400).json({ erreur: "Ce Pokémon possède déjà un dresseur." });
  }
  res.status(201).json({ message: "Pokémon ajouté au dresseur." });
});

router.post("/:id/taverne", async (req, res) => {
  const id = convertirId(req.params.id);
  if (id === null) return res.status(404).json({ erreur: "Dresseur introuvable." });
  const dresseur = await chargerDresseur(id);
  if (!dresseur) return res.status(404).json({ erreur: "Dresseur introuvable." });
  dresseur.soignerALaTaverne();
  await sauvegarderDresseur(id, dresseur);
  res.json({ message: "Tous les Pokémon ont été soignés.", dresseur });
});

router.post("/:id/experience", async (req, res) => {
  const id = convertirId(req.params.id);
  if (id === null) return res.status(404).json({ erreur: "Dresseur introuvable." });
  const body = req.body || {};
  const points = body.points;
  if (!Number.isInteger(points) || points < 0) return res.status(400).json({ erreur: "points doit être un entier positif ou nul." });
  const dresseur = await chargerDresseur(id);
  if (!dresseur) return res.status(404).json({ erreur: "Dresseur introuvable." });
  dresseur.gagnerExperience(points);
  await sauvegarderDresseur(id, dresseur);
  res.json(dresseur);
});

export default router;