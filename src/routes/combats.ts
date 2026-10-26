import { Router } from "express";
import { Combat } from "../classes/Combat";
import { chargerDresseur, sauvegarderDresseur, convertirId } from "../database/requetes";

const router = Router();

async function executerCombat(
  req: import("express").Request,
  res: import("express").Response,
  mode: "aleatoire" | "arene1" | "deterministe" | "arene2"
): Promise<void> {
  const body = req.body || {};
  const id1 = convertirId(String(body.dresseur1Id ?? ""));
  const id2 = convertirId(String(body.dresseur2Id ?? ""));

  if (id1 === null || id2 === null) {
    res.status(400).json({ erreur: "dresseur1Id et dresseur2Id sont obligatoires." });
    return;
  }
  if (id1 === id2) {
    res.status(400).json({ erreur: "Les deux dresseurs doivent être différents." });
    return;
  }

  const d1 = await chargerDresseur(id1);
  const d2 = await chargerDresseur(id2);
  if (!d1 || !d2) {
    res.status(404).json({ erreur: "Un des dresseurs est introuvable." });
    return;
  }
  if (d1.pokemons.length === 0 || d2.pokemons.length === 0) {
    res.status(400).json({ erreur: "Chaque dresseur doit posséder au moins un Pokémon." });
    return;
  }

  try {
    const resultat = mode === "aleatoire"
      ? Combat.defiAleatoire(d1, d2)
      : mode === "arene1"
        ? Combat.arene1(d1, d2)
        : mode === "deterministe"
          ? Combat.defiDeterministe(d1, d2)
          : Combat.arene2(d1, d2);

    await sauvegarderDresseur(id1, d1);
    await sauvegarderDresseur(id2, d2);
    res.json(resultat);
  } catch (error) {
    res.status(400).json({ erreur: error instanceof Error ? error.message : "Combat impossible." });
  }
}

router.post("/aleatoire", (req, res) => executerCombat(req, res, "aleatoire"));
router.post("/arene1", (req, res) => executerCombat(req, res, "arene1"));
router.post("/deterministe", (req, res) => executerCombat(req, res, "deterministe"));
router.post("/arene2", (req, res) => executerCombat(req, res, "arene2"));

export default router;