import { ELEMENTTYPE_TEXT, Entity, Vec2, Vec3, Vec4 } from "playcanvas";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Util } from "../../helpers/util";
import { AssetManager } from "../../template/assetManager";
import { Tween } from "../../template/integrate/tween";
import { Camera } from "../../template/objects/camera";
import { UIScreen } from "../../template/ui/uiScreen";
import { ObjectFactory } from "../objectFactory";

export class EndCardScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_ENDCARD);
    this.emojis = [];
    this._initFakeBackground();
    this.initGameTag();
    this._initEmojiHolder();
  }

  addEmoji(emojiAsset, target, offset = new Vec3(), bubbleflip = new Vec2(1, 1)) {
    let emoji = ObjectFactory.createGroupElement({
      pivot  : new Vec2(0.5, 0),
      anchor : new Vec4(0, 0, 0, 0),
    });
    this.emojiHolder.addChild(emoji);

    let talkingBubble = ObjectFactory.createImageElement("spr_talking_bubble", {
      pivot  : new Vec2(0.5, 0.58),
      anchor : new Vec4(0, 0, 0, 0),
    });
    talkingBubble.setLocalScale(bubbleflip.x, bubbleflip.y, 1);
    emoji.addChild(talkingBubble);

    let emoticon = ObjectFactory.createImageElement(emojiAsset, {
      pivot  : new Vec2(0.5, 0.5),
      anchor : new Vec4(0, 0, 0, 0),
    });
    emoji.addChild(emoticon);
    emoji.emoticon = emoticon;

    if (this.isLandScape) {
      offset.scale(0.75);
      emoji.setLocalScale(0.75, 0.75, 0.75);
    }

    let targetPos = Camera.main.camera.worldToScreen(target.getPosition());
    let pos = this.getScreenSpacePosition(targetPos);
    pos.add(offset);
    emoji.setLocalPosition(pos);

    Tween.playShakeTween(emoticon, new Vec3(2, 2, 2), 0.1);
    this.emojis.push(emoji);
  }

  _initEmojiHolder() {
    this.emojiHolder = ObjectFactory.createGroupElement({
      anchor: new Vec4(0, 0, 0, 0),
    });
    this.addChild(this.emojiHolder);
  }

  addDragToMoveText(target, offset = new Vec3()) {
    if (this.isLandScape) {
      offset.scale(0.75);
    }
    let targetPos = Camera.main.camera.worldToScreen(target.getPosition());
    let pos = this.getScreenSpacePosition(targetPos);
    pos.add(offset);

    let text = " DRAG TO MOVE";
    let fontAsset = AssetManager.find("font_minecrafter");
    this.txtDragToMove = new Entity("txt_dragtomove");
    this.txtDragToMove.addComponent("element", {
      type             : ELEMENTTYPE_TEXT,
      text,
      fontAsset,
      fontSize         : 60,
      fontWeight       : "bold",
      color            : Util.createColor(255, 0, 0),
      outlineColor     : Util.createColor(255, 255, 255),
      outlineThickness : 1,
      pivot            : new Vec2(0.5, 0.5),
      alignment        : new Vec2(0.5, 0.5),
      margin           : new Vec4(0, 0, 0, 0),
    });
    this.addChild(this.txtDragToMove);
    this.txtDragToMove.setLocalPosition(pos.x, pos.y, 0);

    let tweenTarget = { t: 0 };
    let tweenAppear = Tween.createTween(tweenTarget, { t: 1 }, {
      duration : 0.5,
      onStart  : () => this.txtDragToMove.enabled = true,
    });
    let tweenDisappear = Tween.createTween(tweenTarget, { t: 0 }, {
      duration : 0.25,
      onStart  : () => this.txtDragToMove.enabled = false,
    });
    tweenAppear.chain(tweenDisappear);
    tweenDisappear.chain(tweenAppear);
    tweenAppear.start();

    this.txtDragToMove.tweens = [tweenDisappear, tweenAppear];
  }

  removeEmojis() {
    this.emojis.forEach((emoji) => {
      this.emojiHolder.removeChild(emoji);
      emoji.emoticon.shakeTween?.stop();
      emoji.destroy();
    });
    this.emojis = [];
  }

  removeDragToMoveText() {
    if (!this.txtDragToMove) {
      return;
    }

    this.txtDragToMove.tweens.forEach((tween) => tween.stop());
    this.txtDragToMove.parent.removeChild(this.txtDragToMove);
    this.txtDragToMove.destroy();
    this.txtDragToMove = null;
  }

  _initFakeBackground() {
    this.bgFake = new Entity("fake_background");
    this.addChild(this.bgFake);

    this.bgFake.addComponent("element", {
      type   : "image",
      anchor : new Vec4(0, 0, 1, 1),
    });
    this.bgFake.element.opacity = 0;
    this.bgFake.element.useInput = true;
    this.bgFake.element.on("mousedown", this.onTapBackground.bind(this));
    this.bgFake.element.on("touchstart", this.onTapBackground.bind(this));
  }

  onTapBackground() {
    Game.onCTAClick("endcard_bg");
  }
}
