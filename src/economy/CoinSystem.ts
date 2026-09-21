export class CoinSystem {
  private coins = 0;

  add(amount: number): void {
    if (amount <= 0) {
      return;
    }

    this.coins += amount;
  }

  spend(amount: number): boolean {
    if (amount <= 0) {
      return false;
    }

    if (this.coins < amount) {
      return false;
    }

    this.coins -= amount;

    return true;
  }

  getCoins(): number {
    return this.coins;
  }

  reset(): void {
    this.coins = 0;
  }
}