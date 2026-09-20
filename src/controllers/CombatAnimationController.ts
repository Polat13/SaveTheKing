import type { Container } from "pixi.js";

import {
  AnimationSystem,
} from "../systems/AnimationSystem";

export class CombatAnimationController {
  private readonly animationSystem: AnimationSystem;

  private readonly player: Container;
  private readonly enemy: Container;

  constructor(
    animationSystem: AnimationSystem,
    player: Container,
    enemy: Container,
  ) {
    this.animationSystem =
      animationSystem;

    this.player = player;
    this.enemy = enemy;
  }

  playPlayerAttack(): void {
    const originalX =
      this.player.x;

    const originalScale =
      this.player.scale.x;

    this.animationSystem.moveTo(
      this.player,
      originalX + 80,
      this.player.y,
      0.2,
      () => {
        this.animationSystem.moveTo(
          this.player,
          originalX,
          this.player.y,
          0.2,
        );
      },
    );

    this.animationSystem.scaleTo(
      this.player,
      originalScale * 1.08,
      0.08,
      () => {
        this.animationSystem.scaleTo(
          this.player,
          originalScale,
          0.12,
        );
      },
    );
  }

  playEnemyAttack(): void {
    const originalX =
      this.enemy.x;

    const originalScale =
      this.enemy.scale.x;

    this.animationSystem.moveTo(
      this.enemy,
      originalX - 80,
      this.enemy.y,
      0.2,
      () => {
        this.animationSystem.moveTo(
          this.enemy,
          originalX,
          this.enemy.y,
          0.2,
        );
      },
    );

    this.animationSystem.scaleTo(
      this.enemy,
      originalScale * 1.08,
      0.08,
      () => {
        this.animationSystem.scaleTo(
          this.enemy,
          originalScale,
          0.12,
        );
      },
    );
  }
}