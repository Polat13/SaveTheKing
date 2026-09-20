import {
  Container,
  Graphics,
} from "pixi.js";

export class Enemy extends Container {
  readonly maxHp = 5;

  hp = this.maxHp;

  constructor() {
    super();

    this.createVisual();
  }

  private createVisual(): void {
    const body = new Graphics();

    body.roundRect(
      -35,
      10,
      70,
      75,
      12,
    );

    body.fill("#7f1d1d");

    const head = new Graphics();

    head.circle(0, -15, 32);
    head.fill("#ef4444");

    const leftHorn = new Graphics();

    leftHorn.moveTo(-22, -35);
    leftHorn.lineTo(-45, -65);
    leftHorn.lineTo(-8, -42);
    leftHorn.closePath();

    leftHorn.fill("#facc15");

    const rightHorn = new Graphics();

    rightHorn.moveTo(22, -35);
    rightHorn.lineTo(45, -65);
    rightHorn.lineTo(8, -42);
    rightHorn.closePath();

    rightHorn.fill("#facc15");

    const leftEye = new Graphics();

    leftEye.circle(-10, -18, 5);
    leftEye.fill("#ffffff");

    const rightEye = new Graphics();

    rightEye.circle(10, -18, 5);
    rightEye.fill("#ffffff");

    const weapon = new Graphics();

    weapon.roundRect(
      -50,
      25,
      70,
      10,
      5,
    );

    weapon.fill("#94a3b8");

    this.addChild(
      body,
      head,
      leftHorn,
      rightHorn,
      leftEye,
      rightEye,
      weapon,
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