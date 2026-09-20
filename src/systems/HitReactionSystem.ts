import type { Container } from "pixi.js";

interface HitReaction {
  target: Container;

  elapsed: number;
  duration: number;

  originalAlpha: number;
  originalScaleX: number;
  originalScaleY: number;
}

export class HitReactionSystem {
  private readonly reactions: HitReaction[] = [];

  private readonly duration = 0.12;
  private readonly hitScale = 1.06;

  play(target: Container): void {
    this.removeExistingReaction(target);

    this.reactions.push({
      target,

      elapsed: 0,
      duration: this.duration,

      originalAlpha:
        target.alpha,

      originalScaleX:
        target.scale.x,

      originalScaleY:
        target.scale.y,
    });
  }

  update(delta: number): void {
    const deltaSeconds =
      delta / 60;

    for (
      let i = this.reactions.length - 1;
      i >= 0;
      i--
    ) {
      const reaction =
        this.reactions[i];

      reaction.elapsed +=
        deltaSeconds;

      const progress =
        Math.min(
          reaction.elapsed /
            reaction.duration,
          1,
        );

      const pulse =
        Math.sin(
          progress * Math.PI,
        );

      reaction.target.alpha =
        progress < 0.5
          ? 1
          : 0.45;

      const scale =
        reaction.target.scale.x;

      const targetScale =
        reaction.originalScaleX +
        pulse *
          (
            this.hitScale -
            reaction.originalScaleX
          );

      const scaleRatio =
        targetScale / scale;

      reaction.target.scale.x =
        targetScale;

      reaction.target.scale.y =
        reaction.target.scale.y *
        scaleRatio;

      if (progress >= 1) {
        reaction.target.alpha =
          reaction.originalAlpha;

        reaction.target.scale.x =
          reaction.originalScaleX;

        reaction.target.scale.y =
          reaction.originalScaleY;

        this.reactions.splice(i, 1);
      }
    }
  }

  clear(): void {
    for (const reaction of this.reactions) {
      reaction.target.alpha =
        reaction.originalAlpha;

      reaction.target.scale.x =
        reaction.originalScaleX;

      reaction.target.scale.y =
        reaction.originalScaleY;
    }

    this.reactions.length = 0;
  }

  private removeExistingReaction(
    target: Container,
  ): void {
    for (
      let i = this.reactions.length - 1;
      i >= 0;
      i--
    ) {
      const reaction =
        this.reactions[i];

      if (reaction.target !== target) {
        continue;
      }

      target.alpha =
        reaction.originalAlpha;

      target.scale.x =
        reaction.originalScaleX;

      target.scale.y =
        reaction.originalScaleY;

      this.reactions.splice(i, 1);
    }
  }
}