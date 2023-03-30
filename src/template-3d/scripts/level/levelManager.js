import { Script } from "../../../template/systems/script/script";

export const LevelManager = Script.createScript({
  name: "levelManager",

  addLevel(level) {
    this.entity.addChild(level);
  },
});
