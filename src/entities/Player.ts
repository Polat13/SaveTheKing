import {
  Container,
} from "pixi.js";

import {
  PlayerVisual,
} from "../visual/PlayerVisual";

export class Player extends Container {
  maxHp = 3;
  hp = this.maxHp;

  attackDamage = 1;

  private readonly visual: PlayerVisual;

  constructor() {
    super();

    this.visual =
      new PlayerVisual();

    this.addChild(
      this.visual,
    );
  }

  applyStats(
    maxHp: number,
    attackDamage: number,
  ): void {
    this.maxHp = maxHp;
    this.attackDamage = attackDamage;

    this.hp = this.maxHp;
  }

  takeDamage(amount: number): void {
    this.hp = Math.max(
      0,
      this.hp - amount,
    );
  }

  reset(): void {
    this.hp = this.maxHp;
  }

  isDead(): boolean {
    return this.hp <= 0;
  }
}