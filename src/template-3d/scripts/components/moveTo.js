import { Vec3 } from "playcanvas";
import { Script } from "../../../template/systems/script/script";
import { Tween } from "../../../template/systems/tween/tween";

export const MoveTo = Script.createScript({
  name: "moveTo",

  attributes: {
    runOnStart : { default: true },
    dst        : { default: new Vec3() },
    config     : { default: {} },
  },

  tween: null,

  initialize() {
    if (this.runOnStart) {
      this.move();
    }
  },

  move(dst = null, config = null) {
    var tweenDst = dst || this.dst;
    var tweenConfig = config || this.config;

    this.tween?.stop();
    this.tween = Tween.createLocalTranslateTween(this.entity, tweenDst, tweenConfig);
    this.tween.start();
  },
});
