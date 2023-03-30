import { GAMMA_SRGB } from "playcanvas";
import { Game } from "../../game";
import { Util } from "../../helpers/util";
import { AssetConfigurator } from "./assetConfigurator";

export class Configurator {
  static config() {
    this.scene = Game.app.scene;
    this._configScene();
    AssetConfigurator.config();
  }

  static _configScene() {
    this.scene.ambientLight = Util.createColor(160, 160, 160);
    this.scene.gammaCorrection = GAMMA_SRGB;
  }
}
