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
  UpgradeScene,
} from "../scenes/UpgradeScene";

import {
  Localization,
} from "../localization/Localization";

import {
  CoinSystem,
} from "../economy/CoinSystem";

import {
  UpgradeSystem,
} from "../progression/UpgradeSystem";

export class Game {
  private readonly app: Application;

  private readonly sceneManager: SceneManager;

  private readonly localization: Localization;

  private readonly coinSystem: CoinSystem;
  private readonly upgradeSystem: UpgradeSystem;

  private readonly startScene: StartScene;
  private readonly gameplayScene: GameplayScene;
  private readonly endScene: EndScene;
  private readonly upgradeScene: UpgradeScene;

  constructor(app: Application) {
    this.app = app;

    this.sceneManager =
      new SceneManager();

    this.localization =
      new Localization();

    this.coinSystem =
      new CoinSystem();

    this.upgradeSystem =
      new UpgradeSystem(
        this.coinSystem,
      );

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
        this.coinSystem,
        this.upgradeSystem,
        () => this.showEndScene(true),
        () => this.showEndScene(false),
      );

    this.endScene =
      new EndScene(
        () => this.app.screen.width,
        () => this.app.screen.height,
        this.localization,
        () => this.showUpgradeScene(),
      );

    this.upgradeScene =
      new UpgradeScene(
        () => this.app.screen.width,
        () => this.app.screen.height,
        this.coinSystem,
        this.upgradeSystem,
        this.localization,
        () => this.startGameplay(),
      );

    this.app.stage.addChild(
      this.startScene,
      this.gameplayScene,
      this.endScene,
      this.upgradeScene,
    );

    // Only the start screen
    // should be visible at startup.
    this.gameplayScene.visible = false;
    this.endScene.visible = false;
    this.upgradeScene.visible = false;

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
        this.upgradeScene.layout();
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

  private showUpgradeScene(): void {
    this.sceneManager.changeScene(
      this.upgradeScene,
    );
  }
}