import {
  Assets,
  Container,
  Sprite,
  Text,
  TextStyle,
} from "pixi.js";

import type { Scene } from "../app/SceneManager";

import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";
import { CombatSystem } from "../systems/CombatSystem";
import { AnimationSystem } from "../systems/AnimationSystem";
import { HitReactionSystem } from "../systems/HitReactionSystem";
import { Button } from "../ui/Button";
import { HealthBar } from "../ui/HealthBar";
import { HitEffect } from "../effects/HitEffect";
import { ScreenShake } from "../effects/ScreenShake";
import { CombatAnimationController } from "../controllers/CombatAnimationController";
import { Localization } from "../localization/Localization";
import { CoinSystem } from "../economy/CoinSystem";
import { UpgradeSystem } from "../progression/UpgradeSystem";
import { assetPath } from "../storage/SaveStorage";
import { LevelSystem } from "../progression/LevelSystem";
import { FloatingText } from "../effects/FloatingText";
import { LevelBanner } from "../ui/LevelBanner";

export class GameplayScene
  extends Container
  implements Scene
{
  readonly name = "gameplay" as const;

  private readonly world: Container;
  private readonly ui: Container;

  private readonly background: Sprite;

  private readonly player: Player;
  private readonly enemy: Enemy;

  private readonly combatSystem: CombatSystem;
  private readonly animationSystem: AnimationSystem;
  private readonly hitReactionSystem: HitReactionSystem;
  private readonly coinSystem: CoinSystem;
  private readonly upgradeSystem: UpgradeSystem;
  private readonly screenShake: ScreenShake;

  private readonly combatAnimationController:
    CombatAnimationController;

  private readonly attackButton: Button;

  private readonly playerHealthBar: HealthBar;
  private readonly enemyHealthBar: HealthBar;

  private readonly hitEffect: HitEffect;
  private readonly floatingText: FloatingText;
  private readonly levelBanner: LevelBanner;
  private readonly levelSystem: LevelSystem;
  private readonly hudText: Text;

  private readonly onWin: () => void;
  private readonly onLose: () => void;

  private readonly screenWidth: () => number;
  private readonly screenHeight: () => number;
  private readonly localization: Localization;

  constructor(
    screenWidth: () => number,
    screenHeight: () => number,
    localization: Localization,
    coinSystem: CoinSystem,
    upgradeSystem: UpgradeSystem,
    levelSystem: LevelSystem,
    onWin: () => void,
    onLose: () => void,
  ) {
    super();

    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.localization = localization;
    this.onWin = onWin;
    this.onLose = onLose;

    this.world = new Container();
    this.ui = new Container();

    this.background = new Sprite();

    this.animationSystem =
      new AnimationSystem();

    this.hitReactionSystem =
      new HitReactionSystem();

    this.coinSystem = coinSystem;
    this.upgradeSystem = upgradeSystem;
    this.levelSystem = levelSystem;

    this.floatingText = new FloatingText();
    this.levelBanner = new LevelBanner();

    this.hudText = new Text({
      text: "",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 20,
        fontWeight: "900",
        fill: "#ffffff",
        stroke: { color: "#111827", width: 4 },
      }),
    });

    this.hudText.anchor.set(0.5, 0);

    this.player = new Player();
    this.enemy = new Enemy();

    this.screenShake = new ScreenShake();

    this.combatAnimationController =
      new CombatAnimationController(
        this.animationSystem,
        this.player,
        this.enemy,
      );

    this.hitEffect = new HitEffect();

    this.playerHealthBar =
      new HealthBar({
        width: 140,
        height: 18,
        label: this.localization.get(
          "gameplay.king",
        ),
      });

    this.enemyHealthBar =
      new HealthBar({
        width: 140,
        height: 18,
        label: this.localization.get(
          "gameplay.enemy",
        ),
      });

    this.attackButton =
      new Button({
        width: 180,
        height: 60,
        label: this.localization.get(
          "gameplay.attack",
        ),
        onClick: () => this.attack(),
      });

    this.combatSystem =
      new CombatSystem(
        this.player,
        this.enemy,
        {
          onPlayerAttack: () => {
            this.combatAnimationController
              .playPlayerAttack();
          },

          onPlayerHit: () => {
            this.coinSystem.add(10);

            this.floatingText.spawn(
              `-${this.player.attackDamage}`,
              this.enemy.x,
              this.enemy.y - 90,
              "#ffffff",
            );

            this.floatingText.spawn(
              "+10",
              this.enemy.x + 50,
              this.enemy.y - 130,
              "#facc15",
            );

            this.updateHealthBars();

            this.hitReactionSystem.play(
              this.enemy,
            );

            this.playHitEffect(
              this.enemy,
            );

            this.screenShake.shake(
              this.world,
              8,
              0.12,
            );
          },

          onEnemyAttack: () => {
            this.combatAnimationController
              .playEnemyAttack();
          },

          onEnemyHit: () => {
            this.floatingText.spawn(
              `-${this.enemy.attackDamage}`,
              this.player.x,
              this.player.y - 90,
              "#f87171",
            );

            this.updateHealthBars();

            this.hitReactionSystem.play(
              this.player,
            );

            this.playHitEffect(
              this.player,
            );

            this.screenShake.shake(
              this.world,
              8,
              0.12,
            );
          },

          onWin: () => {
            this.attackButton.setEnabled(
              false,
            );

            this.coinSystem.add(
              this.levelSystem.getCurrent().reward,
            );

            this.levelSystem.completeLevel();

            this.onWin();
          },

          onLose: () => {
            this.attackButton.setEnabled(
              false,
            );

            this.onLose();
          },
        },
      );

    this.world.addChild(
      this.background,
      this.player,
      this.enemy,
      this.hitEffect,
      this.floatingText,
    );

    this.ui.addChild(
      this.playerHealthBar,
      this.enemyHealthBar,
      this.attackButton,
      this.hudText,
      this.levelBanner,
    );

    this.addChild(
      this.world,
      this.ui,
    );

    this.loadBackground();

    this.layout();
    this.updateTexts();
  }

  enter(): void {
    this.visible = true;

    this.animationSystem.clear();
    this.hitReactionSystem.clear();
    this.screenShake.clear();

    this.floatingText.clear();

    this.applyPlayerStats();
    this.applyLevel();

    this.combatSystem.reset();

    this.updateHealthBars();
    this.updateTexts();

    this.attackButton.setEnabled(true);

    this.layout();
  }

  exit(): void {
    this.visible = false;

    this.levelBanner.clear();
    this.floatingText.clear();

    this.animationSystem.clear();
    this.hitReactionSystem.clear();
    this.screenShake.clear();
  }

  update(delta: number): void {
    this.combatSystem.update(delta);
    this.animationSystem.update(delta);
    this.hitReactionSystem.update(delta);
    this.hitEffect.update(delta);
    this.floatingText.update(delta);
    this.levelBanner.update(delta);
    this.player.updateIdle(delta);
    this.enemy.updateIdle(delta);
    this.screenShake.update(delta);

    this.playerHealthBar.update(delta);
    this.enemyHealthBar.update(delta);
  }

  layout(): void {
    const width = this.screenWidth();
    const height = this.screenHeight();

    this.layoutBackground(
      width,
      height,
    );

    this.player.position.set(
      width * 0.25,
      height * 0.62,
    );

    this.enemy.position.set(
      width * 0.72,
      height * 0.65,
    );

    const scale = Math.min(
      1,
      width / 500,
    );

    this.player.scale.set(scale);
    this.enemy.scale.set(scale);

    this.playerHealthBar.position.set(
      width * 0.28,
      height * 0.42,
    );

    this.enemyHealthBar.position.set(
      width * 0.72,
      height * 0.52,
    );

    this.attackButton.position.set(
      width / 2,
      height * 0.85,
    );

    this.hudText.position.set(width / 2, 16);
    this.levelBanner.position.set(width / 2, height * 0.22);
  }

  private async loadBackground(): Promise<void> {
    try {
      const texture = await Assets.load(
        assetPath("assets/backgrounds/bg.png"),
      );

      this.background.texture =
        texture;

      this.layoutBackground(
        this.screenWidth(),
        this.screenHeight(),
      );
    } catch (error) {
      console.error(
        "Failed to load battle background:",
        error,
      );
    }
  }

  private layoutBackground(
    width: number,
    height: number,
  ): void {
    if (!this.background.texture) {
      return;
    }

    const textureWidth =
      this.background.texture.width;

    const textureHeight =
      this.background.texture.height;

    if (
      textureWidth <= 0 ||
      textureHeight <= 0
    ) {
      return;
    }

    /*
     * Cover:
     * Görsel ekranı tamamen kaplar.
     * En-boy oranı bozulmaz.
     */

    const scaleX =
      width / textureWidth;

    const scaleY =
      height / textureHeight;

    const scale =
      Math.max(
        scaleX,
        scaleY,
      );

    this.background.scale.set(
      scale,
    );

    const scaledWidth =
      textureWidth * scale;

    const scaledHeight =
      textureHeight * scale;

    this.background.position.set(
      (width - scaledWidth) / 2,
      (height - scaledHeight) / 2,
    );
  }

  private attack(): void {
    this.combatSystem.attack();
  }

  private playHitEffect(
    target: Container,
  ): void {
    this.hitEffect.position.set(
      target.x,
      target.y - 20,
    );

    this.hitEffect.play();
  }

  private updateHealthBars(): void {
    this.playerHealthBar.setValue(
      this.player.hp,
      this.player.maxHp,
    );

    this.enemyHealthBar.setValue(
      this.enemy.hp,
      this.enemy.maxHp,
    );
  }

  private updateTexts(): void {
    this.playerHealthBar.setLabel(
      this.localization.get(
        "gameplay.king",
      ),
    );

    this.enemyHealthBar.setLabel(
      this.localization
        .get(this.levelSystem.getCurrent().nameKey)
        .toUpperCase(),
    );

    this.attackButton.setLabel(
      this.localization.get(
        "gameplay.attack",
      ),
    );
  }

  private applyLevel(): void {
    const level = this.levelSystem.getCurrent();
    const levelNumber = this.levelSystem.getLevel();

    this.enemy.configure(
      level.kind,
      level.enemyHp,
      level.enemyDamage,
      level.tint,
      level.size,
    );

    const levelLabel = `${this.localization.get("gameplay.level")} ${levelNumber}`;
    const enemyName = this.localization.get(level.nameKey);

    this.enemyHealthBar.setLabel(enemyName.toUpperCase());

    this.hudText.text = `${levelLabel}  •  ${enemyName}`;

    this.levelBanner.show(
      level.isBoss
        ? this.localization.get("gameplay.boss")
        : levelLabel,
      enemyName,
      level.isBoss ? "#f87171" : "#facc15",
    );
  }

  private applyPlayerStats(): void {
    this.player.applyStats(
      this.upgradeSystem.getHealth(),
      this.upgradeSystem.getAttackDamage(),
    );

    this.updateHealthBars();
  }

  getPlayer(): Player {
    return this.player;
  }

  getEnemy(): Enemy {
    return this.enemy;
  }
}

