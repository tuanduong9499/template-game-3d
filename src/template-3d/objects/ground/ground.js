import { Entity } from "playcanvas";
import { ObjectFactory } from "../../../template/objects/objectFactory";

export class Ground extends Entity {
  constructor(){
    super();
    this._create();
  }

  _create(){
    this.ground = ObjectFactory.createPlane();
    this.addChild(this.ground);
  }
}