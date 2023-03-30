import { Game } from "../game";
import { Script } from "../template/systems/script/script";

export const KeyboardOrbitCamera = Script.createScript({
  name: "KeyboardOrbitCamera",

  initialize() {
    this.orbitCamera = this.entity.script.OrbitCamera;
  },

  postInitialize() {
    if (this.orbitCamera) {
      this.startDistance = this.orbitCamera.distance;
      this.startYaw = this.orbitCamera.yaw;
      this.startPitch = this.orbitCamera.pitch;
      this.startPivotPosition = this.orbitCamera.pivotPoint.clone();
    }
  },

  update(dt) {
    if (this.orbitCamera) {
      if (Game.app.keyboard.wasPressed(pc.KEY_SPACE)) {
        this.orbitCamera.reset(this.startYaw, this.startPitch, this.startDistance);
        this.orbitCamera.pivotPoint = this.startPivotPosition;
      }
    }

    const keyboard = Game.app.keyboard;
    const forward = keyboard.isPressed(pc.KEY_W) || keyboard.isPressed(pc.KEY_UP);
    const backward = keyboard.isPressed(pc.KEY_S) || keyboard.isPressed(pc.KEY_DOWN);
    const left = keyboard.isPressed(pc.KEY_A) || keyboard.isPressed(pc.KEY_LEFT);
    const right = keyboard.isPressed(pc.KEY_D) || keyboard.isPressed(pc.KEY_RIGHT);

    const speed = 3;

    let xOffset = 0;
    if (forward) {
      xOffset += speed * dt;
    }
    if (backward) {
      xOffset -= speed * dt;
    }

    let zOffset = 0;
    if (left) {
      zOffset -= speed * dt;
    }
    if (right) {
      zOffset += speed * dt;
    }

    this.orbitCamera.pivotPoint.x += xOffset;
    this.orbitCamera.pivotPoint.z += zOffset;
  },

});
