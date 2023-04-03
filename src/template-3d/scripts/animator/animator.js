import { Util } from "../../../helpers/util";
import { AssetManager } from "../../../template/assetManager";
import { Script } from "../../../template/systems/script/script";
import { AnimationConfig } from "./animationConfig";

export const Animator = Script.createScript({
  name       : "animator",
  attributes : {
    animation: {},
    loop     : {default: false}
  },

  currIndex   : 0,
  currPercent : 0,
  currConfig  : null,
  currName    : "",
  currAnim    : null,

  initialize() {
    this.anims = this.getAnims();
    this.animation.loop = this.loop;
  },

  update() {
    if (!this.currAnim) {
      return;
    }

    this.currPercent = this.animation.currentTime / this.currAnim.duration;
    this.currConfig.keyEvents.forEach((keyEvent) => {
      if (!keyEvent.called && keyEvent.key <= this.currPercent) {
        keyEvent.event();
        keyEvent.called = true;
      }
    });

    if (this.currPercent >= 1) {
      if (this.configs[this.currIndex + 1]) {
        this.start(this.currIndex + 1);
      }
      else if (this.currConfig.loop) {
        this.currConfig.keyEvents.forEach((keyEvent) => keyEvent.called = false);
        this.start(this.currIndex);
      }
    }
  },

  start(index, blendTime = 0) {
    this.currPercent = 0;
    this.currIndex = index;

    let config = this.configs[this.currIndex];
    this.currConfig = new AnimationConfig();
    Util.copyObject(config, this.currConfig);

    this.currName = this.currConfig.name;
    this.currAnim = this.animation.getAnimation(this.currName);

    this.animation.play(this.currName, blendTime);
    this.animation.speed = this.currConfig.speed;
  },

  /**
   * @param {Array<AnimationConfig>} configs
   */
  setAnimation(configs) {
    this.configs = configs;
    this.start(0, this.configs[0].blendTime);
  },

  setSpeed(speed) {
    this.configs[this.currIndex].speed = speed;
    this.animation.speed = speed;
  },

  getAnims() {
    return this.animation.assets.map((asset) => {
      if (typeof (asset) === "number") {
        return AssetManager.assets.get(asset).name;
      }
      else {
        return asset.name;
      }
    });
  },

  pause() {
    this.animation.speed = 0;
    this.disable();
  },

  resume() {
    this.animation.speed = this.currConfig.speed;
    this.enable();
  },
});
