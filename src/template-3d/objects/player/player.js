import { Entity } from "playcanvas";
import { ObjectFactory } from "../../../template/objects/objectFactory";

export class Player extends Entity{
  constructor(){
    super();
    this._initModel();
  }

  _initModel(){
    this.model = ObjectFactory.createModel("character1", );
    this.addChild(this.model);
  }
}