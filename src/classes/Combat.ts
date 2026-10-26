import { Pokemon } from "./Pokemon";
import { Dresseur } from "./Dresseur";

type ResultatCombat = {
  gagnant: string;
  dresseur1: Dresseur;
  dresseur2: Dresseur;
};

export class Combat {
  private static vivants(dresseur: Dresseur): Pokemon[] {
    return dresseur.pokemons.filter((pokemon) => !pokemon.estKO());
  }

  private static aleatoire(dresseur: Dresseur): Pokemon | undefined {
    const liste = this.vivants(dresseur);
    return liste[Math.floor(Math.random() * liste.length)];
  }

  private static meilleur(dresseur: Dresseur): Pokemon | undefined {
    return this.vivants(dresseur).sort((a, b) => b.lifePoint - a.lifePoint)[0];
  }

  private static combatPokemons(p1: Pokemon, p2: Pokemon): Pokemon | null {
    let attaquant = Math.random() < 0.5 ? p1 : p2;
    let cible = attaquant === p1 ? p2 : p1;

    while (!p1.estKO() && !p2.estKO()) {
      const disponibleAttaquant = attaquant.attaques.some((a) => a.estDisponible());
      const disponibleCible = cible.attaques.some((a) => a.estDisponible());

      if (!disponibleAttaquant && !disponibleCible) {
        return null;
      }
      if (!disponibleAttaquant) {
        const temporaire = attaquant;
        attaquant = cible;
        cible = temporaire;
        continue;
      }

      attaquant.attaquer(cible);
      if (cible.estKO()) {
        return attaquant;
      }

      const temporaire = attaquant;
      attaquant = cible;
      cible = temporaire;
    }

    if (p1.estKO() && p2.estKO()) return null;
    return p1.estKO() ? p2 : p1;
  }

  private static resultat(d1: Dresseur, d2: Dresseur, gagnant: Dresseur | null): ResultatCombat {
    return { gagnant: gagnant?.nom ?? "égalité", dresseur1: d1, dresseur2: d2 };
  }

  private static gagner(dresseur: Dresseur): void {
    dresseur.gagnerExperience(2);
  }

  static defiAleatoire(d1: Dresseur, d2: Dresseur): ResultatCombat {
    d1.soignerALaTaverne();
    d2.soignerALaTaverne();
    if (this.vivants(d1).length === 0 || this.vivants(d2).length === 0) {
      throw new Error("Chaque dresseur doit posséder au moins un Pokémon en vie.");
    }

    while (this.vivants(d1).length > 0 && this.vivants(d2).length > 0) {
      const p1 = this.aleatoire(d1);
      const p2 = this.aleatoire(d2);
      if (!p1 || !p2) break;
      const vainqueur = this.combatPokemons(p1, p2);
      if (!vainqueur) return this.resultat(d1, d2, null);
      this.gagner(vainqueur === p1 ? d1 : d2);
    }

    return this.resultat(d1, d2, this.vivants(d1).length > 0 ? d1 : d2);
  }

  static arene1(d1: Dresseur, d2: Dresseur): ResultatCombat {
    for (let i = 0; i < 100; i++) {
      if (this.vivants(d1).length === 0 || this.vivants(d2).length === 0) break;
      const p1 = this.aleatoire(d1);
      const p2 = this.aleatoire(d2);
      if (!p1 || !p2) break;
      p1.soigner();
      p2.soigner();
      const vainqueur = this.combatPokemons(p1, p2);
      if (vainqueur) this.gagner(vainqueur === p1 ? d1 : d2);
    }

    let gagnant: Dresseur | null = null;
    if (d1.level > d2.level || (d1.level === d2.level && d1.experience > d2.experience)) gagnant = d1;
    if (d2.level > d1.level || (d1.level === d2.level && d2.experience > d1.experience)) gagnant = d2;
    return this.resultat(d1, d2, gagnant);
  }

  static defiDeterministe(d1: Dresseur, d2: Dresseur): ResultatCombat {
    if (this.vivants(d1).length === 0 || this.vivants(d2).length === 0) {
      throw new Error("Chaque dresseur doit posséder au moins un Pokémon en vie.");
    }

    while (this.vivants(d1).length > 0 && this.vivants(d2).length > 0) {
      const p1 = this.meilleur(d1);
      const p2 = this.meilleur(d2);
      if (!p1 || !p2) break;
      const vainqueur = this.combatPokemons(p1, p2);
      if (!vainqueur) return this.resultat(d1, d2, null);
      this.gagner(vainqueur === p1 ? d1 : d2);
    }

    return this.resultat(d1, d2, this.vivants(d1).length > 0 ? d1 : d2);
  }

  static arene2(d1: Dresseur, d2: Dresseur): ResultatCombat {
    if (this.vivants(d1).length === 0 || this.vivants(d2).length === 0) {
      throw new Error("Chaque dresseur doit posséder au moins un Pokémon en vie.");
    }

    for (let i = 0; i < 100; i++) {
      if (this.vivants(d1).length === 0 || this.vivants(d2).length === 0) break;
      const p1 = this.meilleur(d1);
      const p2 = this.meilleur(d2);
      if (!p1 || !p2) break;
      const vainqueur = this.combatPokemons(p1, p2);
      if (!vainqueur) break;
      this.gagner(vainqueur === p1 ? d1 : d2);
    }

    const vivants1 = this.vivants(d1).length;
    const vivants2 = this.vivants(d2).length;
    let gagnant: Dresseur | null = null;

    if (vivants1 === 0 && vivants2 > 0) gagnant = d2;
    else if (vivants2 === 0 && vivants1 > 0) gagnant = d1;
    else if (d1.level > d2.level || (d1.level === d2.level && d1.experience > d2.experience)) gagnant = d1;
    else if (d2.level > d1.level || (d1.level === d2.level && d2.experience > d1.experience)) gagnant = d2;

    return this.resultat(d1, d2, gagnant);
  }
}