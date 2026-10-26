import { Attaque } from "./Attaque";

export class Pokemon {
  public attaques: Attaque[];

  constructor(
    public nom: string,
    public lifePoint: number,
    public lifePointMax: number,
    attaques: Attaque[] = []
  ) {
    this.attaques = attaques;
  }

  apprendreAttaque(attaque: Attaque): void {
    if (this.attaques.some((a) => a.nom === attaque.nom)) {
      throw new Error("Ce Pokémon connaît déjà cette attaque.");
    }
    if (this.attaques.length >= 4) {
      throw new Error("Un Pokémon ne peut pas apprendre plus de 4 attaques.");
    }
    this.attaques.push(attaque);
  }

  soigner(): void {
    this.lifePoint = this.lifePointMax;
    for (const attaque of this.attaques) {
      attaque.reinitialiser();
    }
  }

  attaquer(cible: Pokemon): string {
    if (this.estKO()) {
      throw new Error("Un Pokémon KO ne peut pas attaquer.");
    }
    if (cible.estKO()) {
      throw new Error("La cible est déjà KO.");
    }

    const disponibles = this.attaques.filter((attaque) => attaque.estDisponible());
    if (disponibles.length === 0) {
      throw new Error("Ce Pokémon n'a plus d'attaque disponible.");
    }

    const attaque = disponibles[Math.floor(Math.random() * disponibles.length)];
    const degats = attaque.utiliser();
    cible.lifePoint = Math.max(0, cible.lifePoint - degats);
    return `${this.nom} utilise ${attaque.nom} sur ${cible.nom} et inflige ${degats} dégâts.`;
  }

  estKO(): boolean {
    return this.lifePoint <= 0;
  }
}