import { Entity, StandardMaterial, Vec3, math } from "playcanvas";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { Util } from "../../../helpers/util";
import { BoxCollider } from "../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../physics/collisionTag";
import { CollisionEvent } from "../../../physics/collissionEvent";


export class Food extends Entity {
  constructor(){
    super();
    this.dt = 0;
    this._create();
    this._config();
  }

  
  _create(){
    this.food = ObjectFactory.createModel("cake");
    this.addChild(this.food);
    this.boxCollider = this.addScript(BoxCollider, {
      tag: CollisionTag.Food,
      position: this.food.getLocalPosition(),
      scale: new Vec3(1, 1, 1),

    });

    // this.boxCollider.on(CollisionEvent.OnCollide, () => {
    //   console.log(12)
    //   this.boxCollider.enabled = false;
    //   this.fire(foodCollisionEvent.collide);
    // })
    return this.food;
  }

  _config(){
    let material0 = new StandardMaterial();
    material0.diffuse = Util.createColor(12, 144, 22);

    this.food.model.meshInstances.forEach(mesh => {
      mesh.material = material0
    })
  }

  destroy(){
    this.removeChild(this.food);
    this.food.destroy();
    this.boxCollider.onDestroy();
    this.boxCollider.enabled = false;
  }
}