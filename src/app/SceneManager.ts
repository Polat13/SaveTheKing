import type { SceneName } from "../config/game.types";

export interface Scene {
  readonly name: SceneName;

  enter(): void;
  exit(): void;
  update(delta: number): void;
}

export class SceneManager {
  private currentScene: Scene | null = null;

  changeScene(scene: Scene): void {
    if (this.currentScene) {
      this.currentScene.exit();
    }

    this.currentScene = scene;

    this.currentScene.enter();
  }

  update(delta: number): void {
    this.currentScene?.update(delta);
  }

  getCurrentScene(): Scene | null {
    return this.currentScene;
  }
}