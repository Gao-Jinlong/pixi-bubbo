import { Container, Point, Rectangle } from "pixi.js";
import { Stats } from "./Stats";
import { SystemRunner } from "./SystemRunner";
import { boardConfig } from "./boardConfig";

export class Game {
  public stage = new Container();

  public gameContainer = new Container();

  public gameContainerPosition = new Point();

  public hitContainer = new Container();

  public systems: SystemRunner;

  public stats: Stats;

  public isGameOver = false;

  private readonly _hitArea: Rectangle;

  constructor() {
    this.stage.addChild(this.gameContainer);

    this._hitArea = new Rectangle();

    this.hitContainer.interactive = true;
    this.hitContainer.hitArea = this._hitArea;
    this.gameContainer.addChild(this.hitContainer);

    this.systems = new SystemRunner(this);
    this.stats = new Stats();
  }

  public addToGame(...views: Container[]) {
    views.forEach((view) => {
      this.gameContainer.addChild(view);
    });
  }

  public removeFromGame(...views: Container[]) {
    views.forEach((view) => {
      view.removeFromParent();
    });
  }

  public init() {
    this.systems.init();
  }

  public async awake() {
    this.systems.awake();
    this.gameContainer.visible = false;
  }

  public async start() {
    this.systems.start();
  }

  public async gameOver() {
    this.isGameOver = true;
  }

  public async end() {
    this.hitContainer.removeAllListeners();
    this.systems.end();
  }

  public update(delta: number) {
    this.systems.update(delta);
  }

  public reset() {
    this.isGameOver = false;
    this.stats.reset();
    this.systems.reset();
  }

  public resize(w: number, h: number) {
    this.gameContainerPosition.x = w * 0.5;
    this.gameContainerPosition.y = h;

    this.gameContainer.x = this.gameContainerPosition.x;
    this.gameContainer.y = this.gameContainerPosition.y;

    this._hitArea.x = -w / 2;
    this._hitArea.y = -h;
    this._hitArea.width = w;
    this._hitArea.height = h - boardConfig.bounceLine * 0.75;

    this.systems.resize(w, h);
  }
}
