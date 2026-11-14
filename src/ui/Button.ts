import {
  Container,
  Graphics,
  Ticker,
  Text,
  TextStyle,
} from "pixi.js";

interface ButtonOptions {
  width: number;
  height: number;
  label: string;
  onClick: () => void;
}

export class Button extends Container {
  private readonly background: Graphics;
  private readonly labelText: Text;

  private targetScale = 1;
  private enabled = true;

  private readonly tick = (ticker: Ticker): void => {
    // Smoothly ease toward the target scale (hover / press feedback).
    const current = this.scale.x;
    const next =
      current +
      (this.targetScale - current) *
        Math.min(1, 0.3 * ticker.deltaTime);

    this.scale.set(next);
  };

  constructor(options: ButtonOptions) {
    super();

    this.background = new Graphics();

    this.background.roundRect(
      -options.width / 2,
      -options.height / 2,
      options.width,
      options.height,
      16,
    );

    this.background.fill("#facc15");

    this.labelText = new Text({
      text: options.label,
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 20,
        fontWeight: "900",
        fill: "#111827",
        align: "center",
      }),
    });

    this.labelText.anchor.set(0.5);

    this.addChild(
      this.background,
      this.labelText,
    );

    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointerover", () => {
      this.targetScale = 1.06;
    });

    this.on("pointerout", () => {
      this.targetScale = 1;
    });

    this.on(
      "pointerdown",
      () => {
        this.targetScale = 0.92;
      },
    );

    this.on(
      "pointerup",
      () => {
        this.targetScale = 1.06;

        if (this.enabled) {
          options.onClick();
        }
      },
    );

    this.on(
      "pointerupoutside",
      () => {
        this.targetScale = 1;
      },
    );

    Ticker.shared.add(this.tick);
  }

  override destroy(
    ...args: Parameters<Container["destroy"]>
  ): void {
    Ticker.shared.remove(this.tick);
    super.destroy(...args);
  }

  setLabel(label: string): void {
    this.labelText.text = label;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.targetScale = 1;

    this.eventMode = enabled
      ? "static"
      : "none";

    this.alpha = enabled
      ? 1
      : 0.5;
  }
}