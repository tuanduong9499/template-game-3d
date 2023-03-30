import { Entity } from "playcanvas";
import { AssetManager } from "../../template/assetManager";
import { ObjectFactory } from "../../template/objects/objectFactory";
import { MoveTo } from "../scripts/components/moveTo";

export class Stack extends Entity {
  constructor(container, color) {
    super("stack");
    this.container = container;
    this.color = color;

    let material = this._getMaterial(color);
    this.model = ObjectFactory.createModel("model_stack", material);
    this.addChild(this.model);

    this.addScript(MoveTo, {
      runOnStart: false,
    });
  }

  removeFromContainer() {
    this.container.removeStack(this);
  }

  _getMaterial(color) {
    let name = "";
    if (color === "blue") {
      name = "mat_stack_blue";
    }
    else if (color === "black") {
      name = "mat_stack_black";
    }
    else if (color === "red") {
      name = "mat_stack_red";
    }
    else if (color === "purple") {
      name = "mat_stack_purple";
    }
    else if (color === "pink") {
      name = "mat_stack_pink";
    }
    else if (color === "green") {
      name = "mat_stack_green";
    }

    let material = AssetManager.find(name).resource;
    return material;
  }
}
