import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Util } from "../../helpers/util";
import { Tween } from "../../template/systems/tween/tween";
import { UIScreen } from "../../template/ui/uiScreen";
import { ObjectFactory } from "../../template/objects/objectFactory";

export class WinScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_WIN);
    this._initBackground();
    this._initGameIcon();
    this._initTagline();
    this._initButtonPlayNow();
    this.initGameTag();
    this.resize();
  }

  resize() {
    super.resize();

    if (Game.isPortrait) {
      this.icon.setLocalPosition(0, 220, 0);
      this.tagline.setLocalPosition(0, 0, 0);
    }
    else {
      this.icon.setLocalPosition(0, 160, 0);
      this.tagline.setLocalPosition(0, -40, 0);
    }
  }

  _initBackground() {
    let color = Util.createColor(255, 255, 255);
    this.bg = ObjectFactory.createColorBackground(color);
    this.addChild(this.bg);
    Util.registerOnTouch(this.bg.element, () => Game.onCTAClick("endcard"));
  }

  _initGameIcon() {
    this.icon = ObjectFactory.createImageElement("spr_game_icon");
    this.addChild(this.icon);
  }

  _initTagline() {
    this.tagline = ObjectFactory.createImageElement("spr_win_tagline");
    this.addChild(this.tagline);
  }

  _initButtonPlayNow() {
    this.btnPlayNow = ObjectFactory.createImageElement("spr_btn_playnow", { y: -160 });
    this.addChild(this.btnPlayNow);

    Tween.createScaleTween(this.btnPlayNow, { x: 1.1, y: 1.1 }, {
      duration : 0.35,
      loop     : true,
      yoyo     : true,
      easing   : Tween.Easing.Sinusoidal.InOut,
    }).start();
  }
}
