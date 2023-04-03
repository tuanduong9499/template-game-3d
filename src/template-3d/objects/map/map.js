import { Entity } from "playcanvas";
import mapData from "../../../../assets/jsons/mapData.json";
import { Obstacle } from "../obstacle/obstacle";

export class Map extends Entity {
  constructor(){
    super();
    this.maps = [];
    this._createMap();
  }

  _createMap(){
    mapData.obstacles.forEach(obj => {
      this.obstacle = new Obstacle(obj.x, obj.y, obj.z);
      this.addChild(this.obstacle);
      this.maps.push(this.obstacle);
    })
  }
}