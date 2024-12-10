import { Application, Assets, AssetsClass } from "pixi.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { storage } from "./storage";
import { navigation } from "./navigation";
import { LoadScreen } from "./screens/LoadScreen";
import { useSearchParams } from "react-router";
import { audio, bgm } from "./audio";
import { initAssets } from "./assets";
import { TitleScreen } from "./screens/TitleScreen";
import { useNavigationStore } from "./store/useNaigation";
import { app } from "./application";
import { designConfig } from "./game/designConfig";

let hasInteracted = false;

const Bubbo = () => {
  const container = useRef<HTMLDivElement>(null);

  const [params] = useSearchParams();

  const { currentScreen, setCurrentScreen } = useNavigationStore(
    (state) => state,
  );

  const assets = useRef<Promise<AssetsClass>>(null);
  const appRef = useRef<Promise<Application> | null>(null);

  const [mounted, setMounted] = useState(false);

  const initApp = useCallback(async () => {
    if (!container.current) return;
    await app.init({
      background: 0x000000,
      resizeTo: container.current,
      // resolution: Math.max(window.devicePixelRatio, 2),
    });

    container.current.appendChild(app.canvas);

    if (!assets.current) {
      assets.current = initAssets();
    }
    await assets.current;

    storage.readyStorage();

    navigation.setLoadScreen(LoadScreen);

    audio.muted(storage.getStorageItem("muted"));

    setMounted(true);

    return app;
  }, []);

  const resize = useCallback(() => {
    if (!container.current || !app) return;

    const width = container.current?.clientWidth;
    const height = container.current?.clientHeight;
    const minWidth = designConfig.content.width;
    const minHeight = designConfig.content.height;

    const scaleX = width < minWidth ? minWidth / width : 1;
    const scaleY = height < minHeight ? minHeight / height : 1;
    const scale = scaleX > scaleY ? scaleX : scaleY;

    const finalWidth = width * scale;
    const finalHeight = height * scale;

    app.renderer.resize(finalWidth, finalHeight);
    container.current.scrollTo(0, 0);

    navigation.init();
    navigation.resize(finalWidth, finalHeight);
  }, []);

  useEffect(() => {
    const initResult = appRef.current || initApp();

    appRef.current = initResult;
  }, [initApp]);

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
    if (!mounted) return;
    if (params.get("play")) {
      Assets.loadBundle(TitleScreen.assetBundles);
      // navigation.goToScreen(GameScreen);
    } else if (params.get("loading") && currentScreen !== LoadScreen) {
      navigation?.goToScreen(LoadScreen);
      setCurrentScreen(LoadScreen);
    } else if (currentScreen !== TitleScreen) {
      navigation?.goToScreen(TitleScreen);
      setCurrentScreen(TitleScreen);
    }
  }, [currentScreen, mounted, params, setCurrentScreen]);

  useEffect(() => {
    if (!mounted) return;
    window.addEventListener("resize", resize);
    resize();
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [mounted, resize]);

  return (
    <div className="box-border flex h-screen w-screen items-center justify-center">
      <div ref={container} className="h-full w-full"></div>
    </div>
  );
};

export default Bubbo;
