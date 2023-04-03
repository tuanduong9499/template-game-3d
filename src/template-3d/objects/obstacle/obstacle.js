import { Entity, StandardMaterial, Vec3 } from "playcanvas";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { Util } from "../../../helpers/util";
import mapData from "../../../../assets/jsons/mapData.json";
import { CastBox } from "../../scripts/raycast/castBox";
import { GameConstant } from "../../../gameConstant";
import { BoxCollider } from "../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../physics/collisionTag";

export class Obstacle extends Entity {
  constructor(x, y, z){
    super();
    let material = new StandardMaterial();
    material.diffuseTint = true;
    material.diffuse = Util.createColor(123, 55, 1);
    this.obstacle = ObjectFactory.createBox();
    this.addChild(this.obstacle);
    this.obstacle.model.meshInstances[0].material = material;
    this.obstacle.setLocalPosition(x, y, z);

    this.boxCollider = this.addScript(BoxCollider, {
      tag: CollisionTag.MapObject,
      position: this.obstacle.getLocalPosition(),
      scale: new Vec3(1, 1, 1),
      render: true
    })
  }
}