import { Application } from "pixi.js";
import { useCallback, useEffect, useRef } from "react";
import { storage } from "./storage";
import { navigation } from "./navigation";
import { loadScreen } from "./screens/LoadScreen";
import { audio } from "./audio";

export const app = new Application();

const Bubbo = () => {
  const container = useRef<HTMLDivElement>(null);
  const initApp = async () => {
    if (!container.current) return;

    const width = container.current.clientWidth;
    const height = container.current.clientHeight;

    await app.init({
      width,
      height,
      resolution: Math.max(window.devicePixelRatio, 2),
      backgroundColor: 0xffffff,
    });

    container.current.appendChild(app.canvas);

    storage.readyStorage();

    navigation.setLoadScreen(loadScreen);

    audio.muted(storage.getStorageItem("muted"));

    return app;
  };

  const resize = useCallback(() => {
    if (!container.current) return;

    const width = container.current?.clientWidth;
    const height = container.current?.clientHeight;

    app.renderer.resize(width, height);
  }, []);

  useEffect(() => {
    const initResult = initApp();

    return () => {
      initResult.then((app) => app?.destroy(true));
    };
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  return <div ref={container} className="box-border h-screen w-screen"></div>;
};

export default Bubbo;
