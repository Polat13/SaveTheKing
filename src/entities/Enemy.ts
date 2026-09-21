import {
  Container,
} from "pixi.js";

import {
  EnemyVisual,
  type EnemyVisualType,
} from "../visual/EnemyVisual";

export class Enemy extends Container {
  readonly maxHp = 5;

  hp = this.maxHp;

  private readonly visual: EnemyVisual;

  constructor(
    type: EnemyVisualType = "goblin",
  ) {
    super();

    this.visual =
      new EnemyVisual(type);

    this.addChild(
      this.visual,
    );
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