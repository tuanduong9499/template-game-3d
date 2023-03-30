import { GameConstant } from "../../gameConstant";
import { AssetManager } from "../../template/assetManager";
import { GameStateManager, GameState } from "../../template/gameStateManager";
import { Util } from "../../helpers/util";
import { UIScreen } from "../../template/ui/uiScreen";
import { ObjectFactory } from "../../template/objects/objectFactory";
import { Tween } from "../../template/systems/tween/tween";
import { ELEMENTTYPE_TEXT, Entity, Vec2, Vec4 } from "playcanvas";

export class TutorialScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_TUTORIAL);
    this._initFakeBackground();
    this.initGameTag();
    // this._initTutorial();
  }

  _initFakeBackground() {
    this.bgFake = new Entity("fake_background");
    this.addChild(this.bgFake);

    this.bgFake.addComponent("element", {
      type   : "image",
      anchor : new Vec4(0, 0, 1, 1),
    });
    this.bgFake.element.opacity = 0;
    this.bgFake.element.useInput = true;
    this.bgFake.element.on("mousedown", this._onTapBackground.bind(this));
    this.bgFake.element.on("touchstart", this._onTapBackground.bind(this));
  }

  _onTapBackground() {
    this.enabled = false;
    this.destroy();
    GameStateManager.state = GameState.Playing;
  }

  _initTutorial() {
    this.tutorial = ObjectFactory.createGroupElement({
      anchor: new Vec4(0.5, 0.2, 0.5, 0.2),
    });
    this.addChild(this.tutorial);

    this._initTutorialText();
    this._initHand();
  }

  _initTutorialText() {
    let text = " DRAG TO MOVE";
    let fontAsset = AssetManager.find("font_minecrafter");
    this.txtTutorial = new Entity("txt_tutorial");
    this.txtTutorial.addComponent("element", {
      type             : ELEMENTTYPE_TEXT,
      text,
      fontAsset,
      fontSize         : 60,
      fontWeight       : "bold",
      color            : Util.createColor(255, 0, 0),
      outlineColor     : Util.createColor(255, 255, 255),
      outlineThickness : 1,
      pivot            : new Vec2(0.5, 0.5),
      alignment        : new Vec2(0.5, 0.5),
      margin           : new Vec4(0, 0, 0, 0),
    });
    this.tutorial.addChild(this.txtTutorial);
    this.txtTutorial.setLocalPosition(0, -130, 0);
  }

  _initHand() {
    this.hand = ObjectFactory.createImageElement("spr_hand", {
      anchor : new Vec4(0, 0, 0, 0),
      pivot  : new Vec2(0.3, 0.5),
      x      : -150,
      y      : -20,
    });

    this.hand.setLocalEulerAngles(0, 0, 30);
    this.tutorial.addChild(this.hand);

    this.tweenHand = Tween.createLocalTranslateTween(this.hand, { x: 160 }, {
      duration : 1,
      loop     : true,
      yoyo     : true,
      easing   : Tween.Easing.Sinusoidal.InOut,
    });
    this.tweenHand.start();
  }
}
