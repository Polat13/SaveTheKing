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

export class Game {
  private readonly app: Application;

  private readonly sceneManager: SceneManager;

  private readonly startScene: StartScene;
  private readonly gameplayScene: GameplayScene;

  private readonly endScene: EndScene;

  private showEndScene(
  isWin: boolean,
): void {
  this.endScene.showResult(isWin);

  this.sceneManager.changeScene(
    this.endScene,
  );
}

private startGameplay(): void {
  this.sceneManager.changeScene(
    this.gameplayScene,
  );
}

  constructor(app: Application) {
    this.app = app;

    this.sceneManager =
      new SceneManager();

    this.gameplayScene =
  new GameplayScene(
    () => this.app.screen.width,
    () => this.app.screen.height,
    () => this.showEndScene(true),
    () => this.showEndScene(false),
  );

    this.startScene =
      new StartScene(
        () => this.app.screen.width,
        () => this.app.screen.height,
        () => this.handlePlay(),
      );

      this.endScene =
  new EndScene(
    () => this.app.screen.width,
    () => this.app.screen.height,
    () => this.startGameplay(),
  );

   this.app.stage.addChild(
  this.startScene,
  this.gameplayScene,
  this.endScene,
);



    // Oyun başlangıcında sadece start screen görünür.
    this.gameplayScene.visible = false;

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

  private handlePlay(): void {
    this.sceneManager.changeScene(
      this.gameplayScene,
    );
  }
}