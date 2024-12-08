import { Application, AssetsClass } from "pixi.js";
import { useCallback, useEffect, useRef } from "react";
import { storage } from "./storage";
import { Navigation } from "./navigation";
import { LoadScreen } from "./screens/LoadScreen";
import { useSearchParams } from "react-router";
import { useAppStore } from "./store/useApplication";
import { useNavigationStore } from "./store/useNaigation";
import { useBGM, useSFX } from "./store/useAudio";
import { audio, BGM, SFX } from "./audio";
import { initAssets } from "./assets";

let hasInteracted = false;

const Bubbo = () => {
  const container = useRef<HTMLDivElement>(null);

  const [params] = useSearchParams();

  const { app, setApp } = useAppStore((state) => state);
  const { navigation, setNavigation, currentScreen, setCurrentScreen } =
    useNavigationStore((state) => state);

  const { bgm, setBgm: setBGM } = useBGM((state) => state);
  const { setSfx: setSFX } = useSFX((state) => state);

  const assets = useRef<Promise<AssetsClass>>(null);

  const initApp = useCallback(async () => {
    if (!container.current) return;
    const app = new Application();
    setApp(app);

    await app.init({
      resizeTo: container.current,
      resolution: Math.max(window.devicePixelRatio, 2),
      background: 0xffffff,
    });
    const navigation = new Navigation(app);
    setNavigation(navigation);

    container.current.appendChild(app.canvas);

    if (!assets.current) {
      assets.current = initAssets();
    }
    await assets.current;

    storage.readyStorage();

    navigation.setLoadScreen(LoadScreen);

    setBGM(new BGM());
    setSFX(new SFX());

    audio.muted(storage.getStorageItem("muted"));

    return app;
  }, [setApp, setBGM, setNavigation, setSFX]);

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
  }, [bgm]);

  useEffect(() => {
    if (params.get("play")) {
      // Assets.loadBundle(TitleScreen.assetBundles);
      // navigation.goToScreen(GameScreen);
    } else if (params.get("loading") && currentScreen !== LoadScreen) {
      navigation?.goToScreen(LoadScreen);
      setCurrentScreen(LoadScreen);
    } else {
      // navigation.goToScreen(TitleScreen);
    }
  }, [currentScreen, navigation, params, setCurrentScreen]);

  return <div ref={container} className="box-border h-screen w-screen"></div>;
};

export default Bubbo;
