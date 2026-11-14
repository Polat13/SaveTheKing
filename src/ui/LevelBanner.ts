import {
  Container,
  Graphics,
  Text,
  TextStyle,
} from "pixi.js";

/**
 * "LEVEL 3 / Goblin Brute" banner that pops in,
 * holds for a moment and fades away at the start of a fight.
 */
export class LevelBanner extends Container {
  private readonly ribbon: Graphics;
  private readonly title: Text;
  private readonly subtitle: Text;

  private time = 0;
  private playing = false;

  private readonly inDuration = 0.35;
  private readonly holdDuration = 1.1;
  private readonly outDuration = 0.4;

  constructor() {
    super();

    this.ribbon = new Graphics();

    this.title = new Text({
      text: "",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 40,
        fontWeight: "900",
        fill: "#facc15",
        stroke: { color: "#111827", width: 6 },
        letterSpacing: 2,
      }),
    });

    this.subtitle = new Text({
      text: "",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 22,
        fontWeight: "700",
        fill: "#ffffff",
        stroke: { color: "#111827", width: 4 },
      }),
    });

    this.title.anchor.set(0.5);
    this.subtitle.anchor.set(0.5);
    this.title.y = -14;
    this.subtitle.y = 24;

    this.addChild(this.ribbon, this.title, this.subtitle);

    this.visible = false;
    this.eventMode = "none";
  }

  show(
    title: string,
    subtitle: string,
    accent: string,
  ): void {
    this.title.text = title;
    this.subtitle.text = subtitle;
    this.title.style.fill = accent;

    const width = Math.max(this.title.width, this.subtitle.width) + 80;

    this.ribbon.clear();
    this.ribbon.roundRect(-width / 2, -48, width, 96, 18);
    this.ribbon.fill({ color: 0x0f172a, alpha: 0.78 });
    this.ribbon.stroke({ color: accent, width: 3 });

    this.time = 0;
    this.playing = true;
    this.visible = true;
    this.alpha = 0;
  }

  update(delta: number): void {
    if (!this.playing) {
      return;
    }

    this.time += delta / 60;

    const outStart = this.inDuration + this.holdDuration;

    if (this.time < this.inDuration) {
      const t = this.time / this.inDuration;

      this.alpha = 1 - Math.pow(1 - t, 3);
      this.scale.set(0.6 + 0.4 * backOut(t));
    } else if (this.time < outStart) {
      this.alpha = 1;
      this.scale.set(1);
    } else if (this.time < outStart + this.outDuration) {
      const t = (this.time - outStart) / this.outDuration;

      this.alpha = 1 - t;
      this.scale.set(1 + t * 0.15);
    } else {
      this.playing = false;
      this.visible = false;
    }
  }

  clear(): void {
    this.playing = false;
    this.visible = false;
  }
}

function backOut(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;

  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
