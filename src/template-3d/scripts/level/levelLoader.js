import { Entity } from "playcanvas";
import { Script } from "../../../template/systems/script/script";
import { Container } from "../../objects/container";
import { LevelData, LevelObjectData, LevelObjectType } from "./levelData";

export const LevelLoaderEvent = Object.freeze({
  Load: "levelloader:load",
});

export const LevelLoader = Script.createScript({
  name: "levelLoader",

  attributes: {
    levelData: { default: null },
  },

  initialize() {
    this._loadLevels();
  },

  _loadLevels() {
    this.levelData.forEach((data) => this._addLevel(data));
  },

  _addLevel(data) {
    let levelData = new LevelData(data);
    let level = new Entity();
    level.setPosition(levelData.position);
    levelData.objects.forEach((objectData) => this._addObject(level, objectData));
    this.fire(LevelLoaderEvent.Load, level);
  },

  _addObject(level, data) {
    let objectData = new LevelObjectData(data);
    let object = this.createObject(objectData);
    if (object) {
      level.addChild(object);
    }

    return object;
  },

  createObject(data) {
    let object = null;

    if (data.type === LevelObjectType.Container) {
      object = new Container(data);
    }

    if (object) {
      object.setLocalPosition(data.position);
      object.setLocalScale(data.scale);
      object.setLocalEulerAngles(data.rotation);
    }

    return object;
  },
});
