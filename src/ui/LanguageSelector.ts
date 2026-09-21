import {
  Container,
  Graphics,
  Text,
  TextStyle,
} from "pixi.js";

import type {
  Language,
} from "../localization/translations";

interface LanguageSelectorOptions {
  currentLanguage: () => Language;
  onChange: (
    language: Language,
  ) => void;
}

export class LanguageSelector
  extends Container
{
  private readonly currentLanguage: () => Language;
  private readonly onChange: (
    language: Language,
  ) => void;

  private readonly trButton: Container;
  private readonly enButton: Container;

  constructor(
    options: LanguageSelectorOptions,
  ) {
    super();

    this.currentLanguage =
      options.currentLanguage;

    this.onChange =
      options.onChange;

    this.trButton =
      this.createButton(
        "TR",
        "tr",
      );

    this.enButton =
      this.createButton(
        "EN",
        "en",
      );

    this.addChild(
      this.trButton,
      this.enButton,
    );

    this.layout();
    this.updateState();
  }

  layout(): void {
    this.trButton.position.set(
      -45,
      0,
    );

    this.enButton.position.set(
      45,
      0,
    );
  }

  updateState(): void {
    const language =
      this.currentLanguage();

    this.updateButtonState(
      this.trButton,
      language === "tr",
    );

    this.updateButtonState(
      this.enButton,
      language === "en",
    );
  }

  private createButton(
    label: string,
    language: Language,
  ): Container {
    const container =
      new Container();

    const background =
      new Graphics();

    background.roundRect(
      -35,
      -22,
      70,
      44,
      10,
    );

    background.fill("#1f2937");

    const text = new Text({
      text: label,
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 16,
        fontWeight: "900",
        fill: "#ffffff",
      }),
    });

    text.anchor.set(0.5);

    container.addChild(
      background,
      text,
    );

    container.eventMode =
      "static";

    container.cursor =
      "pointer";

    container.on(
      "pointerdown",
      () => {
        container.scale.set(0.94);
      },
    );

    container.on(
      "pointerup",
      () => {
        container.scale.set(1);

        this.onChange(language);
        this.updateState();
      },
    );

    container.on(
      "pointerupoutside",
      () => {
        container.scale.set(1);
      },
    );

    return container;
  }

  private updateButtonState(
    button: Container,
    selected: boolean,
  ): void {
    const background =
      button.getChildAt(0);

    if (
      background instanceof Graphics
    ) {
      background.clear();

      background.roundRect(
        -35,
        -22,
        70,
        44,
        10,
      );

      background.fill(
        selected
          ? "#facc15"
          : "#1f2937",
      );
    }

    const text =
      button.getChildAt(1);

    if (text instanceof Text) {
      text.style.fill =
        selected
          ? "#111827"
          : "#ffffff";
    }
  }
}