import {
  loadNumber,
  saveNumber,
} from "../storage/SaveStorage";

const COINS_KEY = "coins";

export class CoinSystem {
  private coins = loadNumber(COINS_KEY);

  add(amount: number): void {
    if (amount <= 0) {
      return;
    }

    this.coins += amount;
    this.save();
  }

  spend(amount: number): boolean {
    if (amount <= 0) {
      return false;
    }

    if (this.coins < amount) {
      return false;
    }

    this.coins -= amount;
    this.save();

    return true;
  }

  getCoins(): number {
    return this.coins;
  }

  canAfford(amount: number): boolean {
    return this.coins >= amount;
  }

  reset(): void {
    this.coins = 0;
    this.save();
  }

  private save(): void {
    saveNumber(COINS_KEY, this.coins);
  }
}
