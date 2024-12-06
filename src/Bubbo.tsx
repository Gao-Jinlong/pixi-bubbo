import { Application, Assets, Sprite } from "pixi.js";
import { useCallback, useEffect, useRef } from "react";
import { storage } from "./storage";
import { Navigation } from "./navigation";
import { LoadScreen } from "./screens/LoadScreen";
import { audio, bgm } from "./audio";
import { useSearchParams } from "react-router";
import { useAppStore } from "./store/useApplication";
import { useNavigationStore } from "./store/useNaigation";

let hasInteracted = false;

const Bubbo = () => {
  const container = useRef<HTMLDivElement>(null);

  const [params] = useSearchParams();

  const { app, setApp } = useAppStore((state) => state);
  const { navigation, setNavigation } = useNavigationStore((state) => state);
  const initApp = useCallback(async () => {
    if (!container.current) return;
    const app = new Application();
    setApp(app);
    const navigation = new Navigation(app);
    setNavigation(navigation);

    await app.init({
      resizeTo: container.current,
      resolution: Math.max(window.devicePixelRatio, 2),
      background: 0xffffff,
    });

    container.current.appendChild(app.canvas);

    storage.readyStorage();

    navigation.setLoadScreen(LoadScreen);

    audio.muted(storage.getStorageItem("muted"));

    return app;
  }, [setApp, setNavigation]);

  const resize = useCallback(() => {
    if (!container.current || !app) return;

    const width = container.current?.clientWidth;
    const height = container.current?.clientHeight;

    app.renderer.resize(width, height);
  }, [app]);

  useEffect(() => {
    const initResult = initApp();

    return () => {
      initResult.then((app) => app?.destroy(true));
    };
  }, [initApp]);

  useEffect(() => {
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  useEffect(() => {
    const pointerDown = () => {
      if (!hasInteracted) {
        // Only play audio if it hasn't already been played
        bgm.play("audio/bubbo-bubbo-bg-music.wav");
      }

      hasInteracted = true;
    };

    const visibilityChange = () => {
      if (document.visibilityState !== "visible") {
        // Always mute on hidden
        audio.muted(true);
      } else {
        // Only unmute if it was previously unmuted
        audio.muted(storage.getStorageItem("muted"));
      }
    };

    document.addEventListener("pointerdown", pointerDown);
    document.addEventListener("visibilitychange", visibilityChange);

    return () => {
      document.removeEventListener("pointerdown", pointerDown);
      document.removeEventListener("visibilitychange", visibilityChange);
    };
  }, []);

  useEffect(() => {
    if (params.get("play")) {
      // Assets.loadBundle(TitleScreen.assetBundles);
      // navigation.goToScreen(GameScreen);
    } else if (params.get("loading")) {
      navigation?.goToScreen(LoadScreen);
    } else {
      // navigation.goToScreen(TitleScreen);
    }
  }, [navigation, params]);

  return <div ref={container} className="box-border h-screen w-screen"></div>;
};

export default Bubbo;
