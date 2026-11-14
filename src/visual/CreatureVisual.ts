import {
  Container,
  Graphics,
} from "pixi.js";

export type CreatureType =
  | "slime"
  | "bat"
  | "golem";

/**
 * Enemies drawn in code (no image asset needed).
 * Each one is centred on (0, 0) and roughly
 * the same size as the goblin sprite (~250px).
 */
export class CreatureVisual extends Container {
  private readonly type: CreatureType;

  private readonly leftWing = new Graphics();
  private readonly rightWing = new Graphics();

  constructor(type: CreatureType) {
    super();

    this.type = type;

    if (type === "slime") {
      this.drawSlime();
    } else if (type === "bat") {
      this.drawBat();
    } else {
      this.drawGolem();
    }
  }

  /** Per-creature idle motion on top of the shared breathing. */
  animate(time: number): void {
    if (this.type === "bat") {
      const flap = 0.55 + Math.sin(time * 4) * 0.45;

      this.leftWing.scale.y = flap;
      this.rightWing.scale.y = flap;
      this.y = Math.sin(time * 2) * 10 - 30;
    }

    if (this.type === "slime") {
      this.skew.x = Math.sin(time * 1.5) * 0.06;
    }
  }

  private drawSlime(): void {
    const g = new Graphics();

    // Shadow
    g.ellipse(0, 108, 120, 18).fill({ color: 0x000000, alpha: 0.35 });

    // Body
    g.moveTo(-125, 100)
      .bezierCurveTo(-140, 20, -80, -95, 0, -100)
      .bezierCurveTo(80, -95, 140, 20, 125, 100)
      .closePath()
      .fill(0x4ade80)
      .stroke({ color: 0x14532d, width: 6 });

    // Highlight
    g.ellipse(-50, -45, 26, 16).fill({ color: 0xffffff, alpha: 0.45 });

    // Drips
    g.circle(-80, 104, 10).fill(0x4ade80);
    g.circle(70, 106, 8).fill(0x4ade80);

    // Eyes
    g.ellipse(-38, 5, 20, 26).fill(0xffffff).stroke({ color: 0x14532d, width: 4 });
    g.ellipse(38, 5, 20, 26).fill(0xffffff).stroke({ color: 0x14532d, width: 4 });
    g.circle(-32, 12, 9).fill(0x111827);
    g.circle(32, 12, 9).fill(0x111827);

    // Angry brows
    g.moveTo(-62, -28).lineTo(-18, -14).stroke({ color: 0x14532d, width: 7 });
    g.moveTo(62, -28).lineTo(18, -14).stroke({ color: 0x14532d, width: 7 });

    // Mouth
    g.moveTo(-28, 58).quadraticCurveTo(0, 42, 28, 58).stroke({ color: 0x14532d, width: 6 });

    this.addChild(g);
  }

  private drawBat(): void {
    const wingShape = (g: Graphics, dir: number): void => {
      g.moveTo(0, 0)
        .lineTo(dir * 70, -70)
        .lineTo(dir * 150, -40)
        .lineTo(dir * 130, 10)
        .lineTo(dir * 105, -5)
        .lineTo(dir * 85, 30)
        .lineTo(dir * 60, 10)
        .lineTo(dir * 35, 35)
        .closePath()
        .fill(0x7f1d1d)
        .stroke({ color: 0x1f0707, width: 5 });
    };

    wingShape(this.leftWing, -1);
    wingShape(this.rightWing, 1);

    this.leftWing.position.set(-30, -10);
    this.rightWing.position.set(30, -10);

    const body = new Graphics();

    // Glow
    body.circle(0, 0, 70).fill({ color: 0xf97316, alpha: 0.18 });

    // Ears
    body.poly([-40, -40, -30, -95, -8, -48]).fill(0x991b1b).stroke({ color: 0x1f0707, width: 5 });
    body.poly([40, -40, 30, -95, 8, -48]).fill(0x991b1b).stroke({ color: 0x1f0707, width: 5 });

    // Body
    body.ellipse(0, 0, 52, 60).fill(0xb91c1c).stroke({ color: 0x1f0707, width: 6 });
    body.ellipse(0, 18, 30, 32).fill(0xf97316);

    // Eyes
    body.circle(-20, -16, 12).fill(0xfde047);
    body.circle(20, -16, 12).fill(0xfde047);
    body.circle(-18, -14, 5).fill(0x111827);
    body.circle(18, -14, 5).fill(0x111827);

    // Fangs
    body.poly([-12, 8, -6, 26, 0, 8]).fill(0xffffff);
    body.poly([12, 8, 6, 26, 0, 8]).fill(0xffffff);

    this.addChild(this.leftWing, this.rightWing, body);
  }

  private drawGolem(): void {
    const g = new Graphics();
    const stone = 0x78716c;
    const dark = 0x292524;

    // Shadow
    g.ellipse(0, 125, 110, 16).fill({ color: 0x000000, alpha: 0.35 });

    // Legs
    g.roundRect(-70, 60, 50, 65, 10).fill(stone).stroke({ color: dark, width: 6 });
    g.roundRect(20, 60, 50, 65, 10).fill(stone).stroke({ color: dark, width: 6 });

    // Arms
    g.roundRect(-135, -50, 50, 120, 18).fill(0x6b6560).stroke({ color: dark, width: 6 });
    g.roundRect(85, -50, 50, 120, 18).fill(0x6b6560).stroke({ color: dark, width: 6 });

    // Torso
    g.roundRect(-90, -70, 180, 140, 26).fill(stone).stroke({ color: dark, width: 6 });

    // Cracks
    g.moveTo(-50, -50).lineTo(-30, -20).lineTo(-45, 10).stroke({ color: dark, width: 4 });
    g.moveTo(55, 20).lineTo(35, 40).lineTo(50, 60).stroke({ color: dark, width: 4 });

    // Glowing rune
    g.circle(0, 5, 22).fill({ color: 0x38bdf8, alpha: 0.35 });
    g.poly([0, -12, 12, 5, 0, 22, -12, 5]).fill(0x7dd3fc);

    // Head
    g.roundRect(-45, -125, 90, 62, 14).fill(0x8a837d).stroke({ color: dark, width: 6 });
    g.rect(-30, -102, 20, 8).fill(0x38bdf8);
    g.rect(10, -102, 20, 8).fill(0x38bdf8);

    this.addChild(g);
  }
}
