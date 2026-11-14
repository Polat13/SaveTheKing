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

  /** Inner container for idle animation, so combat tweens on `this` stay untouched. */
  private readonly body: Container;
  private readonly visual: PlayerVisual;

  private idleTime = 0;

  constructor() {
    super();

    this.body = new Container();
    this.visual = new PlayerVisual();

    this.body.addChild(this.visual);
    this.addChild(this.body);
  }

  applyStats(
    maxHp: number,
    attackDamage: number,
  ): void {
    this.maxHp = maxHp;
    this.attackDamage = attackDamage;

    this.hp = this.maxHp;
  }

  updateIdle(delta: number): void {
    this.idleTime += (delta / 60) * 2.5;

    this.body.y = Math.sin(this.idleTime) * 4;
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
