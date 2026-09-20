import {
  Container,
  Graphics,
  Text,
  TextStyle,
} from "pixi.js";

interface HealthBarOptions {
  width: number;
  height: number;
  label: string;
}

export class HealthBar extends Container {
  private readonly barWidth: number;
  private readonly barHeight: number;

  private readonly fill: Graphics;
  private readonly valueText: Text;

  private currentValue = 0;
  private targetValue = 0;

  private maxValue = 0;

  private readonly animationSpeed = 12;

  constructor(options: HealthBarOptions) {
    super();

    this.barWidth = options.width;
    this.barHeight = options.height;

    const background = new Graphics();

    background.roundRect(
      -this.barWidth / 2,
      -this.barHeight / 2,
      this.barWidth,
      this.barHeight,
      8,
    );

    background.fill("#991b1b");

    this.fill = new Graphics();

    const label = new Text({
      text: options.label,
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 14,
        fontWeight: "800",
        fill: "#ffffff",
      }),
    });

    label.anchor.set(0.5);

    this.valueText = new Text({
      text: "0 / 0",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 12,
        fontWeight: "700",
        fill: "#ffffff",
      }),
    });

    this.valueText.anchor.set(0.5);

    this.addChild(
      background,
      this.fill,
      label,
      this.valueText,
    );
  }

  setValue(
    current: number,
    max: number,
  ): void {
    this.targetValue = current;
    this.maxValue = max;
  }

  update(delta: number): void {
    const deltaSeconds =
      delta / 60;

    if (
      Math.abs(
        this.currentValue -
        this.targetValue,
      ) < 0.01
    ) {
      this.currentValue =
        this.targetValue;
    } else {
      const difference =
        this.targetValue -
        this.currentValue;

      this.currentValue +=
        difference *
        Math.min(
          this.animationSpeed *
            deltaSeconds,
          1,
        );
    }

    this.renderValue();
  }

  reset(): void {
    this.currentValue =
      this.targetValue;
  }

  private renderValue(): void {
    const ratio =
      this.maxValue > 0
        ? Math.max(
            0,
            Math.min(
              1,
              this.currentValue /
                this.maxValue,
            ),
          )
        : 0;

    const fillWidth =
      this.barWidth * ratio;

    this.fill.clear();

    if (fillWidth > 0) {
      this.fill.roundRect(
        -this.barWidth / 2,
        -this.barHeight / 2,
        fillWidth,
        this.barHeight,
        8,
      );

      this.fill.fill("#22c55e");
    }

    this.valueText.text =
      `${Math.round(this.currentValue)} / ${this.maxValue}`;
  }
}