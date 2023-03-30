import { Vec3 } from "playcanvas";

export class LevelData {
  constructor(data) {
    this.position = data.position ? new Vec3(data.position) : new Vec3();
    this.objects = data.objects || [];
  }
}

export const LevelObjectType = {
  Container: "container",
};

export class LevelObjectData {
  constructor(data = {}) {
    this.type = data.type || LevelObjectType.Container;
    this.position = data.position ? new Vec3(data.position) : new Vec3();
    this.scale = data.scale ? new Vec3(data.scale) : new Vec3(1, 1, 1);
    this.rotation = data.rotation ? new Vec3(data.rotation) : new Vec3();
    this.config = data.config || {};
  }
}
