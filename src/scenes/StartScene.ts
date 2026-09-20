import {
  Container,
  Graphics,
  Text,
  TextStyle,
} from "pixi.js";

import type { Scene } from "../app/SceneManager";

export class StartScene
  extends Container
  implements Scene
{
  readonly name = "start" as const;

  private readonly screenWidth: () => number;
  private readonly screenHeight: () => number;
  private readonly onPlay: () => void;

  private title: Text;
  private subtitle: Text;
  private playButton: Container;

  constructor(
    screenWidth: () => number,
    screenHeight: () => number,
    onPlay: () => void,
  ) {
    super();

    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.onPlay = onPlay;

    this.title = this.createTitle();
    this.subtitle = this.createSubtitle();
    this.playButton = this.createPlayButton();

    this.addChild(
      this.title,
      this.subtitle,
      this.playButton,
    );

    this.layout();
  }

  enter(): void {
    this.visible = true;
    this.layout();
  }

  exit(): void {
    this.visible = false;
  }

  update(_delta: number): void {
    // Start screen currently has no per-frame logic.
  }

  layout(): void {
    const width = this.screenWidth();
    const height = this.screenHeight();

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
  }

  private createTitle(): Text {
    const title = new Text({
      text: "SAVE THE KING",
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
      text: "Defeat the enemy and save the king!",
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
      text: "PLAY",
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

    container.on("pointerdown", () => {
      container.scale.set(0.94);
    });

    container.on("pointerup", () => {
      container.scale.set(1);
      this.onPlay();
    });

    container.on("pointerupoutside", () => {
      container.scale.set(1);
    });

    return container;
  }
}