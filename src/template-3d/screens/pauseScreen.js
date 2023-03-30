import { Color, ELEMENTTYPE_TEXT, Entity, Vec2, Vec4 } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { AssetManager } from "../../template/assetManager";
import { GameStateManager, GameState } from "../../template/gameStateManager";
import { UIScreen } from "../../template/ui/uiScreen";

export class PauseScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_PAUSE);
  }

  create() {
    super.create();
    this._initBackground();
    this.initGameTag();
    this._initContinueText();
  }

  _resume() {
    GameStateManager.state = GameState.Playing;
  }

  _initBackground() {
    this._background = new Entity("background");
    this._background.addComponent("element", {
      type        : "image",
      spriteAsset : AssetManager.assets.find("panel"),
      anchor      : new Vec4(0, 0, 1, 1),
      pivot       : new Vec2(0.5, 0, 5),
      color       : new Color(0, 0, 0),
    });
    this._background.element.opacity = 0.5;
    this._background.element.useInput = true;
    this._background.element.on("mousedown", this._resume.bind(this));
    this._background.element.on("touchstart", this._resume.bind(this));
    this.addChild(this._background);
  }

  _initContinueText() {
    let text = "TAP N HOLD TO CONTINUE";
    let fontSize = 46;
    let fontAsset = AssetManager.createCanvasFont(text, "Arial", fontSize, "bold");
    this.txtContinue = new Entity("txt_continue");
    this.txtContinue.addComponent("element", {
      type      : ELEMENTTYPE_TEXT,
      fontAsset : fontAsset,
      text      : text,
      fontSize  : fontSize,
      anchor    : new Vec4(0.5, 0.5, 0.5, 0.5),
      pivot     : new Vec2(0.5, 0.5),
      margin    : new Vec4(0, 0, 0, 0),
    });
    this.addChild(this.txtContinue);
  }
}
