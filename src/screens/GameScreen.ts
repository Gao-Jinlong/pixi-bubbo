import gsap from "gsap";
import { Container, Texture, Ticker, TilingSprite } from "pixi.js";

import { designConfig } from "../game/designConfig";
import { Game } from "../game/Game";
import type { AppScreen } from "../navigation";

export class GameScreen extends Container implements AppScreen {
  public static SCREEN_ID = "game";
  public static assetBundles = ["game-screen"];

  private readonly _background: TilingSprite;
  private readonly _game: Game;

  constructor() {
    super();

    this._background = new TilingSprite({
      texture: Texture.from("background-tile-space"),
      width: 64,
      height: 64,
      tileScale: {
        x: designConfig.backgroundTileScale,
        y: designConfig.backgroundTileScale,
      },
    });
    this.addChild(this._background);

    this._game = new Game();
    this._game.init();
    this.addChild(this._game.stage);
  }

  public async show() {
    gsap.killTweensOf(this);

    this.alpha = 0;

    this._game.awake();
    await gsap.to(this, { alpha: 1, duration: 0.2, ease: "linear" });
    this._game.start();
  }

  public async hide() {
    gsap.killTweensOf(this);
    this._game.end();
    await gsap.to(this, { alpha: 0, duration: 0.2, ease: "linear" });
    this._game.reset();
  }

  public update(time: Ticker) {
    this._game.update(time.deltaTime);
  }

  public resize(w: number, h: number) {
    this._background.width = w;
    this._background.height = h;

    this._game.resize(w, h);
  }
}
