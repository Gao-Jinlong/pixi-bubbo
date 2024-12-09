import { Container, Graphics, Rectangle, Texture, TilingSprite } from "pixi.js";
import { Title } from "../ui/Title";
import { designConfig } from "../game/designConfig";
import { AppScreen } from "../navigation";
import { boardConfig, randomType } from "../game/boardConfig";
import { PixiLogo } from "../ui/PixiLogo";
import { Porthole } from "../ui/Porthole";

export class TitleScreen extends Container implements AppScreen {
  public static SCREEN_ID = "title";
  public static assetBundles = ["title-screen"];
  private readonly _hitContainer = new Container();
  private readonly _hitArea: Rectangle;
  private _background: TilingSprite;

  // TODO: Title implements
  private _title!: Title;
  private _pixiLogo!: PixiLogo;
  private _footer!: Graphics;

  private _portholeOne!: Porthole;
  private _portholeTwo!: Porthole;

  private _topAnimContainer = new Container();
  private _midAnimContainer = new Container();
  private _bottomAnimContainer = new Container();

  constructor() {
    super();

    this._background = new TilingSprite({
      texture: Texture.from("background-tile"),
      width: 64,
      height: 64,
      tileScale: {
        x: designConfig.backgroundTileScale,
        y: designConfig.backgroundTileScale,
      },
      interactive: true,
    });

    this.addChild(this._background);

    this._hitArea = new Rectangle();

    this._hitContainer.interactive = true;
    this._hitContainer.hitArea = this._hitArea;
    this.addChild(this._hitContainer);

    this._buildDetails();

    // this._buildButtons();

    this.addChild(
      this._topAnimContainer,
      this._midAnimContainer,
      this._bottomAnimContainer,
    );
  }

  public _buildDetails() {
    this._title = new Title();
    this._topAnimContainer.addChild(this._title.view);

    const type = randomType();

    this._footer = new Graphics()
      .ellipse(0, 0, 300, 125)
      .fill({ color: boardConfig.bubbleTypeToColor[type] });

    this._bottomAnimContainer.addChild(this._footer);

    // this._cannon = new Cannon();
    // this._cannon.view.scale.set(0.75);
    // this._cannon.type = type;
    // this._bottomAnimContainer.addChild(this._cannon.view);

    this._pixiLogo = new PixiLogo();
    this._pixiLogo.view.scale.set(0.35);
    this._midAnimContainer.addChild(this._pixiLogo.view);

    this._portholeOne = new Porthole();
    this._topAnimContainer.addChild(this._portholeOne.view);

    this._portholeTwo = new Porthole();
    this._midAnimContainer.addChild(this._portholeTwo.view);
  }
}
