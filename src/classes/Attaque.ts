export class Attaque {
  constructor(
    public nom: string,
    public damage: number,
    public usageLimit: number,
    public compteurUsage: number = 0
  ) {}

  estDisponible(): boolean {
    return this.compteurUsage < this.usageLimit;
  }

  utiliser(): number {
    if (!this.estDisponible()) {
      throw new Error("Cette attaque n'est plus disponible.");
    }
    this.compteurUsage++;
    return this.damage;
  }

  reinitialiser(): void {
    this.compteurUsage = 0;
  }

  afficherInfos(): string {
    return `${this.nom} : ${this.damage} dégâts, ${this.compteurUsage}/${this.usageLimit} utilisations`;
  }
}