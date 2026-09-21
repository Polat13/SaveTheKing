import {
  Container,
  Graphics,
  Text,
  TextStyle,
} from "pixi.js";

import type { Scene } from "../app/SceneManager";

import {
  CoinSystem,
} from "../economy/CoinSystem";

import {
  UpgradeSystem,
} from "../progression/UpgradeSystem";

import {
  Localization,
} from "../localization/Localization";

export class UpgradeScene
  extends Container
  implements Scene
{
  readonly name = "upgrade" as const;

  private readonly screenWidth: () => number;
  private readonly screenHeight: () => number;

  private readonly coinSystem: CoinSystem;
  private readonly upgradeSystem: UpgradeSystem;
  private readonly localization: Localization;

  private readonly onContinue: () => void;

  private readonly title: Text;
  private readonly coinText: Text;

  private readonly healthButton: Container;
  private readonly attackButton: Container;
  private readonly continueButton: Container;

  constructor(
    screenWidth: () => number,
    screenHeight: () => number,
    coinSystem: CoinSystem,
    upgradeSystem: UpgradeSystem,
    localization: Localization,
    onContinue: () => void,
  ) {
    super();

    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;

    this.coinSystem = coinSystem;
    this.upgradeSystem = upgradeSystem;
    this.localization = localization;

    this.onContinue = onContinue;

    this.title =
      this.createTitle();

    this.coinText =
      this.createCoinText();

    this.healthButton =
      this.createUpgradeButton(
        "health",
      );

    this.attackButton =
      this.createUpgradeButton(
        "attack",
      );

    this.continueButton =
      this.createContinueButton();

    this.addChild(
      this.title,
      this.coinText,
      this.healthButton,
      this.attackButton,
      this.continueButton,
    );

    this.layout();
    this.updateTexts();

    this.visible = false;
  }

  enter(): void {
    this.visible = true;

    this.updateTexts();
    this.updateState();
    this.layout();
  }

  exit(): void {
    this.visible = false;
  }

  update(_delta: number): void {
    // Upgrade screen currently has no per-frame logic.
  }

  layout(): void {
    const width =
      this.screenWidth();

    const height =
      this.screenHeight();

    this.title.position.set(
      width / 2,
      height * 0.16,
    );

    this.coinText.position.set(
      width / 2,
      height * 0.25,
    );

    this.healthButton.position.set(
      width / 2,
      height * 0.43,
    );

    this.attackButton.position.set(
      width / 2,
      height * 0.58,
    );

    this.continueButton.position.set(
      width / 2,
      height * 0.78,
    );
  }

  private upgrade(
    type: "health" | "attack",
  ): void {
    const success =
      this.upgradeSystem.upgrade(
        type,
      );

    if (!success) {
      return;
    }

    this.updateTexts();
    this.updateState();
  }

  private updateTexts(): void {
    this.title.text =
      this.localization.get(
        "upgrades.title",
      );

    this.coinText.text =
      `${this.localization.get(
        "upgrades.coins",
      )}: ${this.coinSystem.getCoins()}`;

    this.updateButtonText(
      this.healthButton,
      "health",
    );

    this.updateButtonText(
      this.attackButton,
      "attack",
    );

    const continueLabel =
      this.continueButton.getChildAt(1);

    if (
      continueLabel instanceof Text
    ) {
      continueLabel.text =
        this.localization.get(
          "upgrades.continue",
        );
    }
  }

  private updateState(): void {
    this.updateUpgradeButtonState(
      this.healthButton,
      "health",
    );

    this.updateUpgradeButtonState(
      this.attackButton,
      "attack",
    );
  }

  private updateUpgradeButtonState(
    button: Container,
    type: "health" | "attack",
  ): void {
    const cost =
      this.upgradeSystem.getUpgradeCost(
        type,
      );

    const canUpgrade =
      this.coinSystem.getCoins() >=
      cost;

    button.alpha =
      canUpgrade ? 1 : 0.5;
  }

  private updateButtonText(
    button: Container,
    type: "health" | "attack",
  ): void {
    const label =
      button.getChildAt(1);

    if (!(label instanceof Text)) {
      return;
    }

    const upgradeLabel =
      this.localization.get(
        type === "health"
          ? "upgrades.health"
          : "upgrades.attack",
      );

    const cost =
      this.upgradeSystem.getUpgradeCost(
        type,
      );

    const level =
      type === "health"
        ? this.upgradeSystem
            .getHealthLevel()
        : this.upgradeSystem
            .getAttackLevel();

    const currentValue =
      type === "health"
        ? this.upgradeSystem
            .getHealth()
        : this.upgradeSystem
            .getAttackDamage();

    label.text =
      `${upgradeLabel} Lv.${level}  ${currentValue}  (${cost})`;
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

  private createCoinText(): Text {
    const text = new Text({
      text: "",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 22,
        fontWeight: "800",
        fill: "#facc15",
        align: "center",
      }),
    });

    text.anchor.set(0.5);

    return text;
  }

  private createUpgradeButton(
    type: "health" | "attack",
  ): Container {
    const container =
      new Container();

    const background =
      new Graphics();

    background.roundRect(
      -150,
      -32,
      300,
      64,
      16,
    );

    background.fill("#1f2937");

    const label = new Text({
      text: "",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 18,
        fontWeight: "900",
        fill: "#ffffff",
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
        container.scale.set(0.96);
      },
    );

    container.on(
      "pointerup",
      () => {
        container.scale.set(1);

        this.upgrade(type);
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

  private createContinueButton(): Container {
    const container =
      new Container();

    const background =
      new Graphics();

    background.roundRect(
      -130,
      -32,
      260,
      64,
      16,
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
        container.scale.set(0.96);
      },
    );

    container.on(
      "pointerup",
      () => {
        container.scale.set(1);

        this.onContinue();
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