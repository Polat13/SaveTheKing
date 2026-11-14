import type { SceneName } from "../config/game.types";

export interface Scene {
  readonly name: SceneName;

  /** Scenes are Pixi containers; alpha is used for the fade-in transition. */
  alpha: number;

  enter(): void;
  exit(): void;
  update(delta: number): void;
}

const FADE_DURATION = 0.3;

export class SceneManager {
  private currentScene: Scene | null = null;

  private fadeTime = FADE_DURATION;

  changeScene(scene: Scene): void {
    if (this.currentScene) {
      this.currentScene.exit();
    }

    this.currentScene = scene;

    this.currentScene.enter();

    // Fade the new scene in for a smoother transition.
    this.fadeTime = 0;
    this.currentScene.alpha = 0;
  }

  update(delta: number): void {
    const scene = this.currentScene;

    if (!scene) {
      return;
    }

    if (this.fadeTime < FADE_DURATION) {
      this.fadeTime = Math.min(
        FADE_DURATION,
        this.fadeTime + delta / 60,
      );

      const t = this.fadeTime / FADE_DURATION;

      scene.alpha = 1 - Math.pow(1 - t, 2);
    }

    scene.update(delta);
  }

  getCurrentScene(): Scene | null {
    return this.currentScene;
  }
}
