import { Application } from "pixi.js";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { storage } from "./storage";
import { navigation } from "./navigation";
import { LoadScreen } from "./screens/LoadScreen";
import { audio, bgm } from "./audio";
import { useSearchParams } from "react-router";

export const app = new Application();

let hasInteracted = false;

const Bubbo = () => {
  const [isMounted, setIsMounted] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  const [params] = useSearchParams();

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

    navigation.setLoadScreen(LoadScreen);

    audio.muted(storage.getStorageItem("muted"));

    setIsMounted(true);

    return app;
  };

  const resize = useCallback(() => {
    if (!container.current) return;

    const width = container.current?.clientWidth;
    const height = container.current?.clientHeight;

    app.renderer.resize(width, height);
  }, []);

  useLayoutEffect(() => {
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
    if (!isMounted) return;
    if (params.get("play")) {
      // Assets.loadBundle(TitleScreen.assetBundles);
      // navigation.goToScreen(GameScreen);
    } else if (params.get("loading")) {
      navigation.goToScreen(LoadScreen);
    } else {
      // navigation.goToScreen(TitleScreen);
    }
  }, [isMounted, params]);

  return <div ref={container} className="box-border h-screen w-screen"></div>;
};

export default Bubbo;
