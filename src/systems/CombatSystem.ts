import {
  Player,
} from "../entities/Player";

import {
  Enemy,
} from "../entities/Enemy";

export type CombatState =
  | "idle"
  | "player-attacking"
  | "enemy-attacking"
  | "won"
  | "lost";

export interface CombatCallbacks {
  onPlayerAttack?: () => void;
  onPlayerHit?: () => void;
  onEnemyAttack?: () => void;
  onEnemyHit?: () => void;
  onWin?: () => void;
  onLose?: () => void;
}

export class CombatSystem {
  private readonly player: Player;
  private readonly enemy: Enemy;

  private readonly callbacks: CombatCallbacks;

  private state: CombatState = "idle";

  private timer = 0;

  private readonly playerAttackDelay = 0.25;
  private readonly enemyAttackDelay = 0.35;
  private readonly attackCooldown = 0.5;

  constructor(
    player: Player,
    enemy: Enemy,
    callbacks: CombatCallbacks = {},
  ) {
    this.player = player;
    this.enemy = enemy;
    this.callbacks = callbacks;
  }

  update(delta: number): void {
    const deltaSeconds = delta / 60;

    if (this.state === "idle") {
      if (this.timer > 0) {
        this.timer -= deltaSeconds;
      }

      return;
    }

    if (
      this.state === "won" ||
      this.state === "lost"
    ) {
      return;
    }

    this.timer += deltaSeconds;

    if (
      this.state === "player-attacking" &&
      this.timer >= this.playerAttackDelay
    ) {
      this.handlePlayerHit();

      return;
    }

    if (
      this.state === "enemy-attacking" &&
      this.timer >= this.enemyAttackDelay
    ) {
      this.handleEnemyHit();
    }
  }

  attack(): void {
    if (
      this.state !== "idle" ||
      this.timer > 0
    ) {
      return;
    }

    if (
      this.player.isDead() ||
      this.enemy.isDead()
    ) {
      return;
    }

    this.state = "player-attacking";
    this.timer = 0;

    this.callbacks.onPlayerAttack?.();
  }

  reset(): void {
    this.player.reset();
    this.enemy.reset();

    this.state = "idle";
    this.timer = 0;
  }

  getState(): CombatState {
    return this.state;
  }

  private handlePlayerHit(): void {
    this.timer = 0;

    this.enemy.takeDamage(1);

    this.callbacks.onPlayerHit?.();

    if (this.enemy.isDead()) {
      this.state = "won";

      this.callbacks.onWin?.();

      return;
    }

    this.state = "enemy-attacking";

    this.callbacks.onEnemyAttack?.();
  }

  private handleEnemyHit(): void {
    this.timer = 0;

    this.player.takeDamage(1);

    this.callbacks.onEnemyHit?.();

    if (this.player.isDead()) {
      this.state = "lost";

      this.callbacks.onLose?.();

      return;
    }

    this.state = "idle";

    this.timer = this.attackCooldown;
  }
}