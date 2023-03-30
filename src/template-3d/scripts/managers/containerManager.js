import { SoundManager } from "../../../template/soundManager";
import { Script } from "../../../template/systems/script/script";
import { ContainerEvent, ContainerState } from "../../objects/container";

export const ContainerManagerEvent = Object.freeze({
  Pick   : "containermanager:pick",
  Drop   : "containermanager:drop",
  Stack  : "containermanager:stack",
  Fail   : "containermanager:fail",
  Finish : "containermanager:finish",
});

export const ContainerManager = Script.createScript({
  name: "containerManager",

  attributes: {
    containers: { default: [] },
  },

  pickingStack: null,

  addContainers(...containers) {
    this.regisContainerEvent(containers);
    this.containers.push(...containers);
  },

  regisContainerEvent(containers) {
    containers.forEach((container) => {
      container.on(ContainerEvent.Pick, this.onContainerPick, this);
      container.on(ContainerEvent.Stack, this.onContainerStack, this);
      container.on(ContainerEvent.Drop, this.onContainerDrop, this);
      container.on(ContainerEvent.Matched, this.onContainerMatched, this);
    });
  },

  onContainerPick(stack) {
    this.fire(ContainerManagerEvent.Pick, stack);
  },

  onContainerStack(stack) {
    this.fire(ContainerManagerEvent.Stack, stack);
  },

  onContainerDrop(stack) {
    this.fire(ContainerManagerEvent.Drop, stack);

    if (this.isStuck()) {
      this.fire(ContainerManagerEvent.Fail);
    }
  },

  onContainerMatched() {
    SoundManager.play("sfx_matched");

    if (this.isAllContainersMatched()) {
      this.fire(ContainerManagerEvent.Finish);
    }
  },

  isStuck() {
    for (let i = 0; i < this.containers.length; i++) {
      var container = this.containers[i];
      var lastStack = container.stacks[container.stacks.length - 1];
      if (!lastStack || this.isDroppable(lastStack)) {
        return false;
      }
    }

    return true;
  },

  isDroppable(stack) {
    for (let i = 0; i < this.containers.length; i++) {
      var container = this.containers[i];
      var lastStack = container.stacks[container.stacks.length - 1];
      if (!container.fulled && lastStack && lastStack !== stack && lastStack.color === stack.color) {
        return true;
      }
    }
  },

  isAllContainersMatched() {
    return !this.containers.find((container) => container.stacks.length !== 0 && container.state !== ContainerState.Matched);
  },

  onCast(ray) {
    for (var i = 0; i < this.containers.length; i++) {
      var container = this.containers[i];
      if (container.castBox.checkIntersects(ray)) {
        this.onCastContainer(container);
        return;
      }
    }
  },

  onCastContainer(container) {
    if (container.state === ContainerState.Idle) {
      this._onSelectContainer(container);
    }
    else if (container.state === ContainerState.Picked) {
      this._doDrop(container);
    }
  },

  _onSelectContainer(container) {
    if (this.pickingStack) {
      if (container.isStackable(this.pickingStack)) {
        SoundManager.play("sfx_move");
        this.movePickingStackTo(container);
      }
      else {
        this._doDrop(this.pickingStack.container);
      }
    }
    else {
      this.pickingStack = container.pick();
      if (this.pickingStack) {
        SoundManager.play("sfx_pick");
      }
    }
  },

  _doDrop(container) {
    SoundManager.play("sfx_drop");
    container.drop();
    this.pickingStack = null;
  },

  movePickingStackTo(container) {
    this.pickingStack.removeFromContainer();
    container.stack(this.pickingStack);
    this.pickingStack = null;
  },
});
