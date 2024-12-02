import { Application } from "pixi.js";
import { useCallback, useEffect, useRef, useState } from "react";

const Bubbo = () => {
  const [app, setApp] = useState<Application>();
  const container = useRef<HTMLDivElement>(null);
  const initApp = async () => {
    if (!container.current) return;

    const app = new Application();

    setApp(app);

    const width = container.current.clientWidth;
    const height = container.current.clientHeight;

    await app.init({ width, height, background: 0x000000, backgroundAlpha: 0 });
    container.current.appendChild(app.canvas);

    return app;
  };

  const resize = useCallback(() => {
    if (!app || !container.current) return;

    const width = container.current?.clientWidth;
    const height = container.current?.clientHeight;

    app.renderer.resize(width, height);
  }, [app]);

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
