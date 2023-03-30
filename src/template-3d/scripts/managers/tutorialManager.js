import { Script } from "../../../template/systems/script/script";
import { Tween } from "../../../template/systems/tween/tween";

export const TutorialManager = Script.createScript({
  name: "tutorialManager",

  attributes: {
    indicator  : { default: null },
    containers : { default: [] },
  },

  startTween : null,
  _curTween  : null,

  start(entities) {
    this.indicator.enabled = true;
    let targets = this.getTargets(entities);
    targets.forEach((target) => this.initStep(target));

    let firstTarget = targets[0];
    if (firstTarget) {
      this.indicator.setPosition(firstTarget.getPosition());
    }

    if (this.startTween && this._curTween) {
      this._curTween.chain(this.startTween);
    }
    this.startTween?.start();
  },

  stop() {
    this.startTween.stopChainedTweens();
    this.indicator.enabled = false;
  },

  initStep(target) {
    let step = target.tutorialStep;
    if (step === 1) {
      this.indicator.setPosition(target.getPosition());
    }
    else {
      this.addAnimation(target);
    }
  },

  addAnimation(target) {
    let targetPos = target.getPosition().clone();
    let tween = Tween.createGlobalTranslateTween(this.indicator, targetPos, {
      duration : 1,
      easing   : Tween.Easing.Sinusoidal.InOut,
    });
    this.indicator.setPosition(targetPos);

    let tweenDelay = Tween.createCountTween({
      duration: 0.5,
    });

    tween.chain(tweenDelay);

    if (this._curTween) {
      this._curTween.chain(tween);
    }
    else {
      this.startTween = tween;
    }

    this._curTween = tweenDelay;
  },

  getTargets(entities) {
    let targets = entities.filter((entity) => entity.tutorialStep);
    targets.sort((t1, t2) => t1.tutorialStep - t2.tutorialStep);
    return targets;
  },
});
