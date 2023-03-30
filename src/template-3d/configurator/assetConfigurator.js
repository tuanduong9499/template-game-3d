import {
  ADDRESS_REPEAT,
  FILTER_NEAREST,
  SPRITE_RENDERMODE_SLICED,
  StandardMaterial,
  Vec4,
} from "playcanvas";

import { Util } from "../../helpers/util";
import { AssetManager } from "../../template/assetManager";

export class AssetConfigurator {
  static config() {
    this._configContainer();
    this._configStack();
    this._configSprites();
  }

  static _configContainer() {
    let matBase = new StandardMaterial();
    matBase.diffuse = Util.createColor(149, 156, 165);
    this.setModelMaterial("model_container_base", matBase);

    let matStick = new StandardMaterial();
    matStick.diffuse = Util.createColor(141, 141, 141);
    this.setModelMaterial("model_container_stick", matStick);
  }

  static _configStack() {
    let blueDiffuse = Util.createColor(0, 115, 255);
    let matBlue = this.createColorMaterial(blueDiffuse);
    AssetManager.registerAsset(matBlue, "mat_stack_blue", "material");

    let blackDiffuse = Util.createColor(100, 100, 100);
    let matBlack = this.createColorMaterial(blackDiffuse);
    AssetManager.registerAsset(matBlack, "mat_stack_black", "material");

    let greenDiffuse = Util.createColor(120, 230, 0);
    let matGreen = this.createColorMaterial(greenDiffuse);
    AssetManager.registerAsset(matGreen, "mat_stack_green", "material");

    let redDiffuse = Util.createColor(200, 3, 0);
    let matRed = this.createColorMaterial(redDiffuse);
    AssetManager.registerAsset(matRed, "mat_stack_red", "material");

    let purpleDiffuse = Util.createColor(140, 0, 255);
    let matPurple = this.createColorMaterial(purpleDiffuse);
    AssetManager.registerAsset(matPurple, "mat_stack_purple", "material");

    let pinkDiffuse = Util.createColor(255, 130, 141);
    let matPink = this.createColorMaterial(pinkDiffuse);
    AssetManager.registerAsset(matPink, "mat_stack_pink", "material");
  }

  static _configSprites() {
  }

  /**
   * @param {pc.Texture} texture
   */
  static setTextureFiltering(texture, filter = FILTER_NEAREST, address = ADDRESS_REPEAT) {
    texture.minFilter = filter;
    texture.magFilter = filter;
    texture.addressU = address;
    texture.addressV = address;
  }

  static setSpriteSlice(spriteAsset, border = new Vec4(), pixelsPerUnit = 1) {
    let asset = AssetManager.find(spriteAsset);
    asset.resource.renderMode = SPRITE_RENDERMODE_SLICED;
    this.setSpriteBorder(asset, border.x, border.y, border.z, border.w);
    this.setSpritePixelsPerUnit(spriteAsset, pixelsPerUnit);
  }

  static setSpriteBorder(spriteAsset, left = 0, bottom = 0, right = 0, top = 0) {
    let sprite = AssetManager.find(spriteAsset).resource;
    sprite.atlas.frames[sprite.frameKeys[0]].border.set(left, bottom, right, top);
  }

  static setSpritePixelsPerUnit(spriteAsset, pixelsPerUnit = 100) {
    let sprite = AssetManager.find(spriteAsset).resource;
    sprite.pixelsPerUnit = pixelsPerUnit;
  }

  static setModelTexture(modelAsset, textureAsset, index = 0) {
    let material = this.getMaterial(modelAsset, index);
    let texture = AssetManager.find(textureAsset);
    material.diffuseMap = texture.resource;
  }

  static setModelDiffuse(modelAsset, color, index = 0) {
    let material = this.getMaterial(modelAsset, index);
    material.diffuse.copy(color);
    material.diffuseTint = true;
  }

  static setModelMaterial(modelAsset, material, index = 0) {
    let model = AssetManager.find(modelAsset).resource;
    model.meshInstances[index].material = material;
  }

  static setModelMaterialInRange(modelAsset, material, startIndex, endIndex) {
    for (var i = startIndex; i <= endIndex; i++) {
      this.setModelMaterial(modelAsset, material, i);
    }
  }

  static setModelMaterialWithIndexes(modelAsset, material, indexes = []) {
    indexes.forEach((index) => {
      this.setModelMaterial(modelAsset, material, index);
    });
  }

  static createColorMaterial(r = 255, g = 255, b = 255, a = 1) {
    let material = new StandardMaterial();
    if (typeof r === "object") {
      material.diffuse = r;
    }
    else {
      material.diffuse = Util.createColor(r, g, b, a);
    }
    return material;
  }

  /**
   * @param {string} modelName
   * @returns {pc.StandardMaterial}
   */
  static getMaterial(modelName, index = 0) {
    let model = AssetManager.find(modelName);
    let material = model.resource.meshInstances[index].material;

    if (material.id === 1) { // default material
      material = new StandardMaterial();
      model.resource.meshInstances[index].material = material;
    }

    return material;
  }
}
