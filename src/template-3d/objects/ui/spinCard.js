import { ELEMENTTYPE_GROUP, Entity } from "playcanvas";
import { ObjectFactory } from "../../../template/objects/objectFactory";

export class SpinCard extends Entity {
  constructor() {
    super("spinCard");
    this.addComponent("element", { type: ELEMENTTYPE_GROUP });

    this.layerLocked = ObjectFactory.createImageElement("spr_spin_card_blue");
    this.addChild(this.layerLocked);

    this.layerSelected = ObjectFactory.createImageElement("spr_spin_card_yellow");
    this.addChild(this.layerSelected);

    this.layerUnlocked = ObjectFactory.createImageElement("spr_spin_card_unlocked");
    this.addChild(this.layerUnlocked);

    this.lock();
  }

  lock() {
    this.layerLocked.enabled = true;
    this.layerSelected.enabled = false;
    this.layerUnlocked.enabled = false;
  }

  select() {
    this.layerLocked.enabled = false;
    this.layerSelected.enabled = true;
    this.layerUnlocked.enabled = false;
  }

  unlock() {
    this.layerLocked.enabled = false;
    this.layerSelected.enabled = false;
    this.layerUnlocked.enabled = true;
  }
}
