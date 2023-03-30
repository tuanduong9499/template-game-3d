import { Vec4 } from "playcanvas";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Util } from "../../helpers/util";
import { UIScreen } from "../../template/ui/uiScreen";
import { ObjectFactory } from "../../template/objects/objectFactory";
export class PlayScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_PLAY);
    this.device = Game.app.graphicsDevice;
    this.initGameTag();
    this.initButtonReset();
  }

  resize() {
    super.resize();

    if (Game.isPortrait) {
      this.btnReset.setLocalScale(1, 1, 1);
    }
    else {
      this.btnReset.setLocalScale(0.8, 0.8, 0.8);
    }
  }

  initButtonReset() {
    this.btnReset = ObjectFactory.createImageElement("spr_btn_reset", {
      anchor: new Vec4(0.5, 0.2, 0.5, 0.2),
    });
    this.btnReset.disable();
    this.addChild(this.btnReset);

    Util.registerOnTouch(this.btnReset.element, () => Game.onCTAClick("btn_reset"));
  }
}
