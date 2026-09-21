import {
  Container,
  Graphics,
} from "pixi.js";

export class Player extends Container {
  maxHp = 3;
  hp = this.maxHp;

  attackDamage = 1;

  constructor() {
    super();

    this.createVisual();
  }

  private createVisual(): void {
    const cape = new Graphics();

    cape.moveTo(-30, 25);
    cape.lineTo(30, 25);
    cape.lineTo(42, 90);
    cape.lineTo(-42, 90);
    cape.closePath();

    cape.fill("#7c3aed");

    const armor = new Graphics();

    armor.roundRect(
      -28,
      15,
      56,
      55,
      10,
    );

    armor.fill("#94a3b8");

    const head = new Graphics();

    head.circle(0, -5, 30);
    head.fill("#f5c7a9");

    const helmet = new Graphics();

    helmet.roundRect(
      -31,
      -35,
      62,
      20,
      8,
    );

    helmet.fill("#64748b");

    const crown = new Graphics();

    crown.moveTo(-22, -42);
    crown.lineTo(-10, -62);
    crown.lineTo(0, -45);
    crown.lineTo(12, -62);
    crown.lineTo(24, -42);
    crown.closePath();

    crown.fill("#facc15");

    const leftEye = new Graphics();

    leftEye.circle(-10, -5, 4);
    leftEye.fill("#111827");

    const rightEye = new Graphics();

    rightEye.circle(10, -5, 4);
    rightEye.fill("#111827");

    const sword = new Graphics();

    sword.roundRect(
      35,
      0,
      10,
      70,
      4,
    );

    sword.fill("#e5e7eb");

    const handle = new Graphics();

    handle.roundRect(
      28,
      62,
      24,
      8,
      4,
    );

    handle.fill("#facc15");

    this.addChild(
      cape,
      armor,
      head,
      helmet,
      crown,
      leftEye,
      rightEye,
      sword,
      handle,
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