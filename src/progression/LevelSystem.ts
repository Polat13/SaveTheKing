import {
  loadNumber,
  saveNumber,
} from "../storage/SaveStorage";

const LEVEL_KEY = "level";

export interface LevelDefinition {
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
 * Hand-designed chapter of five fights.
 * After the boss the chapter repeats with
 * scaled-up stats so the game never ends.
 */
const CHAPTER: readonly Omit<LevelDefinition, "isBoss">[] = [
  { nameKey: "enemies.scout", enemyHp: 5, enemyDamage: 1, reward: 20, tint: 0xffffff, size: 1.0 },
  { nameKey: "enemies.warrior", enemyHp: 7, enemyDamage: 1, reward: 30, tint: 0xb9f5a8, size: 1.05 },
  { nameKey: "enemies.brute", enemyHp: 10, enemyDamage: 2, reward: 45, tint: 0xffb36b, size: 1.15 },
  { nameKey: "enemies.shadow", enemyHp: 13, enemyDamage: 2, reward: 60, tint: 0xa797ff, size: 1.08 },
  { nameKey: "enemies.king", enemyHp: 18, enemyDamage: 3, reward: 100, tint: 0xff6a6a, size: 1.3 },
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
