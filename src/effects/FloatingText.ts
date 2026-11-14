import {
  Container,
  Text,
  TextStyle,
} from "pixi.js";

interface FloatingItem {
  text: Text;
  age: number;
  life: number;
  vx: number;
}

/**
 * Lightweight floating numbers ("-2", "+10")
 * that pop in, rise and fade out.
 */
export class FloatingText extends Container {
  private readonly items: FloatingItem[] = [];

  spawn(
    message: string,
    x: number,
    y: number,
    color: string,
  ): void {
    const text = new Text({
      text: message,
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 30,
        fontWeight: "900",
        fill: color,
        stroke: { color: "#111827", width: 5 },
      }),
    });

    text.anchor.set(0.5);
    text.position.set(x, y);
    text.scale.set(0.3);

    this.addChild(text);

    this.items.push({
      text,
      age: 0,
      life: 0.9,
      vx: (Math.random() - 0.5) * 40,
    });
  }

  update(delta: number): void {
    const dt = delta / 60;

    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];

      item.age += dt;

      const t = item.age / item.life;

      // Pop in quickly, then settle.
      const pop =
        t < 0.15
          ? 0.3 + (t / 0.15)
          : 1.3 - Math.min(0.3, (t - 0.15) * 1.5);

      item.text.scale.set(pop);
      item.text.y -= 70 * dt;
      item.text.x += item.vx * dt;
      item.text.alpha = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4;

      if (t >= 1) {
        item.text.destroy();
        this.items.splice(i, 1);
      }
    }
  }

  clear(): void {
    for (const item of this.items) {
      item.text.destroy();
    }

    this.items.length = 0;
  }
}
