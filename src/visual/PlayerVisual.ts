import {
  Assets,
  Sprite,
} from "pixi.js";

export class PlayerVisual extends Sprite {
  constructor() {
    super();

    this.anchor.set(0.5);

    this.load();
  }

  private async load(): Promise<void> {
    const texture = await Assets.load(
      "/assets/characters/player1.png",
    );

    this.texture = texture;

    this.scale.set(0.65);
  }
}