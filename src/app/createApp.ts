import { Application } from "pixi.js";

export async function createApp(): Promise<Application> {
  const app = new Application();

  await app.init({
    resizeTo: window,
    background: "#080d18",
    antialias: true,
  });

  document.body.appendChild(app.canvas);

  return app;
}