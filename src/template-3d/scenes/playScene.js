import { Scene } from "../../template/scene/scene";
import { GameConstant } from "../../gameConstant";
import { Game } from "../../game";
import { Color, Entity, LIGHTTYPE_DIRECTIONAL, PROJECTION_ORTHOGRAPHIC } from "playcanvas";
import { Util } from "../../helpers/util";
import { selectPlayerEvent, SelectPlayerScreen } from "../screens/selectPlayerScreen";
import { Player } from "../objects/player/player";
import { Ground } from "../objects/ground/ground";
import { Obstacle } from "../objects/obstacle/obstacle";
import { Map } from "../objects/map/map";
import { Raycast, RaycastEvent } from "../scripts/raycast/raycast";
import { InputHandler, InputHandlerEvent } from "../scripts/input/inputHandler";
import { PlayScreen } from "../screens/playSCreen";
import { FoodManager, foodCollideEvent } from "../objects/food/foodManager";
import { WinScreen } from "../screens/winScreen";
import { LoseScreen } from "../screens/loseScreen";

export class PlayScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_PLAY);
  }

  create() {
    super.create();

    this.ui.addScreens(
      new SelectPlayerScreen(),
      new PlayScreen(),
      new WinScreen(),
      new LoseScreen(),
    );
    this.ui.setScreenActive(GameConstant.SCREEN_SELECTPLAYER);
    console.log(this.ui.screens)
    let selectPlayerScreen = this.ui.getScreen("SelectPlayer");
    selectPlayerScreen.on(selectPlayerEvent.player2_event, (player) => {
      this.ui.setScreenActive(GameConstant.SCREEN_PLAY);
      this.ui.disableScreen("SelectPlayer");
      let playScreen = this.ui.getScreen("Play");
      playScreen.isStart = true;
      playScreen.once("loss", () => {
        this._onLose();
        this.ui.setScreenActive(GameConstant.SCREEN_LOSE);
        this.ui.disableScreen("Play");
      });
      playScreen.once("win", () => {
        this._onWin();
        this.ui.setScreenActive(GameConstant.SCREEN_WIN);
        this.ui.disableScreen("Play");
      })
    });
    //this.ui.setScreenActive(GameConstant.SCREEN_LOSE);

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
  }

  _onWin() {
    Game.onWin();
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
    this._initMap();
    this._initPlayer();
    this._registerKeyDownEvent();
    this._registerKeyUpEvent();
    this._initGround();
    this._initFoodManager();
    
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

  _initInputHandler() {
    let inputHandlerEntity = new Entity("input");
    this.inputHandler = inputHandlerEntity.addScript(InputHandler);
    this.inputHandler.enabled = true;
    this.addChild(inputHandlerEntity);
  }

  _initPlayer(){
    this.player = new Player();
    this.addChild(this.player);
  }

  _initGround(){
    this.ground = new Ground();
    this.addChild(this.ground);
    this.ground.setLocalScale(10, 1, 30);
  }

  _initMap(){
    this.map = new Map();
    this.addChild(this.map);
  }

  _registerKeyDownEvent(){
    document.addEventListener("keydown", (e) => {
      this.player.walk();
      switch (e.code) {
        case "KeyW":
          this.player.velocityZ = -0.04;
          this.player.rotationPlayer(e.code);
          break;
        case "KeyA":
          this.player.velocityX = -0.04;
          this.player.rotationPlayer(e.code);
          break;
        case "KeyS":
          this.player.velocityZ = 0.04;
          this.player.rotationPlayer(e.code);
          break;
        case "KeyD":
          this.player.velocityX = 0.04;
          this.player.rotationPlayer(e.code);
          break;
              
        default:
          break;
      }
    })
  }

  _registerKeyUpEvent(){
    document.addEventListener("keyup", () => {
      this.player.state = "idle";
      this.player.velocityX = 0;
      this.player.velocityY = 0;
      this.player.velocityZ = 0;
      this.player.idle()

    })
  }

  _initFoodManager(){
    this.foodManager = new FoodManager();
    this.addChild(this.foodManager);


    this.foodManager.on(foodCollideEvent.collide, () => {
      this.ui.screens.forEach(screen => {
        if(screen.key === "Play"){
          screen.updateSCore();
          screen.updateTime();
        }
      })
    })

  }

  update(dt){
    this.player.update();
    this.foodManager.update();
    this.ui.screens[1].update(dt);
  }
}