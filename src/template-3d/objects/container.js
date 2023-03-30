import { Entity, Vec3 } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { Tween } from "../../template/systems/tween/tween";
import { ObjectFactory } from "../../template/objects/objectFactory";
import { MoveTo } from "../scripts/components/moveTo";
import { LevelObjectData } from "../scripts/level/levelData";
import { CastBox } from "../scripts/raycast/castBox";
import { ConfettiEffect } from "./effects/confettiEffect";
import { Stack } from "./stack";

export const ContainerState = Object.freeze({
  Idle     : "idle",
  Picked   : "picked",
  Stacking : "stacking",
  Dropping : "dropping",
  Matched  : "matched",
});

export const ContainerEvent = Object.freeze({
  Pick    : "container:pick",
  Stack   : "container:stack",
  Drop    : "container:drop",
  Matched : "container: matched",
});

export class Container extends Entity {
  constructor(data = new LevelObjectData()) {
    super("container");
    this.state = ContainerState.Idle;
    this.height = 4;
    this.stacks = [];
    this.tutorialStep = data.config.tutorialStep;

    this._initBase();
    this._initSticks();
    this._initStacks(data.config.stacks);
    this._initCastBox();
    this._initConfettiEffect();
    this._initLid();
  }

  _initBase() {
    this.base = ObjectFactory.createModel("model_container_base");
    this.addChild(this.base);
  }

  _initSticks() {
    this.stickContainer = new Entity();
    this.addChild(this.stickContainer);
    this.stickContainer.setLocalPosition(0, 0.1, 0);
    this.stickContainer.setLocalScale(1, 0.88, 1);

    let startY = 0.02;
    let margin = 0.34;
    for (var i = 0; i < this.height; i++) {
      var y = startY + margin * i;
      this.addStick(y);
    }
  }

  addStick(y) {
    let stick = new Entity();
    this.stickContainer.addChild(stick);
    stick.setLocalPosition(0, y, 0);

    let model = ObjectFactory.createModel("model_container_stick");
    stick.addChild(model);
    model.setLocalScale(0.8, 1, 0.8);

    return stick;
  }

  _initStacks(stacks = []) {
    this.stackContainer = new Entity();
    this.addChild(this.stackContainer);

    let startY = GameConstant.STACK_START_Y;
    let margin = GameConstant.STACK_MARGIN;
    stacks.forEach((stack, index) => {
      var y = startY + margin * index;
      this.addStack(y, stack.color);
    });
  }

  addStack(y, color) {
    let stack = new Stack(this, color);
    this.stackContainer.addChild(stack);
    stack.setLocalPosition(0, y, 0);

    this.stacks.push(stack);
    return stack;
  }

  _initCastBox() {
    this.castBox = this.addScript(CastBox, {
      scale  : new Vec3(1, 1.5, 1),
      render : GameConstant.CONTAINER_COLLIDER_RENDER,
    });
  }

  _initLid() {
    this.lid = ObjectFactory.createModel("model_container_base");
    this.addChild(this.lid);

    this.lid.setLocalScale(0.3, 0.2, 0.3);
    this.lid.setLocalPosition(0, 4, 0);
    this.lid.enabled = false;

    this.lidTween = Tween.createLocalTranslateTween(this.lid, { y: 1.3 }, {
      duration : 0.3,
      easing   : Tween.Easing.Sinusoidal.Out,
      onStart  : () => {
        this.lid.enabled = true;
      },
      onComplete: () => {
        this.fxConfetti.play();
      },
    });
  }

  _initConfettiEffect() {
    this.fxConfetti = new ConfettiEffect();
    this.addChild(this.fxConfetti);

    this.fxConfetti.setLocalPosition(0, 0.3, 0);
  }

  pick() {
    let lastStack = this.stacks[this.stacks.length - 1];
    if (!lastStack) {
      return;
    }

    let moveToScript = lastStack.getScript(MoveTo);
    if (!moveToScript) {
      return;
    }

    var moveDst = new Vec3(0, GameConstant.CONTAINER_PICKUP_Y, 0);
    var moveConfig = {
      duration : 0.15,
      easing   : Tween.Easing.Sinusoidal.Out,
    };
    moveToScript.move(moveDst, moveConfig);

    this.state = ContainerState.Picked;
    this.fire(ContainerEvent.Pick, lastStack);

    return lastStack;
  }

  drop() {
    let lastIndex = this.stacks.length - 1;
    let lastStack = this.stacks[lastIndex];
    if (!lastStack) {
      return;
    }

    let moveToScript = lastStack.getScript(MoveTo);
    if (!moveToScript) {
      return;
    }

    let y = GameConstant.STACK_START_Y + lastIndex * GameConstant.STACK_MARGIN;
    let moveDst = new Vec3(0, y, 0);
    let moveConfig = {
      duration   : 0.2,
      easing     : Tween.Easing.Bounce.Out,
      onComplete : () => this._onDrop(lastStack),
    };
    moveToScript.move(moveDst, moveConfig);
    this.state = ContainerState.Dropping;
  }

  _onDrop(stack) {
    this.fire(ContainerEvent.Drop, stack);

    if (this.isMatched()) {
      this.onMatched();
    }
    else {
      this.state = ContainerState.Idle;
    }
  }

  isMatched() {
    if (!this.fulled) {
      return false;
    }

    let matched = true;
    this.stacks.reduce((s1, s2) => {
      if (s1.color !== s2.color) {
        matched = false;
      }
      return s2;
    });

    return matched;
  }

  onMatched() {
    this.castBox.enabled = false;
    this.state = ContainerState.Matched;

    this.lidTween.start();
    this.fire(ContainerEvent.Matched);
  }

  stack(stack) {
    let position = stack.getPosition();
    this.stackContainer.addChild(stack);
    stack.setPosition(position);

    stack.container = this;
    this.stacks.push(stack);

    let moveToScript = stack.getScript(MoveTo);
    if (!moveToScript) {
      return;
    }

    var moveDst = new Vec3(0, GameConstant.CONTAINER_PICKUP_Y, 0);
    var moveConfig = {
      duration   : 0.2,
      easing     : Tween.Easing.Sinusoidal.Out,
      onComplete : () => this.drop(),
    };
    moveToScript.move(moveDst, moveConfig);

    this.state = ContainerState.Stacking;
    this.fire(ContainerEvent.Stack, stack);
  }

  removeStack(stack) {
    let index = this.stacks.indexOf(stack);
    if (index === -1) {
      return console.warn("Remove not added stack");
    }

    this.stackContainer.removeChild(stack);
    this.stacks.splice(index, 1);
    this.state = ContainerState.Idle;
  }

  isStackable(stack) {
    if (this.fulled) {
      return false;
    }

    let lastStack = this.stacks[this.stacks.length - 1];
    if (!lastStack) {
      return true;
    }

    return lastStack.color === stack.color;
  }

  get fulled() {
    return this.stacks.length >= this.height;
  }
}
