import { Vec2 } from "playcanvas";
import { Util } from "../../../helpers/util";
import { AssetManager } from "../../../template/assetManager";
import { Script } from "../../../template/systems/script/script";

export const ElementRatioFilterAspectType = Object.freeze({
  Asset  : "elementRatioFilterAspect:asset",
  Custom : "elementRatioFilterAspect:custom",
});

export const ElementRatioFilterFitMode = Object.freeze({
  Fit  : "elementRatioFitMode:fit",
  Fill : "elementRatioFitMode:fill",
});

export const ElementRatioFilter = Script.createScript({
  name: "elementRatioFilter",

  attributes: {
    fitOnStart    : { default: true },
    aspectType    : { default: ElementRatioFilterAspectType.Asset },
    naturalWidth  : { default: 0 },
    naturalHeight : { default: 0 },
    fitMode       : { default: ElementRatioFilterFitMode.Fit },
    border        : { default: new Vec2(1, 1) },
  },

  initialize() {
    if (this.fitOnStart) {
      this.fit();
    }
  },

  fit() {
    let width = 0;
    let height = 0;
    let target = this.getTargetSize();
    let ratio = this.getRatio();
    let targetRatio = target.width / target.height;

    if (this.fitMode === ElementRatioFilterFitMode.Fit) {
      if (ratio > targetRatio) {
        width = target.width;
        height = target.width / ratio;
      }
      else {
        width = target.height * ratio;
        height = target.height;
      }
    }
    else if (this.fitMode === ElementRatioFilterFitMode.Fill) {
      if (ratio < targetRatio) {
        width = target.width;
        height = target.width / ratio;
      }
      else {
        width = target.height * ratio;
        height = target.height;
      }
    }

    this.entity.element.width = width;
    this.entity.element.height = height;
  },

  getTargetSize() {
    let width = 0;
    let height = 0;

    let parentElement = this.entity.parent.element;
    if (parentElement) {
      width = parentElement.width * this.border.x;
      height = parentElement.height * this.border.y;
    }
    else {
      let res = this.entity.element.screen.screen.resolution;
      let scale = this.entity.element.screen.screen.scale;
      width = res.x / scale * this.border.x;
      height = res.y / scale * this.border.y;
    }

    return { width, height };
  },

  getRatio() {
    let size = { width: 0, height: 0 };

    if (this.aspectType === ElementRatioFilterAspectType.Asset) {

      if (this.entity.element.sprite) {
        size = Util.getSpriteFrame(this.entity.element.sprite);
      }
      else if (this.entity.element.spriteAsset) {
        let spriteAsset = AssetManager.assets.get(this.entity.element.spriteAsset);
        size = Util.getSpriteFrame(spriteAsset.resource);
      }
      else if (this.entity.element.texture) {
        size.width = this.entity.element.texture.width;
        size.height = this.entity.element.texture.height;
      }
      else if (this.entity.element.textureAsset) {
        let texture = AssetManager.assets.get(this.entity.element.textureAsset);
        size.width = texture.width;
        size.height = texture.height;
      }

    }
    else {
      size.width = this.naturalWidth;
      size.height = this.naturalHeight;
    }

    return size.width / size.height;
  },
});
