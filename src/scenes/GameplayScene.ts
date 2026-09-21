import {
  Container,
} from "pixi.js";

import type { Scene } from "../app/SceneManager";

import {
  Player,
} from "../entities/Player";

import {
  Enemy,
} from "../entities/Enemy";

import {
  CombatSystem,
} from "../systems/CombatSystem";

import {
  AnimationSystem,
} from "../systems/AnimationSystem";

import {
  HitReactionSystem,
} from "../systems/HitReactionSystem";

import {
  Button,
} from "../ui/Button";

import {
  HealthBar,
} from "../ui/HealthBar";

import {
  HitEffect,
} from "../effects/HitEffect";

import {
  ScreenShake,
} from "../effects/ScreenShake";

import {
  CombatAnimationController,
} from "../controllers/CombatAnimationController";

import {
  Localization,
} from "../localization/Localization";

import {
  CoinSystem,
} from "../economy/CoinSystem";

import {
  UpgradeSystem,
} from "../progression/UpgradeSystem";

export class GameplayScene
  extends Container
  implements Scene
{
  readonly name = "gameplay" as const;

  private readonly world: Container;
  private readonly ui: Container;

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
    onWin: () => void,
    onLose: () => void,
  ) {
    super();

    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;

    this.localization = localization;

    this.onWin = onWin;
    this.onLose = onLose;

    // --------------------------------------------------
    // Containers
    // --------------------------------------------------

    this.world = new Container();
    this.ui = new Container();

    // --------------------------------------------------
    // Systems
    // --------------------------------------------------

    this.animationSystem =
      new AnimationSystem();

    this.hitReactionSystem =
      new HitReactionSystem();

    this.coinSystem = coinSystem;
    this.upgradeSystem = upgradeSystem;

    this.player = new Player();
    this.enemy = new Enemy();

    this.screenShake =
      new ScreenShake();

    this.combatAnimationController =
      new CombatAnimationController(
        this.animationSystem,
        this.player,
        this.enemy,
      );

    // --------------------------------------------------
    // Effects
    // --------------------------------------------------

    this.hitEffect =
      new HitEffect();

    // --------------------------------------------------
    // UI
    // --------------------------------------------------

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

    // --------------------------------------------------
    // Combat
    // --------------------------------------------------

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

    // --------------------------------------------------
    // World hierarchy
    // --------------------------------------------------

    this.world.addChild(
      this.player,
      this.enemy,
      this.hitEffect,
    );

    // --------------------------------------------------
    // UI hierarchy
    // --------------------------------------------------

    this.ui.addChild(
      this.playerHealthBar,
      this.enemyHealthBar,
      this.attackButton,
    );

    // --------------------------------------------------
    // Scene hierarchy
    // --------------------------------------------------

    this.addChild(
      this.world,
      this.ui,
    );

    this.layout();
    this.updateTexts();
  }

  enter(): void {
    this.visible = true;

    this.animationSystem.clear();
    this.hitReactionSystem.clear();
    this.screenShake.clear();

    
    this.applyPlayerStats();
    this.combatSystem.reset();
    this.updateHealthBars();
    this.updateTexts();

    this.attackButton.setEnabled(true);

    this.layout();
  }

  exit(): void {
    this.visible = false;

    this.animationSystem.clear();
    this.hitReactionSystem.clear();
    this.screenShake.clear();
  }

  update(delta: number): void {
    this.combatSystem.update(delta);

    this.animationSystem.update(delta);

    this.hitReactionSystem.update(delta);

    this.hitEffect.update(delta);

    this.screenShake.update(delta);

    this.playerHealthBar.update(delta);

    this.enemyHealthBar.update(delta);
  }

  layout(): void {
    const width =
      this.screenWidth();

    const height =
      this.screenHeight();

    // --------------------------------------------------
    // World
    // --------------------------------------------------

    this.player.position.set(
      width * 0.28,
      height * 0.52,
    );

    this.enemy.position.set(
      width * 0.72,
      height * 0.52,
    );

    const scale = Math.min(
      1,
      width / 500,
    );

    this.player.scale.set(scale);
    this.enemy.scale.set(scale);

    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    this.playerHealthBar.position.set(
      width * 0.28,
      height * 0.20,
    );

    this.enemyHealthBar.position.set(
      width * 0.72,
      height * 0.20,
    );

    this.attackButton.position.set(
      width / 2,
      height * 0.82,
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
      this.localization.get(
        "gameplay.enemy",
      ),
    );

    this.attackButton.setLabel(
      this.localization.get(
        "gameplay.attack",
      ),
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