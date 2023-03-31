import { Scene } from "../../template/scene/scene";
import { GameConstant } from "../../gameConstant";
import { Game } from "../../game";
import { Color, Entity, LIGHTTYPE_DIRECTIONAL, PROJECTION_ORTHOGRAPHIC } from "playcanvas";
import { Util } from "../../helpers/util";
import { selectPlayerEvent, SelectPlayerScreen } from "../screens/selectPlayerScreen";
import { Player } from "../objects/player/player";
import { Ground } from "../objects/ground/ground";

export class PlayScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_PLAY);
  }

  create() {
    super.create();

    this.ui.addScreens(
      new SelectPlayerScreen()
    );
    //this.ui.setScreenActive(GameConstant.SCREEN_SELECTPLAYER);

    this.ui.children[0].on(selectPlayerEvent.player1_event, (player) => {
      this.ui.disableAllScreens();
    });

    this.ui.children[0].on(selectPlayerEvent.player2_event, (player) => {
      this.ui.disableAllScreens();
    })

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
    this._initCamera();
    this._initPlayer();
    this._initGround();
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

  _initPlayer(){
    this.player = new Player();
    this.addChild(this.player);
  }

  _initGround(){
    this.ground = new Ground();
    this.addChild(this.ground);
    this.ground.setLocalScale(10, 10, 10);
  }
}
