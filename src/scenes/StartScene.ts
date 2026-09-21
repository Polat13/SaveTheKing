import {
  Container,
  Graphics,
  Text,
  TextStyle,
} from "pixi.js";

import type { Scene } from "../app/SceneManager";

import {
  Localization,
} from "../localization/Localization";

import {
  LanguageSelector,
} from "../ui/LanguageSelector";

export class StartScene
  extends Container
  implements Scene
{
  readonly name = "start" as const;

  private readonly screenWidth: () => number;
  private readonly screenHeight: () => number;
  private readonly onPlay: () => void;

  private readonly localization: Localization;
  private readonly languageSelector: LanguageSelector;

  private readonly title: Text;
  private readonly subtitle: Text;
  private readonly playButton: Container;

  constructor(
    screenWidth: () => number,
    screenHeight: () => number,
    localization: Localization,
    onPlay: () => void,
  ) {
    super();

    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.localization = localization;
    this.onPlay = onPlay;

    this.title = this.createTitle();
    this.subtitle = this.createSubtitle();
    this.playButton = this.createPlayButton();

    this.languageSelector =
      new LanguageSelector({
        currentLanguage: () =>
          this.localization.getLanguage(),

        onChange: (language) => {
          this.localization.setLanguage(
            language,
          );

          this.updateTexts();
        },
      });

    this.addChild(
      this.title,
      this.subtitle,
      this.playButton,
      this.languageSelector,
    );

    this.layout();
    this.updateTexts();
  }

  enter(): void {
    this.visible = true;

    this.layout();
    this.updateTexts();
  }

  exit(): void {
    this.visible = false;
  }

  update(_delta: number): void {
    // Start screen currently has no per-frame logic.
  }

  layout(): void {
    const width =
      this.screenWidth();

    const height =
      this.screenHeight();

    this.title.position.set(
      width / 2,
      height * 0.18,
    );

    this.subtitle.position.set(
      width / 2,
      height * 0.25,
    );

    this.playButton.position.set(
      width / 2,
      height * 0.72,
    );

    this.languageSelector.position.set(
      width / 2,
      height * 0.88,
    );
  }

  private updateTexts(): void {
    this.title.text =
      this.localization.get(
        "start.title",
      );

    this.subtitle.text =
      this.localization.get(
        "start.subtitle",
      );

    const playLabel =
      this.playButton.getChildAt(1);

    if (
      playLabel instanceof Text
    ) {
      playLabel.text =
        this.localization.get(
          "start.play",
        );
    }

    this.languageSelector.updateState();
  }

  private createTitle(): Text {
    const title = new Text({
      text: "",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 42,
        fontWeight: "900",
        fill: "#ffffff",
        align: "center",
      }),
    });

    title.anchor.set(0.5);

    return title;
  }

  private createSubtitle(): Text {
    const subtitle = new Text({
      text: "",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 18,
        fontWeight: "600",
        fill: "#aeb8cc",
        align: "center",
      }),
    });

    subtitle.anchor.set(0.5);

    return subtitle;
  }

  private createPlayButton(): Container {
    const container =
      new Container();

    const background =
      new Graphics();

    background.roundRect(
      -110,
      -35,
      220,
      70,
      18,
    );

    background.fill("#facc15");

    const label = new Text({
      text: "",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 22,
        fontWeight: "900",
        fill: "#111827",
      }),
    });

    label.anchor.set(0.5);

    container.addChild(
      background,
      label,
    );

    container.eventMode = "static";
    container.cursor = "pointer";

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
        this.onPlay();
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
}