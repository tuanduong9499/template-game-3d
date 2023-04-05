import { Color, Entity, Vec3, Vec4 } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { UIScreen } from "../../template/ui/uiScreen";
import { ObjectFactory } from "../../template/objects/objectFactory";

export class PlayScreen extends UIScreen {
  constructor(){
    super(GameConstant.SCENE_PLAY);
    this.score = 0;
    this.time = 1000;
    this.isStart = false;
    this._createTime();
    this._createScore();
  }

  _createTime(){
    this.timeText = ObjectFactory.createTextElement({
      text: "Time: " + this.time,
      fontSize: 32,
      anchor: new Vec4(0.2, 0.9, 0.2, 0.9),
      fontFamily: "Arial",
      fontText: "Time: -01233456789",
    });
    this.addChild(this.timeText);
  }

  _createScore(){
    this.scoreText = ObjectFactory.createTextElement({
      text: "Score: " + this.score,
      fontSize: 32,
      anchor: new Vec4(0.8, 0.9, 0.8, 0.9),
      fontFamily: "Arial",
      fontText: "Score: -01233456789",
    })
    this.addChild(this.scoreText);
  }

  updateSCore(){
    this.score += 1;
    console.log(this.score);
    this.scoreText.element.text = "Score: "+ this.score; 
    if(this.score >= 5){
      this.fire("win");
    }
  }

  updateTime(){
    this.time += 200;
    this.timeText.element.text = "Time: " + this.time;
  }

  update(){
    if(this.isStart){
      this.time += -1;
      this.timeText.element.text = "Time: " + this.time;
      if(this.time <= 0){
        this.time = 1;
        this.fire("loss");
      }
    }
  }
  
}