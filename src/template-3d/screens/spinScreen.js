import { Vec2 } from "playcanvas";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Util } from "../../helpers/util";
import { Debug } from "../../template/debug";
import { SoundManager } from "../../template/soundManager";
import { Tween } from "../../template/systems/tween/tween";
import { UIScreen } from "../../template/ui/uiScreen";
import { ObjectFactory } from "../../template/objects/objectFactory";
import { SpinCard } from "../objects/ui/spinCard";

export const SpinScreenEvent = Object.freeze({
  Complete: "spinscreen:completed",
});
export class SpinScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_SPIN);
    this.cards = [];
    this.cardSize = new Vec2(3, 3);
    this.cardMargin = new Vec2(170, 170);

    this._initBackground();
    this._initTagline();
    this._initCards();
    this._initButtonSpin();
    this.initButtonSound();
    this.resize();
  }

  resize() {
    super.resize();

    if (Game.isPortrait) {
      this.tagline.setLocalPosition(0, 410, 0);
      this.tagline.setLocalScale(1, 1, 1);
      this.cardContainer.setLocalScale(1, 1, 1);
      this.btnSpin.setLocalPosition(0, -370, 0);
      this.btnSpin.setLocalScale(1, 1, 1);
    }
    else {
      this.tagline.setLocalPosition(0, 250, 0);
      this.tagline.setLocalScale(0.8, 0.8, 0.8);
      this.cardContainer.setLocalScale(0.75, 0.75, 0.75);
      this.btnSpin.setLocalPosition(0, -270, 0);
      this.btnSpin.setLocalScale(0.8, 0.8, 0.8);
    }
  }

  spin() {
    Debug.log("SpinScreen", "Spin");

    this.btnSpin.enabled = false;

    let selectCount = 15;
    let selectedCard = null;
    let tweenSelect = Tween.createCountTween({
      duration : 2,
      easing   : Tween.Easing.Sinusoidal.Out,
      onUpdate : (target) => {
        var cardIndex = Math.floor(target.percent * selectCount) % (this.cards.length);
        if (this.cards[cardIndex] !== selectedCard) {
          selectedCard?.lock();
          selectedCard = this.cards[cardIndex];
          selectedCard.select();
          SoundManager.play("sfx_button");
        }
      },
    });

    let tweenUnlock = Tween.createCountTween({
      duration   : 0.2,
      onComplete : () => {
        selectedCard?.unlock();
      },
    });

    let tweenComplete = Tween.createCountTween({
      duration   : 1,
      onComplete : () => {
        this.fire(SpinScreenEvent.Complete);
      },
    });

    tweenSelect.chain(tweenUnlock);
    tweenUnlock.chain(tweenComplete);
    tweenSelect.start();
  }

  _initBackground() {
    let color = Util.createColor(255, 255, 255);
    this.bg = ObjectFactory.createColorBackground(color);
    this.addChild(this.bg);
  }

  _initTagline() {
    this.tagline = ObjectFactory.createImageElement("spr_spin_tagline");
    this.addChild(this.tagline);
  }

  _initCards() {
    this.cardContainer = this.createCards(this.cardSize, this.cardMargin);
    this.addChild(this.cardContainer);
  }

  createCards(size = new Vec2(), margin = new Vec2()) {
    let cards = ObjectFactory.createGroupElement();

    let totalHeight = (size.y - 1) * this.cardMargin.y;
    let startY = totalHeight / 2;
    for (var i = 0; i < size.y; i++) {
      var y = startY - margin.y * i;
      var row = this.createSpinRow(0, y, size.x, margin);
      cards.addChild(row);
    }

    return cards;
  }

  createSpinRow(x, y, length, margin) {
    let row = ObjectFactory.createGroupElement();
    let totalLength = (length - 1) * margin.x;
    let startX = x - totalLength / 2;
    for (var i = 0; i < length; i++) {
      var cardX = x + startX + margin.x * i;
      var card = this.createCard();
      row.addChild(card);
      card.setLocalPosition(cardX, y, 0);
    }

    return row;
  }

  createCard() {
    let card = new SpinCard();
    this.cards.push(card);
    return card;
  }

  _initButtonSpin() {
    this.btnSpin = ObjectFactory.createGroupElement();
    this.addChild(this.btnSpin);

    let sprite = ObjectFactory.createImageElement("spr_btn_spin");
    this.btnSpin.addChild(sprite);
    Util.registerOnceTouch(sprite.element, this.spin, this);

    Tween.createScaleTween(sprite, { x: 1.1, y: 1.1 }, {
      duration : 0.35,
      loop     : true,
      yoyo     : true,
      easing   : Tween.Easing.Sinusoidal.InOut,
    }).start();
  }
}
