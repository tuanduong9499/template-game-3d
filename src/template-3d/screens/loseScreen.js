import { GameConstant } from "../../gameConstant";
import { Util } from "../../helpers/util";
import { ObjectFactory } from "../../template/objects/objectFactory";
import { UIScreen } from "../../template/ui/uiScreen";

export class LoseScreen extends UIScreen {
  constructor(){
    super(GameConstant.SCREEN_LOSE);
    this._initBackground();
    this._initTagLine();
  }

  _initBackground(){
    let color = Util.createColor(50, 50, 50);
    this.bg = ObjectFactory.createColorBackground(color);
    this.addChild(this.bg);
  }

  _initTagLine(){
    this.tagLine = ObjectFactory.createImageElement("spr_loss");
    this.addChild(this.tagLine);
  }

}