import { Color, Vec4, log } from "playcanvas";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Util } from "../../helpers/util";
import { ObjectFactory } from "../../template/objects/objectFactory";
import { Tween } from "../../template/systems/tween/tween";
import { UIScreen } from "../../template/ui/uiScreen";

export const selectPlayerEvent = Object.freeze({
  player1_event: "player1Event",
  player2_event: "player2Event"
})

export class SelectPlayerScreen extends UIScreen{
  constructor(){
    super(GameConstant.SCREEN_SELECTPLAYER);
    this._initBackground();
    this._initGroupElement();
    this._initSpritePlayer1();
    this._initSpritePlayer2();
    this._initHand();
    this._initTagLine();
    this.resize();
  }

  _initBackground(){
    let color = Util.createColor(50, 50, 50);
    this.bg = ObjectFactory.createColorBackground(color);
    this.addChild(this.bg);
  }

  _initGroupElement(){
    this.group = ObjectFactory.createGroupElement();
    this.addChild(this.group);
    this.group.element.anchor.set(0.5, 0.5, 0.5, 0.5);
    this.group.element.width = 400;
    this.group.element.height = 720;
  }

  _initSpritePlayer1(){
    this.player1 = ObjectFactory.createImageElement("spr_player1");
    this.player1.element.anchor.set(0.5, 0.4, 0.5, 0.4);
    this.player1.setLocalPosition(-200, 0, 0)
    this.group.addChild(this.player1);
    this.player1ScaleTween = Tween.createScaleTween(this.player1, {x: 1.2, y: 1.2}, {
      duration : 1,
      loop     : true,
      yoyo     : true,
      easing   : Tween.Easing.Sinusoidal.InOut,
    });

    Util.registerOnceTouch(this.player1.element, () => {
      this.fire(selectPlayerEvent.player1_event, this.player1);
    });
  }

  _initSpritePlayer2(){
    this.player2 = ObjectFactory.createImageElement("spr_player2");
    this.player2.element.anchor.set(0.5, 0.4, 0.5, 0.4);
    this.player2.setLocalPosition(200 , 0, 0)
    console.log(this.player2.element.anchor)
    this.group.addChild(this.player2);
    console.log(this.player2.getLocalPosition())

    this.player2ScaleTween = Tween.createScaleTween(this.player2, {x: 1.2, y: 1.2}, {
      duration : 1,
      loop     : true,
      yoyo     : true,
      easing   : Tween.Easing.Sinusoidal.InOut,
      onRepeat : () => {
        this.player1ScaleTween.start();
      }
    }).start();

    Util.registerOnceTouch(this.player2.element, () => {
      this.fire(selectPlayerEvent.player2_event, this.player2);
    });

  }

  _initHand(){
    this.hand = ObjectFactory.createImageElement("spr_hand");
    this.hand.setLocalPosition(this.player1.getLocalPosition().x , -200, 0);
    this.group.addChild(this.hand);
    Tween.createLocalTranslateTween(this.hand, {x:  this.player2.getLocalPosition().x},{
      duration: 1,
      loop: true,
      yoyo: true,
    }).start();
  }

  _initTagLine(){
    this.tagLine = ObjectFactory.createImageElement("spr_select_player");
    this.group.addChild(this.tagLine);
    this.tagLine.setLocalScale(1.5, 1.5, 1.5)
    this.tagLine.element.anchor.set(0.5, 0.9, 0.5, 0.9)
  }

  resize(){
    super.resize();
    if(Game.isPortrait){
      this.group.element.anchor.set(0.5, 0.5, 0.5, 0.5);
    }
    else{
      this.group.element.anchor.set(0.5, 0.5, 0.5, 0.5);
    }
  }
}