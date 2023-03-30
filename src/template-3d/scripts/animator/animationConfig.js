export class AnimationConfig {
  constructor() {
    this.name = "";
    this.speed = 1;
    this.loop = false;
    this.blendTime = 0;
    /** @type {Array<AnimationKeyEvent>} */
    this.keyEvents = [];
  }
}

export class AnimationKeyEvent {
  /**
   *
   * @param {number} key 0 = start, 1 = end
   * @param {Function} event
   */
  constructor(key, event, scope = this) {
    this.key = key;
    this.called = false;
    this.event = event.bind(scope);
  }
}
