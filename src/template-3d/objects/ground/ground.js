import { Entity, StandardMaterial } from "playcanvas";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { Util } from "../../../helpers/util";

export class Ground extends Entity {
  constructor(){
    super();
    this._create();
  }

  _create(){
    let material = new StandardMaterial();
    material.diffuse = Util.createColor(201, 201, 201);
    this.ground = ObjectFactory.createPlane();
    this.addChild(this.ground);
    this.ground.model.meshInstances[0].material = material;
  }
}