import { Game } from "./Game";

export interface System<S extends Game = Game> {
  game?: S;
  init?: () => void;
  awake?: () => void;
  start?: () => void;
  update?: (deltaTime: number) => void;
  end?: () => void;
  reset?: () => void;
  resize?: (width: number, height: number) => void;
}
interface SystemClass<
  GAME extends Game = Game,
  SYSTEM extends System<GAME> = System<GAME>,
> {
  SYSTEM_ID: string;
  new (): SYSTEM;
}

export class SystemRunner {
  private readonly _game: Game;

  private readonly _width?: number;

  private readonly _height?: number;

  public readonly allSystems: Map<string, System> = new Map();

  constructor(game: Game) {
    this._game = game;
  }

  public add<S extends System>(Class: SystemClass<Game, S>): S {
    const name = Class.SYSTEM_ID;

    if (!name)
      throw new Error("[SystemManager]: cannot add System without name");

    if (this.allSystems.has(name)) return this.allSystems.get(name) as S;

    const system = new Class();

    system.game = this._game;

    if (this._width && this._height) system.resize?.(this._width, this._height);

    this.allSystems.set(Class.SYSTEM_ID, system);

    return system;
  }
  public get<S extends System>(Class: SystemClass<Game, S>): S {
    return this.allSystems.get(Class.SYSTEM_ID) as S;
  }

  public init() {
    this.allSystems.forEach((system) => {
      system.init?.();
    });
  }

  public awake() {
    this.allSystems.forEach((system) => system.awake?.());
  }

  public start() {
    this.allSystems.forEach((system) => system.start?.());
  }

  public update(delta: number) {
    this.allSystems.forEach((system) => system.update?.(delta));
  }

  public end() {
    this.allSystems.forEach((system) => system.end?.());
  }
  public reset() {
    this.allSystems.forEach((system) => system.reset?.());
  }

  public resize(w: number, h: number) {
    this.allSystems.forEach((system) => system.resize?.(w, h));
  }
}
