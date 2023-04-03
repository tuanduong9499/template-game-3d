import { Entity, Vec3 } from "playcanvas";
import { AssetManager } from "../../../template/assetManager";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { Animator } from "../../scripts/animator/animator";
import { PlayerController } from "../../scripts/controllers/playerController";
import { CastBox } from "../../scripts/raycast/castBox";
import { GameConstant } from "../../../gameConstant";
import { BoxCollider } from "../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../physics/collisionTag";
import { CollisionEvent } from "../../../physics/collissionEvent";

export class Player extends Entity{
  constructor(){
    super();
    this.velocityX= 0;
    this.velocityY = 0;
    this.velocityZ = 0;
    this.state = "idle";
    let anims = [
      AssetManager.find("character_idle"),
      AssetManager.find("character_walk"),
    ]
    this.initModel("character1", anims);
    this.boxCollider = this.addScript(BoxCollider, {
      tag: CollisionTag.Player,
      position: this.getLocalPosition(),
      scale: new Vec3(1, 1, 1),
      render: true
    });

    this.boxCollider.on(CollisionEvent.OnCollide, () => {
      console.log(12)
    });
  }

  initModel(modelAsset, anims) {
    this.model = ObjectFactory.createModel(modelAsset);
    this.addChild(this.model);
    this.posX = this.getLocalPosition().x;
    this.posY = this.getLocalPosition().y;
    this.posZ = this.getLocalPosition().z;

    let animation = this.model.addComponent("animation", {
      assets   : anims,
      activate : true,
      speed: 1
    });
    this.animator = this.addScript(Animator, {
      animation: animation,
      loop: true
    });
    this.animator.pause();
  }

  idle(){
    this.state = "idle";
    this.animator.setAnimation([{
      name: "character_idle",
      speed : 1,
      loop: true,
      blendTime: 0.1
    }]);

  }

  walk(){
    if(this.state == "walk"){
      return;
    }
    this.state = "walk";
    this.animator.setAnimation([{
      name: "character_walk",
      speed : 1,
      loop: true,
      blendTime: 1
    }]);
  }

  rotationPlayer(dir){
    switch (dir) {
      case "KeyW":
        this.setEulerAngles(0, 180, 0);
        break;

      case "KeyA":
      this.setEulerAngles(0, -90, 0);
        break;

      case "KeyS":
      this.setEulerAngles(0, 0, 0);
        break;

      case "KeyD":
      this.setEulerAngles(0, 90, 0);
        break;
    
      default:
        break;
    }
  }



  update(){
    this.setLocalPosition(this.posX += this.velocityX, this.posY += this.velocityY, this.posZ += this.velocityZ)
  }
}