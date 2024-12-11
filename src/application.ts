import { Application } from "pixi.js";
import { initDevtools } from "@pixi/devtools";
export const app = new Application();

if (import.meta.env.DEV) {
  initDevtools({ app });
  globalThis.__PIXI_APP__ = app;
}
