import { Game } from "../game";
import { Script } from "../template/systems/script/script";

export const MouseOrbitCamera = Script.createScript({
  name: "MouseOrbitCamera",

  attributes: {
    orbitSensitivity    : { default: 0.3 },
    distanceSensitivity : { default: 0.15 },
  },

  initialize() {
    this.orbitCamera = this.entity.script.OrbitCamera;
    if (this.orbitCamera) {
      var self = this;

      var onMouseOut = (e) => {
        self.onMouseOut(e);
      };

      Game.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
      Game.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
      Game.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
      Game.app.mouse.on(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this);

      // Listen to when the mouse travels out of the window
      window.addEventListener("mouseout", onMouseOut, false);

      // Remove the listeners so if this entity is destroyed
      this.on("destroy", () => {
        Game.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        Game.app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp, this);
        Game.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        Game.app.mouse.off(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this);

        window.removeEventListener("mouseout", onMouseOut, false);
      });
    }

    // Disabling the context menu stops the browser displaying a menu when
    // you right-click the page
    Game.app.mouse.disableContextMenu();

    this.lookButtonDown = false;
    this.panButtonDown = false;
    this.lastPoint = new pc.Vec2();
  },


  fromWorldPoint : new pc.Vec3(),
  toWorldPoint   : new pc.Vec3(),
  worldDiff      : new pc.Vec3(),


  pan(screenPoint) {
    var fromWorldPoint = this.fromWorldPoint;
    var toWorldPoint = this.toWorldPoint;
    var worldDiff = this.worldDiff;

    // For panning to work at any zoom level, we use screen point to world projection
    // to work out how far we need to pan the pivotEntity in world space
    var camera = this.entity.camera;
    var distance = this.orbitCamera.distance;

    camera.screenToWorld(screenPoint.x, screenPoint.y, distance, fromWorldPoint);
    camera.screenToWorld(this.lastPoint.x, this.lastPoint.y, distance, toWorldPoint);

    worldDiff.sub2(toWorldPoint, fromWorldPoint);

    this.orbitCamera.pivotPoint.add(worldDiff);
  },


  onMouseDown(event) {
    switch (event.button) {
    case pc.MOUSEBUTTON_LEFT:
      this.lookButtonDown = true;
      break;

    case pc.MOUSEBUTTON_MIDDLE:
    case pc.MOUSEBUTTON_RIGHT:
      this.panButtonDown = true;
      break;
    default: break;
    }
  },


  onMouseUp(event) {
    switch (event.button) {
    case pc.MOUSEBUTTON_LEFT:
      this.lookButtonDown = false;
      break;

    case pc.MOUSEBUTTON_MIDDLE:
    case pc.MOUSEBUTTON_RIGHT:
      this.panButtonDown = false;
      break;
    default: break;
    }
  },


  onMouseMove(event) {
    if (this.lookButtonDown) {
      this.orbitCamera.pitch -= event.dy * this.orbitSensitivity;
      this.orbitCamera.yaw -= event.dx * this.orbitSensitivity;

    }
    else if (this.panButtonDown) {
      this.pan(event);
    }

    this.lastPoint.set(event.x, event.y);
  },


  onMouseWheel(event) {
    this.orbitCamera.distance -= event.wheel * this.distanceSensitivity * (this.orbitCamera.distance * 0.1);
    console.log(this.orbitCamera.distance);
    event.event.preventDefault();
  },


  onMouseOut() {
    this.lookButtonDown = false;
    this.panButtonDown = false;
  },

});
