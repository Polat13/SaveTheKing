import type { Application } from "pixi.js";

import {
  SceneManager,
} from "./SceneManager";

import {
  StartScene,
} from "../scenes/StartScene";

import {
  GameplayScene,
} from "../scenes/GameplayScene";

import {
  EndScene,
} from "../scenes/EndScene";

import {
  Localization,
} from "../localization/Localization";

export class Game {
  private readonly app: Application;

  private readonly sceneManager: SceneManager;

  private readonly localization: Localization;

  private readonly startScene: StartScene;
  private readonly gameplayScene: GameplayScene;
  private readonly endScene: EndScene;

  constructor(app: Application) {
    this.app = app;

    this.sceneManager =
      new SceneManager();

    this.localization =
      new Localization();

    this.startScene =
      new StartScene(
        () => this.app.screen.width,
        () => this.app.screen.height,
        this.localization,
        () => this.startGameplay(),
      );

    this.gameplayScene =
  new GameplayScene(
    () => this.app.screen.width,
    () => this.app.screen.height,
    this.localization,
    () => this.showEndScene(true),
    () => this.showEndScene(false),
  );

    this.endScene =
    new EndScene(
    () => this.app.screen.width,
    () => this.app.screen.height,
    this.localization,
    () => this.startGameplay(),
  );

    this.app.stage.addChild(
      this.startScene,
      this.gameplayScene,
      this.endScene,
    );

    // Only the start screen
    // should be visible at startup.
    this.gameplayScene.visible = false;
    this.endScene.visible = false;

    this.app.ticker.add(
      (ticker) => {
        this.sceneManager.update(
          ticker.deltaTime,
        );
      },
    );

    this.app.renderer.on(
      "resize",
      () => {
        this.startScene.layout();
        this.gameplayScene.layout();
        this.endScene.layout();
      },
    );
  }

  start(): void {
    this.sceneManager.changeScene(
      this.startScene,
    );
  }

  private startGameplay(): void {
    this.sceneManager.changeScene(
      this.gameplayScene,
    );
  }

  private showEndScene(
    isWin: boolean,
  ): void {
    this.endScene.showResult(isWin);

    this.sceneManager.changeScene(
      this.endScene,
    );
  }
}