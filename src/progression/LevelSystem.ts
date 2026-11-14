import {
  loadNumber,
  saveNumber,
} from "../storage/SaveStorage";

import type { EnemyKind } from "../entities/Enemy";

const LEVEL_KEY = "level";

export interface LevelDefinition {
  kind: EnemyKind;
  /** Translation key for the enemy name (e.g. "enemies.scout"). */
  nameKey: string;
  enemyHp: number;
  enemyDamage: number;
  /** Bonus coins awarded on victory. */
  reward: number;
  tint: number;
  size: number;
  isBoss: boolean;
}

/*
 * Hand-designed chapter of eight fights.
 * After the boss the chapter repeats with
 * scaled-up stats so the game never ends.
 *
 * Balance notes (king starts with 5 HP / 1 attack,
 * the king always strikes first, +10 coins per hit,
 * first upgrade costs 30):
 *  1 Scout   - 3 hits, king takes 2 dmg -> easy tutorial win, ~50 coins
 *  2 Slime   - winnable without upgrades, trivial with +1 attack
 *  3 Warrior - comfortable after the first upgrade
 *  4 Bat     - hits for 2; first fight that punishes ignoring health
 *  5 Brute   - needs 2-3 upgrades
 *  6 Golem   - tank: lots of HP, needs attack upgrades
 *  7 Shadow  - hits for 3; needs balanced upgrades
 *  8 King    - boss, may need a retry or two
 */
const CHAPTER: readonly Omit<LevelDefinition, "isBoss">[] = [
  { kind: "goblin", nameKey: "enemies.scout", enemyHp: 3, enemyDamage: 1, reward: 20, tint: 0xffffff, size: 1.0 },
  { kind: "slime", nameKey: "enemies.slime", enemyHp: 4, enemyDamage: 1, reward: 25, tint: 0xffffff, size: 0.9 },
  { kind: "goblin", nameKey: "enemies.warrior", enemyHp: 6, enemyDamage: 1, reward: 30, tint: 0xb9f5a8, size: 1.05 },
  { kind: "bat", nameKey: "enemies.bat", enemyHp: 7, enemyDamage: 2, reward: 40, tint: 0xffffff, size: 0.9 },
  { kind: "goblin", nameKey: "enemies.brute", enemyHp: 10, enemyDamage: 2, reward: 50, tint: 0xffb36b, size: 1.15 },
  { kind: "golem", nameKey: "enemies.golem", enemyHp: 15, enemyDamage: 2, reward: 65, tint: 0xffffff, size: 1.0 },
  { kind: "goblin", nameKey: "enemies.shadow", enemyHp: 14, enemyDamage: 3, reward: 75, tint: 0xa797ff, size: 1.08 },
  { kind: "goblin", nameKey: "enemies.king", enemyHp: 20, enemyDamage: 3, reward: 120, tint: 0xff6a6a, size: 1.3 },
];

export class LevelSystem {
  /** 1-based level number. */
  private level = Math.max(1, loadNumber(LEVEL_KEY, 1));

  getLevel(): number {
    return this.level;
  }

  getCurrent(): LevelDefinition {
    const index = (this.level - 1) % CHAPTER.length;
    const cycle = Math.floor((this.level - 1) / CHAPTER.length);
    const base = CHAPTER[index];
    const multiplier = 1 + cycle * 0.6;

    return {
      ...base,
      enemyHp: Math.round(base.enemyHp * multiplier),
      enemyDamage: base.enemyDamage + cycle,
      reward: Math.round(base.reward * multiplier),
      isBoss: index === CHAPTER.length - 1,
    };
  }

  completeLevel(): void {
    this.level++;
    saveNumber(LEVEL_KEY, this.level);
  }

  reset(): void {
    this.level = 1;
    saveNumber(LEVEL_KEY, this.level);
  }
}
