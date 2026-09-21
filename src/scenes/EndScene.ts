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

export class EndScene
  extends Container
  implements Scene
{
  readonly name = "end" as const;

  private readonly screenWidth: () => number;
  private readonly screenHeight: () => number;
  private readonly onRestart: () => void;

  private readonly localization: Localization;

  private readonly title: Text;
  private readonly subtitle: Text;
  private readonly restartButton: Container;

  constructor(
    screenWidth: () => number,
    screenHeight: () => number,
    localization: Localization,
    onRestart: () => void,
  ) {
    super();

    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.localization = localization;
    this.onRestart = onRestart;

    this.title = this.createTitle();
    this.subtitle = this.createSubtitle();
    this.restartButton =
      this.createRestartButton();

    this.addChild(
      this.title,
      this.subtitle,
      this.restartButton,
    );

    this.layout();

    this.visible = false;
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
    // End screen currently has no per-frame logic.
  }

  showResult(isWin: boolean): void {
    this.title.text =
      isWin
        ? this.localization.get(
            "end.winTitle",
          )
        : this.localization.get(
            "end.loseTitle",
          );

    this.subtitle.text =
      isWin
        ? this.localization.get(
            "end.winSubtitle",
          )
        : this.localization.get(
            "end.loseSubtitle",
          );

    this.updateRestartButtonText();

    this.layout();
  }

  layout(): void {
    const width =
      this.screenWidth();

    const height =
      this.screenHeight();

    this.title.position.set(
      width / 2,
      height * 0.25,
    );

    this.subtitle.position.set(
      width / 2,
      height * 0.34,
    );

    this.restartButton.position.set(
      width / 2,
      height * 0.68,
    );
  }

  private updateTexts(): void {
    this.updateRestartButtonText();
  }

  private updateRestartButtonText(): void {
    const restartLabel =
      this.restartButton.getChildAt(1);

    if (
      restartLabel instanceof Text
    ) {
      restartLabel.text =
        this.localization.get(
          "end.playAgain",
        );
    }
  }

  private createTitle(): Text {
    const title = new Text({
      text: "",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 48,
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

  private createRestartButton(): Container {
    const container = new Container();

    const background = new Graphics();

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
        fontSize: 20,
        fontWeight: "900",
        fill: "#111827",
        align: "center",
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

        this.onRestart();
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