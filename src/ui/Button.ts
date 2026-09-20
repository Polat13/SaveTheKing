import {
  Container,
  Graphics,
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

    const label = new Text({
      text: options.label,
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 20,
        fontWeight: "900",
        fill: "#111827",
        align: "center",
      }),
    });

    label.anchor.set(0.5);

    this.addChild(
      this.background,
      label,
    );

    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointerdown", () => {
      this.scale.set(0.94);
    });

    this.on("pointerup", () => {
      this.scale.set(1);
      options.onClick();
    });

    this.on("pointerupoutside", () => {
      this.scale.set(1);
    });
  }

  setEnabled(enabled: boolean): void {
    this.eventMode = enabled
      ? "static"
      : "none";

    this.alpha = enabled
      ? 1
      : 0.5;
  }
}