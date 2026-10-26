import { Router } from "express";
import { chargerAttaque, creerAttaque, listerAttaques, convertirId } from "../database/requetes";
import { connexion } from "../database/connexion";

const router = Router();

router.get("/", async (_req, res) => {
  res.json(await listerAttaques());
});

router.get("/:id", async (req, res) => {
  const id = convertirId(req.params.id);
  if (id === null) return res.status(404).json({ erreur: "Attaque introuvable." });
  const resultat = await connexion.query("SELECT * FROM attaques WHERE id = $1", [id]);
  if (!resultat.rows[0]) return res.status(404).json({ erreur: "Attaque introuvable." });
  const attaque = await chargerAttaque(id);
  res.json({ ...resultat.rows[0], afficherInfos: attaque?.afficherInfos() });
});

router.post("/", async (req, res) => {
  const body = req.body || {};
  const { nom, damage, usageLimit } = body;
  if (typeof nom !== "string" || !nom.trim() || !Number.isInteger(damage) || damage <= 0 || !Number.isInteger(usageLimit) || usageLimit <= 0) {
    return res.status(400).json({ erreur: "nom, damage positif et usageLimit positif sont obligatoires." });
  }
  res.status(201).json(await creerAttaque(nom.trim(), damage, usageLimit));
});

export default router;