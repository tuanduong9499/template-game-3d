import { AssetManager } from "./template/assetManager";
import "./template/extensions/index";
import { GameStateManager, GameState } from "./template/gameStateManager";
import { GameConstant } from "./gameConstant";
import { SceneManager } from "./template/scene/sceneManager";
import { PlayScene } from "./template-3d/scenes/playScene";
import { Tween } from "./template/systems/tween/tween";
import { Configurator } from "./template-3d/configurator/configurator";
import { Debug } from "./template/debug";
import { Physics } from "./physics/physics";
import { SoundManager } from "./template/soundManager";
import { Time } from "./template/systems/time/time";
import PureAds from "./pureAds/pureAds";
import { InputManager } from "./template/systems/input/inputManager";
import { Camera } from "./template/objects/camera";
import { MultiTouchManager } from "./template/systems/input/multiTouchManager";
import { Application, ElementInput, FILLMODE_NONE, Keyboard, Mouse, RESOLUTION_AUTO, TouchDevice } from "playcanvas";

export class Game {
  static init() {
    this.visible = false;
    this.life = GameConstant.GAME_LIFE;
    this.pureAds = new PureAds();
    this.pureAds.registerEvents(this);
  }

  static load() {
    Debug.log("Game", "Load");
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    this.app = new Application(this.canvas, {
      elementInput : new ElementInput(this.canvas),
      mouse        : new Mouse(this.canvas),
      touch        : new TouchDevice(this.canvas),
      keyboard     : new Keyboard(window),
    });
    this.app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
    this.app.setCanvasFillMode(FILLMODE_NONE);
    this.app.setCanvasResolution(RESOLUTION_AUTO);
    this.app.start();
    InputManager.init(this.app);
    MultiTouchManager.init(this.canvas);
    GameStateManager.init(GameState.Intro);
    Time.init(this.app);
    Tween.init(this.app);
    AssetManager.init(this.app);
    AssetManager.load(this.onAssetLoaded.bind(this));
  }

  static create() {
    let screenSize = this.pureAds.getScreenSize();
    Debug.log("Game", "Create", screenSize);
    this.width = screenSize.width;
    this.height = screenSize.height;
    this.app.resizeCanvas(this.width, this.height);
    Camera.init();
    Physics.init(this.app);
    Configurator.config();

    SceneManager.init([
      new PlayScene(),
    ]);
    SceneManager.loadScene(SceneManager.getScene(GameConstant.SCREEN_PLAY));

    this.app.on("update", this.update, this);
    this.gameCreated = true;
  }

  static update() {
    SceneManager.update(Time.dt);
    this.pureAds.adapter.update();
  }

  static setPause(isPause) {
    if (!this.gameCreated) {
      return;
    }

    if (isPause) {
      this.pause();
    }
    else if (GameStateManager.state === GameState.Paused) {
      this.resume();
    }
  }

  static pause() {
    GameStateManager.state = GameState.Paused;
    Time.scale = 0;
    SoundManager.muteAll(true);
    SceneManager.pause();
  }

  static resume() {
    GameStateManager.state = GameStateManager.prevState;
    Time.scale = 1;
    SoundManager.muteAll(false);
    SceneManager.resume();
  }

  static resize(screenSize) {
    if (this.gameCreated) {
      Debug.debug("Game", "Resize", screenSize);
      console.assert(screenSize.width && screenSize.height, "Screen size must have width and height greater than 0");
      this.width = screenSize.width;
      this.height = screenSize.height;
      this.app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
      this.app.resizeCanvas(this.width, this.height);
      SceneManager.resize();
      this.app.fire("resize");
    }
    else {
      console.warn("Resize function called before game creation", screenSize);
    }
  }

  static onStart() {
    this.pureAds.adapter.onStart();
  }

  static onVisible() {
    Debug.log("Game", "Visible");

    this.visible = true;
    if (AssetManager.loaded && !this.gameCreated) {
      this.create();
    }
  }

  static onAssetLoaded() {
    this.pureAds.adapter.onAssetLoaded();
    if (this.visible && !this.gameCreated) {
      this.create();
    }
  }

  static onInteraction() {
    this.pureAds.adapter.onInteraction();
  }

  static onWin() {
    this.pureAds.adapter.onWin();
  }

  static onLose() {
    this.pureAds.adapter.onLose();
  }

  static onOneLevelPassed() {
    this.pureAds.adapter.onOneLevelPassed();
  }

  static onMidwayProgress() {
    this.pureAds.adapter.onMidwayProgress();
  }

  static sendEvent(type, name) {
    this.pureAds.adapter.onSendEvent(type, name);
  }

  static onCTAClick(elementName) {
    this.sendEvent("end_choice", elementName);
    this.pureAds.onCTAClick();
  }

  static replay() {
    Debug.log("Game", "Replay");

    this.pureAds.adapter.onReplay();
    this.life--;
    GameStateManager.state = GameState.Playing;
    SceneManager.loadScene(new PlayScene());
  }

  static get isPortrait() {
    return Game.width <= Game.height;
  }

  static get isLandscape() {
    return !this.isPortrait;
  }
}

window.addEventListener("contextmenu", (e) => e.preventDefault());
// eslint-disable-next-line no-undef
window.addEventListener(ADEVENT_LOAD, () => {
  Game.init();
  Game.pureAds.load();
});
