import {
  Assets,
  Sprite,
} from "pixi.js";

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
    const texture =
      await Assets.load(
        `/assets/characters/${type}.png`,
      );

    this.texture = texture;

    this.scale.set(0.60);
  }
}