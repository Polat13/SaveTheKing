import type { Container } from "pixi.js";

interface Shake {
  target: Container;

  elapsed: number;
  duration: number;
  intensity: number;

  originalX: number;
  originalY: number;
}

export class ScreenShake {
  private readonly shakes: Shake[] = [];

  shake(
    target: Container,
    intensity = 8,
    duration = 0.15,
  ): void {
    this.removeExistingShake(target);

    this.shakes.push({
      target,

      elapsed: 0,
      duration,
      intensity,

      originalX: target.x,
      originalY: target.y,
    });
  }

  update(delta: number): void {
    const deltaSeconds = delta / 60;

    for (
      let i = this.shakes.length - 1;
      i >= 0;
      i--
    ) {
      const shake = this.shakes[i];

      shake.elapsed += deltaSeconds;

      const progress = Math.min(
        shake.elapsed / shake.duration,
        1,
      );

      if (progress >= 1) {
        shake.target.position.set(
          shake.originalX,
          shake.originalY,
        );

        this.shakes.splice(i, 1);

        continue;
      }

      /*
       * Shake gücü zamanla azalır.
       *
       * Başlangıç:
       *   güçlü
       *
       * Bitiş:
       *   0
       */
      const strength =
        1 - progress;

      const offsetX =
        (Math.random() * 2 - 1) *
        shake.intensity *
        strength;

      const offsetY =
        (Math.random() * 2 - 1) *
        shake.intensity *
        strength;

      shake.target.position.set(
        shake.originalX + offsetX,
        shake.originalY + offsetY,
      );
    }
  }

  clear(): void {
    for (const shake of this.shakes) {
      shake.target.position.set(
        shake.originalX,
        shake.originalY,
      );
    }

    this.shakes.length = 0;
  }

  private removeExistingShake(
    target: Container,
  ): void {
    for (
      let i = this.shakes.length - 1;
      i >= 0;
      i--
    ) {
      const shake = this.shakes[i];

      if (shake.target !== target) {
        continue;
      }

      target.position.set(
        shake.originalX,
        shake.originalY,
      );

      this.shakes.splice(i, 1);
    }
  }
}