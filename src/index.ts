import express from "express";
import { connexion } from "./database/connexion";
import attaquesRouter from "./routes/attaques";
import pokemonsRouter from "./routes/pokemons";
import dresseursRouter from "./routes/dresseurs";
import combatsRouter from "./routes/combats";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());
app.use("/attaques", attaquesRouter);
app.use("/pokemons", pokemonsRouter);
app.use("/dresseurs", dresseursRouter);
app.use("/combats", combatsRouter);

app.get("/", (_req, res) => {
  res.json({ message: "API Pokémon opérationnelle." });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : "Erreur interne.";
  res.status(500).json({ erreur: message });
});

app.listen(port, () => {
  console.log(`API Pokémon disponible sur http://localhost:${port}`);
});

connexion.on("error", (error) => {
  console.error("Erreur de connexion PostgreSQL :", error.message);
});