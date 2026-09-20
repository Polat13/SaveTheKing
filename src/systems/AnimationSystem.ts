import type { Container } from "pixi.js";

interface Animation {
  target: Container;

  startX: number;
  startY: number;

  endX: number;
  endY: number;

  startScaleX: number;
  startScaleY: number;

  endScaleX: number;
  endScaleY: number;

  duration: number;
  elapsed: number;

  onComplete?: () => void;
}

export class AnimationSystem {
  private readonly animations: Animation[] = [];

  moveTo(
    target: Container,
    x: number,
    y: number,
    duration: number,
    onComplete?: () => void,
  ): void {
    this.animations.push({
      target,

      startX: target.x,
      startY: target.y,

      endX: x,
      endY: y,

      startScaleX: target.scale.x,
      startScaleY: target.scale.y,

      endScaleX: target.scale.x,
      endScaleY: target.scale.y,

      duration,
      elapsed: 0,

      onComplete,
    });
  }

  scaleTo(
    target: Container,
    scale: number,
    duration: number,
    onComplete?: () => void,
  ): void {
    this.animations.push({
      target,

      startX: target.x,
      startY: target.y,

      endX: target.x,
      endY: target.y,

      startScaleX: target.scale.x,
      startScaleY: target.scale.y,

      endScaleX: scale,
      endScaleY: scale,

      duration,
      elapsed: 0,

      onComplete,
    });
  }

  update(delta: number): void {
    const deltaSeconds = delta / 60;

    for (
      let i = this.animations.length - 1;
      i >= 0;
      i--
    ) {
      const animation =
        this.animations[i];

      animation.elapsed +=
        deltaSeconds;

      const progress = Math.min(
        animation.elapsed /
          animation.duration,
        1,
      );

      const easedProgress =
        this.easeOutCubic(progress);

      animation.target.x =
        animation.startX +
        (
          animation.endX -
          animation.startX
        ) *
          easedProgress;

      animation.target.y =
        animation.startY +
        (
          animation.endY -
          animation.startY
        ) *
          easedProgress;

      animation.target.scale.x =
        animation.startScaleX +
        (
          animation.endScaleX -
          animation.startScaleX
        ) *
          easedProgress;

      animation.target.scale.y =
        animation.startScaleY +
        (
          animation.endScaleY -
          animation.startScaleY
        ) *
          easedProgress;

      if (progress >= 1) {
        animation.target.x =
          animation.endX;

        animation.target.y =
          animation.endY;

        animation.target.scale.x =
          animation.endScaleX;

        animation.target.scale.y =
          animation.endScaleY;

        this.animations.splice(i, 1);

        animation.onComplete?.();
      }
    }
  }

  clear(): void {
    this.animations.length = 0;
  }

  private easeOutCubic(
    progress: number,
  ): number {
    return 1 -
      Math.pow(
        1 - progress,
        3,
      );
  }
}