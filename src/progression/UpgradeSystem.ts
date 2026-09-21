import {
  CoinSystem,
} from "../economy/CoinSystem";

export type UpgradeType =
  | "health"
  | "attack";

export class UpgradeSystem {
  private readonly coinSystem: CoinSystem;

  private healthLevel = 0;
  private attackLevel = 0;

  private readonly baseHealth = 3;
  private readonly baseAttack = 1;

  private readonly healthIncrease = 1;
  private readonly attackIncrease = 1;

  private readonly baseHealthCost = 30;
  private readonly baseAttackCost = 30;

  constructor(
    coinSystem: CoinSystem,
  ) {
    this.coinSystem = coinSystem;
  }

  upgrade(
    type: UpgradeType,
  ): boolean {
    const cost = this.getUpgradeCost(type);

    if (
      !this.coinSystem.spend(cost)
    ) {
      return false;
    }

    if (type === "health") {
      this.healthLevel++;
    }

    if (type === "attack") {
      this.attackLevel++;
    }

    return true;
  }

  getHealth(): number {
    return (
      this.baseHealth +
      this.healthLevel *
        this.healthIncrease
    );
  }

  getAttackDamage(): number {
    return (
      this.baseAttack +
      this.attackLevel *
        this.attackIncrease
    );
  }

  getHealthLevel(): number {
    return this.healthLevel;
  }

  getAttackLevel(): number {
    return this.attackLevel;
  }

  getUpgradeCost(
    type: UpgradeType,
  ): number {
    const level =
      type === "health"
        ? this.healthLevel
        : this.attackLevel;

    const baseCost =
      type === "health"
        ? this.baseHealthCost
        : this.baseAttackCost;

    return baseCost + level * 20;
  }

  reset(): void {
    this.healthLevel = 0;
    this.attackLevel = 0;
  }
}