import {
  Assets,
  Sprite,
} from "pixi.js";

import { assetPath } from "../storage/SaveStorage";

export type EnemyVisualType =
  | "goblin"
  | "orc"
  | "knight"
  | "boss";

export class EnemyVisual extends Sprite {
  constructor(
    type: EnemyVisualType,
  ) {
    super();

    this.anchor.set(0.5);

    this.load(type);
  }

  private async load(
    type: EnemyVisualType,
  ): Promise<void> {
    try {
      const texture =
        await Assets.load(
          assetPath(
            `assets/characters/${type}.png`,
          ),
        );

      this.texture = texture;

      this.scale.set(0.56);
    } catch (error) {
      console.error(
        `Failed to load enemy visual "${type}":`,
        error,
      );
    }
  }
}