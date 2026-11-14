import {
  Container,
} from "pixi.js";

import {
  EnemyVisual,
  type EnemyVisualType,
} from "../visual/EnemyVisual";

export class Enemy extends Container {
  maxHp = 5;
  attackDamage = 1;

  hp = this.maxHp;

  /** Inner container for idle animation & size, so combat tweens on `this` stay untouched. */
  private readonly body: Container;
  private readonly visual: EnemyVisual;

  private size = 1;
  private idleTime = Math.random() * Math.PI * 2;

  constructor(
    type: EnemyVisualType = "goblin",
  ) {
    super();

    this.body = new Container();
    this.visual = new EnemyVisual(type);

    this.body.addChild(this.visual);
    this.addChild(this.body);
  }

  configure(
    maxHp: number,
    attackDamage: number,
    tint: number,
    size: number,
  ): void {
    this.maxHp = maxHp;
    this.attackDamage = attackDamage;
    this.hp = maxHp;
    this.size = size;

    this.visual.tint = tint;
    this.body.scale.set(size);
  }

  updateIdle(delta: number): void {
    this.idleTime += (delta / 60) * 3;

    const breathe = Math.sin(this.idleTime) * 0.025;

    this.body.scale.set(
      this.size * (1 - breathe * 0.5),
      this.size * (1 + breathe),
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
