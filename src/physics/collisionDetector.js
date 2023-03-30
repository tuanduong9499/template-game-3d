import { CollisionTag } from "./collisionTag";
import { CollisionEvent } from "./collissionEvent";

export class CollisionDetector {
  /** @type {CollisionDetector} */
  static _instance;

  static get instance() {
    if (!this._instance) {
      this._instance = new CollisionDetector();
    }

    return this._instance;
  }

  constructor() {
    this.groups = {};
  }

  /**
   * @param {Array<{tag: string, collideTags: Array<string>}>} filters
   */
  init(filters) {
    this.filters = filters;
    Object.keys(CollisionTag).forEach((key) => {
      var tag = CollisionTag[key];
      this.groups[tag] = [];
    });
  }

  update() {
    this.filters.forEach((filter) => this._checkFilter(filter));
  }

  _checkFilter(filter) {
    filter.collideTags.forEach((tag) => this._checkTags(filter.tag, tag));
  }

  _checkTags(tag1, tag2) {
    this.groups[tag1].forEach((collider) => {
      if (collider.enabled) {
        this._checkCollider(collider, this.groups[tag2]);
      }
    });
  }

  _checkCollider(collider, group) {
    for (var i = 0; i < group.length; i++) {
      var collider2 = group[i];
      if (collider2.enabled && this._iscollide(collider, collider2)) {
        collider.fire(CollisionEvent.OnCollide, collider2);
        collider2.fire(CollisionEvent.OnCollide, collider);
      }

      if (!collider.enabled) {
        return;
      }
    }
  }

  _iscollide(collider1, collider2) {
    let bound1 = collider1.getBound();
    let bound2 = collider2.getBound();
    return bound1.intersects(bound2);
  }

  add(collider) {
    let tag = collider.tag;
    this.groups[tag].push(collider);
  }

  remove(collider) {
    let tag = collider.tag;
    let group = this.groups[tag];
    let index = group.indexOf(group.indexOf(collider));
    if (index >= 0) {
      console.log("remove", index);
      group.splice(index, 1);
    }
  }
}
