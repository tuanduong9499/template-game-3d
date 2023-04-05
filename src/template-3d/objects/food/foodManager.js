import { Entity, math } from "playcanvas";
import { Food, foodCollisionEvent } from "./food";
import { CollisionEvent } from "../../../physics/collissionEvent";


export const foodCollideEvent = Object.freeze({
  collide: "foodCollide"
})

export class FoodManager extends Entity {
  constructor(){
    super();
    this.foods = [];
    this.dt = 0;
  }

  spawn(){
    let min = -2;
    let max = 2;
    let posX = Math.floor(Math.random() * (max - min + 1) + min);
    let posZ = Math.floor(Math.random() * (max - min + 1) + min);
    this.food = new Food();
    this.addChild(this.food);
    this.food.setLocalPosition(posX, 0, posZ);

    this.food.boxCollider.on(CollisionEvent.OnCollide, () => {
      this.food.boxCollider.enabled = false;
      this.fire(foodCollideEvent.collide);
      this.food.destroy();
    })
  }

  update(){
   this.dt += 1;
   if(Math.round(this.dt % 300 === 0)){
    if(this.food) {
      this.food.destroy();
    }
     this.spawn();
    }
  }

}