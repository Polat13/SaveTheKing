import {
  Container,
} from "pixi.js";

import {
  EnemyVisual,
} from "../visual/EnemyVisual";

import {
  CreatureVisual,
  type CreatureType,
} from "../visual/CreatureVisual";

export type EnemyKind =
  | "goblin"
  | CreatureType;

export class Enemy extends Container {
  maxHp = 5;
  attackDamage = 1;

  hp = this.maxHp;

  /** Inner container for idle animation & size, so combat tweens on `this` stay untouched. */
  private readonly body: Container;

  private readonly goblin: EnemyVisual;
  private readonly creatures = new Map<CreatureType, CreatureVisual>();
  private activeCreature: CreatureVisual | null = null;

  private size = 1;
  private idleTime = Math.random() * Math.PI * 2;

  constructor() {
    super();

    this.body = new Container();
    this.goblin = new EnemyVisual("goblin");

    this.body.addChild(this.goblin);
    this.addChild(this.body);
  }

  configure(
    kind: EnemyKind,
    maxHp: number,
    attackDamage: number,
    tint: number,
    size: number,
  ): void {
    this.maxHp = maxHp;
    this.attackDamage = attackDamage;
    this.hp = maxHp;
    this.size = size;

    this.showKind(kind, tint);
    this.body.scale.set(size);
  }

  updateIdle(delta: number): void {
    this.idleTime += (delta / 60) * 3;

    const breathe = Math.sin(this.idleTime) * 0.025;

    this.body.scale.set(
      this.size * (1 - breathe * 0.5),
      this.size * (1 + breathe),
    );

    this.activeCreature?.animate(this.idleTime);
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

  private showKind(
    kind: EnemyKind,
    tint: number,
  ): void {
    this.goblin.visible = kind === "goblin";

    for (const creature of this.creatures.values()) {
      creature.visible = false;
    }

    this.activeCreature = null;

    if (kind === "goblin") {
      this.goblin.tint = tint;

      return;
    }

    let creature = this.creatures.get(kind);

    if (!creature) {
      creature = new CreatureVisual(kind);
      this.creatures.set(kind, creature);
      this.body.addChild(creature);
    }

    creature.visible = true;
    creature.tint = tint;

    this.activeCreature = creature;
  }
}
