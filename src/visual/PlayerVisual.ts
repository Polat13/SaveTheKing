import {
  Assets,
  Sprite,
} from "pixi.js";

import { assetPath } from "../storage/SaveStorage";

export class PlayerVisual extends Sprite {
  constructor() {
    super();

    this.anchor.set(0.5);

    this.load();
  }

  private async load(): Promise<void> {
    try {
      const texture = await Assets.load(
        assetPath(
          "assets/characters/player1.png",
        ),
      );

      this.texture = texture;

      this.scale.set(0.65);
    } catch (error) {
      console.error(
        "Failed to load player visual:",
        error,
      );
    }
  }
}