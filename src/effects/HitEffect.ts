import {
  Container,
  Graphics,
} from "pixi.js";

interface Particle {
  graphic: Graphics;
  velocityX: number;
  velocityY: number;
}

export class HitEffect extends Container {
  private particles: Particle[] = [];

  private elapsed = 0;

  private readonly duration = 0.4;

  private active = false;

  constructor() {
    super();

    this.visible = false;
  }

  play(): void {
    this.clearEffect();

    this.visible = true;
    this.active = true;
    this.elapsed = 0;

    this.createParticles();
  }

  update(delta: number): void {
    if (!this.active) {
      return;
    }

    // Pixi deltaTime yaklaşık olarak 60 FPS bazlıdır.
    const deltaSeconds = delta / 60;

    this.elapsed += deltaSeconds;

    const progress =
      Math.min(
        this.elapsed / this.duration,
        1,
      );

    for (const particle of this.particles) {
      particle.graphic.x +=
        particle.velocityX;

      particle.graphic.y +=
        particle.velocityY;

      particle.graphic.alpha =
        1 - progress;
    }

    if (progress >= 1) {
      this.clearEffect();
    }
  }

  private createParticles(): void {
    const particleCount = 12;

    for (
      let i = 0;
      i < particleCount;
      i++
    ) {
      const graphic = new Graphics();

      graphic.circle(
        0,
        0,
        6,
      );

      graphic.fill("#facc15");

      const angle =
        (Math.PI * 2 * i) /
        particleCount;

      const speed =
        2 + Math.random() * 3;

      const particle: Particle = {
        graphic,
        velocityX:
          Math.cos(angle) * speed,
        velocityY:
          Math.sin(angle) * speed,
      };

      this.particles.push(
        particle,
      );

      this.addChild(
        graphic,
      );
    }
  }

  private clearEffect(): void {
    for (const particle of this.particles) {
      particle.graphic.destroy();
    }

    this.particles = [];

    this.removeChildren();

    this.active = false;
    this.visible = false;
  }
}