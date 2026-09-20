import {
  Container,
  Graphics,
  Text,
  TextStyle,
} from "pixi.js";

import type { Scene } from "../app/SceneManager";

export class EndScene
  extends Container
  implements Scene
{
  readonly name = "end" as const;

  private readonly screenWidth: () => number;
  private readonly screenHeight: () => number;
  private readonly onRestart: () => void;

  private readonly title: Text;
  private readonly subtitle: Text;
  private readonly restartButton: Container;

  constructor(
    screenWidth: () => number,
    screenHeight: () => number,
    onRestart: () => void,
  ) {
    super();

    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
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

    // EndScene should be hidden until the game ends.
    this.visible = false;
  }

  enter(): void {
    this.visible = true;

    this.layout();
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
        ? "YOU WIN!"
        : "YOU LOSE!";

    this.subtitle.text =
      isWin
        ? "The king has been saved!"
        : "The king has been defeated.";

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

  private createTitle(): Text {
    const title = new Text({
      text: "YOU WIN!",
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
      text: "The king has been saved!",
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
      text: "PLAY AGAIN",
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