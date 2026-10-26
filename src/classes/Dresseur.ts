import { Pokemon } from "./Pokemon";

export class Dresseur {
  constructor(
    public nom: string,
    public level: number = 1,
    public experience: number = 0,
    public pokemons: Pokemon[] = []
  ) {}

  ajouterPokemon(pokemon: Pokemon): void {
    if (this.pokemons.some((p) => p.nom === pokemon.nom)) {
      throw new Error("Ce dresseur possède déjà un Pokémon portant ce nom.");
    }
    this.pokemons.push(pokemon);
  }

  soignerALaTaverne(): void {
    for (const pokemon of this.pokemons) {
      pokemon.soigner();
    }
  }

  gagnerExperience(points: number): void {
    if (!Number.isInteger(points) || points < 0) {
      throw new Error("Le nombre de points doit être un entier positif ou nul.");
    }
    this.experience += points;
    while (this.experience >= 10) {
      this.level++;
      this.experience -= 10;
    }
  }
}