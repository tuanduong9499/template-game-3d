import { Vec2, Vec4 } from "playcanvas";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Util } from "../../helpers/util";
import { Tween } from "../../template/systems/tween/tween";
import { UIScreen } from "../../template/ui/uiScreen";
import { ObjectFactory } from "../objectFactory";

export const LoadingScreenEvent = Object.freeze({
  Complete: "loadingscreen:complete",
});

export class LoadingScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_LOADING);
    this.progressMaxWidth = 486;

    this._initBackground();
    this._initGameIcon();
    this._initProgress();
    this._initTextLoading();
  }

  resize() {
    super.resize();

    if (Game.isPortrait) {
      this.icon.setLocalPosition(0, 180, 0);
      this.groupProgress.setLocalPosition(0, -60, 0);
      this.txtLoading.setLocalPosition(0, -120, 0);
    }
    else {
      this.icon.setLocalPosition(0, 170, 0);
      this.groupProgress.setLocalPosition(0, -30, 0);
      this.txtLoading.setLocalPosition(0, -90, 0);
    }
  }

  _initBackground() {
    let color = Util.createColor(103, 130, 245);
    this.bg = ObjectFactory.createColorBackground(color);
    this.addChild(this.bg);
  }

  _initGameIcon() {
    this.icon = ObjectFactory.createImageElement("spr_game_icon");
    this.addChild(this.icon);
  }

  _initProgress() {
    this.groupProgress = ObjectFactory.createGroupElement();
    this.addChild(this.groupProgress);

    this.progressBg = ObjectFactory.createImageElement("spr_loading_progress_bg");
    this.groupProgress.addChild(this.progressBg);

    this.progress = ObjectFactory.createImageElement("spr_loading_progress", {
      anchor : new Vec4(0, 0.5, 0, 0.5),
      pivot  : new Vec2(0, 0.5),
      x      : 4,
    });
    this.progressBg.addChild(this.progress);

    Tween.createCountTween({
      duration : 2,
      onUpdate : (progress) => {
        this.progress.element.width = progress.percent * this.progressMaxWidth;
      },
      onComplete: () => {
        this.fire(LoadingScreenEvent.Complete);
      },
    }).start();
  }

  _initTextLoading() {
    this.txtLoading = ObjectFactory.createImageElement("spr_txt_loading");
    this.addChild(this.txtLoading);
  }
}
