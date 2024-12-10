import { Assets, Container, Text, Ticker } from "pixi.js";

import { areBundlesLoaded } from "./assets";
import { app } from "./application";
export interface AppScreen<T = any> extends Container {
  prepare?: (data?: T) => void;
  show?: () => Promise<void>;
  hide?: () => Promise<void>;
  update?: (time: Ticker) => void;
  resize?: (w: number, h: number) => void;
}

export interface AppScreenConstructor {
  readonly SCREEN_ID: string;
  readonly assetBundles?: string[];
  new (): AppScreen;
}

// export class Navigation {
//   public screenView = new Container();

//   public overlayView = new Container();

//   public currentScreen?: AppScreen;

//   private currentScreenResize?: () => void;

//   private loadScreen?: AppScreen;

//   private currentOverlay?: AppScreen;

//   private currentOverlayResize?: () => void;

//   private _w!: number;

//   private _h!: number;

//   private readonly _screenMap = new Map<string, AppScreen>();

//   private readonly app: Application;

//   constructor(app: Application) {
//     this.app = app;
//   }

//   public init() {
//     this.app.stage.addChild(this.screenView, this.overlayView);
//   }

//   /**
//    * Set the default load screen.
//    * @param Ctor - The constructor for the load screen.
//    */
//   public setLoadScreen(Ctor: AppScreenConstructor) {
//     this.loadScreen = this._getScreen(Ctor);
//   }

//   public showOverlay<T>(Ctor: AppScreenConstructor, data?: T) {
//     this._showScreen(Ctor, true, data);
//   }

//   public goToScreen<T>(Ctor: AppScreenConstructor, data?: T) {
//     return this._showScreen(Ctor, false, data);
//   }

//   public async hideOverlay() {
//     if (!this.currentOverlay) return;

//     this._removeScreen(this.currentOverlay, true);
//   }

//   /**
//    * Gets a screen instance from the screen map.
//    * @param Ctor The constructor for the screen.
//    * @returns The instance of the screen being requested.
//    */
//   private _getScreen(Ctor: AppScreenConstructor) {
//     // Checks if a screen instance exists on the screen map
//     let screen = this._screenMap.get(Ctor.SCREEN_ID);

//     // If not, then create a new instance and assign it to the screen map
//     if (!screen) {
//       screen = new Ctor();
//       this._screenMap.set(Ctor.SCREEN_ID, screen);
//     }

//     return screen;
//   }

//   private async _addScreen(screen: AppScreen, isOverlay = false) {
//     (isOverlay ? this.overlayView : this.screenView).addChild(screen);

//     if (screen.resize) {
//       if (isOverlay) {
//         this.currentOverlayResize = () => screen.resize;
//       } else {
//         this.currentScreenResize = () => screen.resize;
//       }

//       screen.resize(this._w, this._h);
//     }

//     if (screen.update) {
//       this.app.ticker.add(screen.update, screen);
//     }

//     if (screen.show) {
//       await screen.show();
//     }
//   }

//   private async _removeScreen(screen: AppScreen, isOverlay = false) {
//     if (screen.hide) {
//       await screen.hide();
//     }

//     if (isOverlay && this.currentOverlayResize) {
//       window.removeEventListener("resize", this.currentOverlayResize);
//     } else if (!isOverlay && this.currentScreenResize) {
//       window.removeEventListener("resize", this.currentScreenResize);
//     }

//     if (screen.update) {
//       this.app.ticker.remove(screen.update, screen);
//     }

//     if (screen.parent) {
//       screen.parent.removeChild(screen);
//     }
//   }

//   private async _showScreen<T>(
//     Ctor: AppScreenConstructor,
//     isOverlay: boolean,
//     data: T,
//   ) {
//     const current = isOverlay ? this.currentOverlay : this.currentScreen;

//     if (current) {
//       await this._removeScreen(current);
//     }
//     if (Ctor.assetBundles && !areBundlesLoaded(Ctor.assetBundles)) {
//       if (this.loadScreen) {
//         this._addScreen(this.loadScreen, isOverlay);
//       }
//       await Assets.loadBundle(Ctor.assetBundles);

//       if (this.loadScreen) {
//         this._removeScreen(this.loadScreen, isOverlay);
//       }
//     }

//     if (isOverlay) {
//       this.currentOverlay = this._getScreen(Ctor);
//       this.currentOverlay.prepare?.(data);
//       await this._addScreen(this.currentOverlay, isOverlay);
//     } else {
//       this.currentScreen = this._getScreen(Ctor);
//       this.currentScreen.prepare?.(data);
//       await this._addScreen(this.currentScreen, isOverlay);
//     }
//   }

//   public resize(w: number, h: number) {
//     this._w = w;
//     this._h = h;

//     this.currentScreen?.resize?.(w, h);
//     this.currentOverlay?.resize?.(w, h);
//   }
//   public isCurrentScreen(Ctor: AppScreenConstructor) {
//     return this.currentScreen?.constructor === Ctor;
//   }
// }

export class Navigation {
  public screenView = new Container();

  public overlayView = new Container();

  public currentScreen?: AppScreen;

  private currentScreenResize?: () => void;

  private loadScreen?: AppScreen;

  private currentOverlay?: AppScreen;

  private currentOverlayResize?: () => void;

  private _w!: number;

  private _h!: number;

  private readonly _screenMap = new Map<string, AppScreen>();

  public init() {
    app.stage.addChild(this.screenView, this.overlayView);
  }

  /**
   * Set the default load screen.
   * @param Ctor - The constructor for the load screen.
   */
  public setLoadScreen(Ctor: AppScreenConstructor) {
    this.loadScreen = this._getScreen(Ctor);
  }

  public showOverlay<T>(Ctor: AppScreenConstructor, data?: T) {
    this._showScreen(Ctor, true, data);
  }

  public goToScreen<T>(Ctor: AppScreenConstructor, data?: T) {
    return this._showScreen(Ctor, false, data);
  }

  public async hideOverlay() {
    if (!this.currentOverlay) return;

    this._removeScreen(this.currentOverlay, true);
  }

  /**
   * Gets a screen instance from the screen map.
   * @param Ctor The constructor for the screen.
   * @returns The instance of the screen being requested.
   */
  private _getScreen(Ctor: AppScreenConstructor) {
    // Checks if a screen instance exists on the screen map
    let screen = this._screenMap.get(Ctor.SCREEN_ID);

    // If not, then create a new instance and assign it to the screen map
    if (!screen) {
      screen = new Ctor();
      this._screenMap.set(Ctor.SCREEN_ID, screen);
    }

    return screen;
  }

  private async _addScreen(screen: AppScreen, isOverlay = false) {
    (isOverlay ? this.overlayView : this.screenView).addChild(screen);

    if (screen.resize) {
      if (isOverlay) {
        this.currentOverlayResize = () => screen.resize;
      } else {
        this.currentScreenResize = () => screen.resize;
      }

      screen.resize(this._w, this._h);
    }

    if (screen.update) {
      app.ticker.add(screen.update, screen);
    }

    if (screen.show) {
      await screen.show();
    }
  }

  private async _removeScreen(screen: AppScreen, isOverlay = false) {
    if (screen.hide) {
      await screen.hide();
    }

    if (isOverlay && this.currentOverlayResize) {
      window.removeEventListener("resize", this.currentOverlayResize);
    } else if (!isOverlay && this.currentScreenResize) {
      window.removeEventListener("resize", this.currentScreenResize);
    }

    if (screen.update) {
      app.ticker.remove(screen.update, screen);
    }

    if (screen.parent) {
      screen.parent.removeChild(screen);
    }
  }

  private async _showScreen<T>(
    Ctor: AppScreenConstructor,
    isOverlay: boolean,
    data: T,
  ) {
    const current = isOverlay ? this.currentOverlay : this.currentScreen;

    if (current) {
      await this._removeScreen(current);
    }
    if (Ctor.assetBundles && !areBundlesLoaded(Ctor.assetBundles)) {
      if (this.loadScreen) {
        this._addScreen(this.loadScreen, isOverlay);
      }
      await Assets.loadBundle(Ctor.assetBundles);

      if (this.loadScreen) {
        this._removeScreen(this.loadScreen, isOverlay);
      }
    }

    if (isOverlay) {
      this.currentOverlay = this._getScreen(Ctor);
      this.currentOverlay.prepare?.(data);
      await this._addScreen(this.currentOverlay, isOverlay);
    } else {
      this.currentScreen = this._getScreen(Ctor);
      this.currentScreen.prepare?.(data);
      await this._addScreen(this.currentScreen, isOverlay);
    }
  }

  public resize(w: number, h: number) {
    this._w = w;
    this._h = h;

    this.currentScreen?.resize?.(w, h);
    this.currentOverlay?.resize?.(w, h);
  }
  public isCurrentScreen(Ctor: AppScreenConstructor) {
    return this.currentScreen?.constructor === Ctor;
  }
}
export const navigation = new Navigation();
