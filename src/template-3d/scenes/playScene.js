import { Scene } from "../../template/scene/scene";
import { GameConstant } from "../../gameConstant";
import { GameStateManager, GameState } from "../../template/gameStateManager";
import { PlayScreen } from "../screens/playScreen";
import { Game } from "../../game";
import { SoundManager } from "../../template/soundManager";
import { TutorialScreen } from "../screens/tutorialScreen";
import { Color, Entity, LIGHTTYPE_DIRECTIONAL, PROJECTION_ORTHOGRAPHIC } from "playcanvas";
import { InputHandler, InputHandlerEvent } from "../scripts/input/inputHandler";
import { GameManagerEvent, GameManager } from "../scripts/managers/gameManager";
import { WinScreen } from "../screens/winScreen";
import { Util } from "../../helpers/util";
import { ObjectFactory } from "../../template/objects/objectFactory";
import { LevelLoader, LevelLoaderEvent } from "../scripts/level/levelLoader";
import levelData from "../../../assets/jsons/levelData.json";
import { LevelManager } from "../scripts/level/levelManager";
import { Raycast, RaycastEvent } from "../scripts/raycast/raycast";
import { ContainerManager, ContainerManagerEvent } from "../scripts/managers/containerManager";
import { Tween } from "../../template/systems/tween/tween";
import { TutorialManager } from "../scripts/managers/tutorialManager";
import { SpinScreen, SpinScreenEvent } from "../screens/spinScreen";

export class PlayScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_PLAY);
  }

  create() {
    super.create();

    this.ui.addScreens(
      new SpinScreen(),
      new TutorialScreen(),
      new PlayScreen(),
      new WinScreen(),
    );
    this.ui.setScreenActive(GameConstant.SCREEN_SPIN);
    this.spinScreen = this.ui.getScreen(GameConstant.SCREEN_SPIN);
    this.spinScreen.on(SpinScreenEvent.Complete, this._onStart, this);

    this.playScreen = this.ui.getScreen(GameConstant.SCREEN_PLAY);

    this._initLight();
    this._initGameplay();
  }

  _onLoadingComplete() {
    this.ui.disableAllScreens();
  }

  _onStart() {
    Game.onStart();
    this.ui.disableAllScreens();
    this.ui.setScreenActive(GameConstant.SCREEN_PLAY);
    this.gameManager.start();
  }

  pause() {
    this.gameManager?.pause();
  }

  resume() {
    this.gameManager?.resume();
  }

  _onLose() {
    Game.onLose();
    GameStateManager.state = GameState.Lose;
    Tween.createCountTween({
      duration   : 0.5,
      onComplete : () => {
        this._showWinScreen();
      },
    }).start();
  }

  _onWin() {
    Game.onWin();
    GameStateManager.state = GameState.Win;
    Tween.createCountTween({
      duration   : 1.5,
      onComplete : () => {
        SoundManager.play("sfx_win");
        this._showWinScreen();
      },
    }).start();
  }

  _showLoseScreen() {
    this.ui.disableAllScreens();
    this.ui.setScreenActive(GameConstant.SCREEN_LOSE);
  }

  _showWinScreen() {
    this.ui.disableAllScreens();
    this.ui.setScreenActive(GameConstant.SCREEN_WIN);
  }

  _initLight() {
    this.directionalLight = new Entity("light-directional");
    this.addChild(this.directionalLight);

    this.directionalLight.addComponent("light", {
      type             : LIGHTTYPE_DIRECTIONAL,
      color            : new Color(1, 1, 1),
      castShadows      : true,
      shadowDistance   : 30,
      shadowResolution : 1024,
      shadowBias       : 0.2,
      normalOffsetBias : 0.05,
      intensity        : 1,
    });
    this.directionalLight.setLocalPosition(2, 2, -2);
    this.directionalLight.setLocalEulerAngles(32.33, 27.44, -5.91);
  }

  _initGameplay() {
    this._initInputHandler();
    this._initCamera();
    this._initGameManager();
    this._initRaycast();
    this._initTutorial();
    this._initFloor();
    this._initLevel();
  }

  _initInputHandler() {
    let inputHandlerEntity = new Entity("input");
    this.inputHandler = inputHandlerEntity.addScript(InputHandler);
    this.inputHandler.enabled = false;
    this.addChild(inputHandlerEntity);
  }

  _initGameManager() {
    let gameManagerEntity = new Entity("game_manager");
    this.addChild(gameManagerEntity);

    this.gameManager = gameManagerEntity.addScript(GameManager);
    this.gameManager.on(GameManagerEvent.Start, this.inputHandler.enable, this.inputHandler);
    this.gameManager.on(GameManagerEvent.Lose, this._onLose, this);
    this.gameManager.on(GameManagerEvent.Lose, this.inputHandler.disable, this.inputHandler);
    this.gameManager.on(GameManagerEvent.Win, this._onWin, this);
    this.gameManager.on(GameManagerEvent.Win, this.inputHandler.disable, this.inputHandler);
  }

  _initCamera() {
    this.mainCamera = new Entity();
    this.mainCamera.addComponent("camera", {
      clearColor  : Util.createColor(0, 0, 0),
      projection  : PROJECTION_ORTHOGRAPHIC,
      orthoHeight : 5.2,
    });
    this.addChild(this.mainCamera);

    this.mainCamera.setLocalPosition(0, 13.2, 15.6);
    this.mainCamera.setLocalEulerAngles(-36, 0, 0);
  }

  _initRaycast() {
    let raycasterEntity = new Entity();
    this.addChild(raycasterEntity);

    this.raycast = raycasterEntity.addScript(Raycast, {
      camera: this.mainCamera.camera,
    });

    this.inputHandler.on(InputHandlerEvent.PointerDown, this.raycast.onPointerDown, this.raycast);
  }

  _initFloor() {
    this.floor = ObjectFactory.createPlane();
    this.addChild(this.floor);

    this.floor.setLocalScale(1000, 1000, 1000);
    this.floor.setLocalPosition(0, -0.005, 0);
  }

  _initLevel() {
    let levels = new Entity("levels");
    this.addChild(levels);

    let levelManagerEntity = new Entity("levelManager");
    this.levelManager = levelManagerEntity.addScript(LevelManager);

    let levelLoaderEntity = new Entity("levelLoader");
    this.levelLoader = levelLoaderEntity.addScript(LevelLoader, {
      levelData,
    });
    this.levelLoader.on(LevelLoaderEvent.Load, this.levelManager.addLevel, this.levelManager);

    let containerManagerEntity = new Entity("containerManager");
    this.containerManager = containerManagerEntity.addScript(ContainerManager);
    this.containerManager.on(ContainerManagerEvent.Pick, this.playScreen.btnReset.enable, this.playScreen.btnReset);
    this.containerManager.on(ContainerManagerEvent.Pick, this.tutorialManager.stop, this.tutorialManager);
    this.containerManager.on(ContainerManagerEvent.Finish, this.gameManager.win, this.gameManager);
    // this.containerManager.on(ContainerManagerEvent.Fail, this.gameManager.lose, this.gameManager);

    this.levelLoader.on(LevelLoaderEvent.Load, (level) => {
      let containers = level.find((entity) => entity.name === "container");
      this.containerManager.addContainers(...containers);
      this.tutorialManager.start(containers);
    });

    this.raycast.on(RaycastEvent.Cast, this.containerManager.onCast, this.containerManager);

    levels.addChild(levelManagerEntity);
    levels.addChild(levelLoaderEntity);
    levels.addChild(containerManagerEntity);
  }

  _initTutorial() {
    let tutorial = new Entity("tutorial");

    let hand = new Entity("hand");
    tutorial.addChild(hand);

    let cameraRotation = this.mainCamera.getLocalEulerAngles();
    let handSprite = ObjectFactory.createSprite("spr_hand");
    hand.addChild(handSprite);
    handSprite.setLocalEulerAngles(cameraRotation.x, cameraRotation.y, cameraRotation.z + 50);
    handSprite.setLocalPosition(0.45, 2, 1.8);

    this.tutorialManager = tutorial.addScript(TutorialManager, {
      indicator: hand,
    });

    this.addChild(tutorial);
  }
}
