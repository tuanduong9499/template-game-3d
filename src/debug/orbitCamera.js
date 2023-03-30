/* eslint-disable max-depth */
/* eslint-disable no-unused-vars */
import { Script } from "../template/systems/script/script";

export const OrbitCamera = Script.createScript({
  name: "OrbitCamera",

  attributes: {
    distanceMax   : { default: 0 },
    distanceMin   : { default: 0 },
    pitchAngleMax : { default: 90 },
    pitchAngleMin : { default: -90 },
    inertiaFactor : { default: 0 },
    frameOnStar   : { default: true },
    focusEntity   : { default: null },
  },

  distanceBetween : new pc.Vec3(),
  quatWithoutYaw  : new pc.Quat(),
  yawOffset       : new pc.Quat(),
  _pivotPoint     : new pc.Vec3(),

  focus(focusEntity) {
    this._buildAabb(focusEntity, 0);

    var halfExtents = this._modelsAabb.halfExtents;

    var distance = Math.max(halfExtents.x, Math.max(halfExtents.y, halfExtents.z));
    distance /= Math.tan(0.5 * this.entity.camera.fov * math.DEG_TO_RAD);
    distance *= 2;

    this.distance = distance;

    this._removeInertia();

    this._pivotPoint.copy(this._modelsAabb.center);
  },

  resetAndLookAtPoint(resetPoint, lookAtPoint) {
    this.pivotPoint.copy(lookAtPoint);
    this.entity.setPosition(resetPoint);

    this.entity.lookAt(lookAtPoint);

    var distance = OrbitCamera.distanceBetween;
    distance.sub2(lookAtPoint, resetPoint);
    this.distance = distance.length();

    this.pivotPoint.copy(lookAtPoint);

    var cameraQuat = this.entity.getRotation();
    this.yaw = this._calcYaw(cameraQuat);
    this.pitch = this._calcPitch(cameraQuat, this.yaw);

    this._removeInertia();
    this._updatePosition();
  },

  resetAndLookAtEntity(resetPoint, entity) {
    this._buildAabb(entity, 0);
    this.resetAndLookAtPoint(resetPoint, this._modelsAabb.center);
  },

  reset(yaw, pitch, distance) {
    this.pitch = pitch;
    this.yaw = yaw;
    this.distance = distance;

    this._removeInertia();
  },

  initialize() {
    Object.defineProperty(this, "distance", {
      get: function() {
        return this._targetDistance;
      },

      set: function(value) {
        this._targetDistance = this._clampDistance(value);
      },
    });

    var self = this;
    var onWindowResize = function() {
      self._checkAspectRatio();
    };

    Object.defineProperty(this, "pitch", {
      get: function() {
        return this._targetPitch;
      },

      set: function(value) {
        this._targetPitch = this._clampPitchAngle(value);
      },
    });


    // Property to get and set the yaw of the camera around the pivot point (degrees)
    Object.defineProperty(this, "yaw", {
      get: function() {
        return this._targetYaw;
      },

      set: function(value) {
        this._targetYaw = value;

        // Ensure that the yaw takes the shortest route by making sure that
        // the difference between the targetYaw and the actual is 180 degrees
        // in either direction
        var diff = this._targetYaw - this._yaw;
        var reminder = diff % 360;
        if (reminder > 180) {
          this._targetYaw = this._yaw - (360 - reminder);
        }
        else if (reminder < -180) {
          this._targetYaw = this._yaw + (360 + reminder);
        }
        else {
          this._targetYaw = this._yaw + reminder;
        }
      },
    });


    // Property to get and set the world position of the pivot point that the camera orbits around
    Object.defineProperty(this, "pivotPoint", {
      get: function() {
        return this._pivotPoint;
      },

      set: function(value) {
        this._pivotPoint.copy(value);
      },
    });

    window.addEventListener("resize", onWindowResize, false);

    this._checkAspectRatio();

    // Find all the models in the scene that are under the focused entity
    this._modelsAabb = new pc.BoundingBox();
    this._buildAabb(this.focusEntity || this.app.root, 0);

    this.entity.lookAt(this._modelsAabb.center);

    this._pivotPoint = new pc.Vec3();
    this._pivotPoint.copy(this._modelsAabb.center);

    // Calculate the camera euler angle rotation around x and y axes
    // This allows us to place the camera at a particular rotation to begin with in the scene
    var cameraQuat = this.entity.getRotation();

    // Preset the camera
    this._yaw = this._calcYaw(cameraQuat);
    this._pitch = this._clampPitchAngle(this._calcPitch(cameraQuat, this._yaw));
    this.entity.setLocalEulerAngles(this._pitch, this._yaw, 0);

    this._distance = 0;

    this._targetYaw = this._yaw;
    this._targetPitch = this._pitch;

    // If we have ticked focus on start, then attempt to position the camera where it frames
    // the focused entity and move the pivot point to entity's position otherwise, set the distance
    // to be between the camera position in the scene and the pivot point
    if (this.frameOnStart) {
      this.focus(this.focusEntity || this.app.root);
    }
    else {
      var distanceBetween = new pc.Vec3();
      distanceBetween.sub2(this.entity.getPosition(), this._pivotPoint);
      this._distance = this._clampDistance(distanceBetween.length());
    }

    this._targetDistance = this._distance;

    // Reapply the clamps if they are changed in the editor
    this.on("attr:distanceMin", (value, prev) => {
      this._targetDistance = this._clampDistance(this._distance);
    });

    this.on("attr:distanceMax", (value, prev) => {
      this._targetDistance = this._clampDistance(this._distance);
    });

    this.on("attr:pitchAngleMin", (value, prev) => {
      this._targetPitch = this._clampPitchAngle(this._pitch);
    });

    this.on("attr:pitchAngleMax", (value, prev) => {
      this._targetPitch = this._clampPitchAngle(this._pitch);
    });

    // Focus on the entity if we change the focus entity
    this.on("attr:focusEntity", (value, prev) => {
      if (this.frameOnStart) {
        this.focus(value || this.app.root);
      }
      else {
        this.resetAndLookAtEntity(this.entity.getPosition(), value || this.app.root);
      }
    });

    this.on("attr:frameOnStart", (value, prev) => {
      if (value) {
        this.focus(this.focusEntity || this.app.root);
      }
    });

    this.on("destroy", function() {
      window.removeEventListener("resize", onWindowResize, false);
    });
  },

  update(dt) {
    // Add inertia, if any
    var t = this.inertiaFactor === 0 ? 1 : Math.min(dt / this.inertiaFactor, 1);
    this._distance = pc.math.lerp(this._distance, this._targetDistance, t);
    this._yaw = pc.math.lerp(this._yaw, this._targetYaw, t);
    this._pitch = pc.math.lerp(this._pitch, this._targetPitch, t);

    this._updatePosition();
  },

  _updatePosition() {
    // Work out the camera position based on the pivot point, pitch, yaw and distance
    this.entity.setLocalPosition(0, 0, 0);
    this.entity.setLocalEulerAngles(this._pitch, this._yaw, 0);

    var position = this.entity.getPosition();
    position.copy(this.entity.forward);
    position.scale(-this.distance);
    position.add(this.pivotPoint);
    this.entity.setPosition(position);
  },

  _removeInertia() {
    this._yaw = this._targetYaw;
    this._pitch = this._targetPitch;
    this._distance = this._targetDistance;
  },

  _checkAspectRatio() {
    var height = this.app.graphicsDevice.height;
    var width = this.app.graphicsDevice.width;

    // Match the axis of FOV to match the aspect ratio of the canvas so
    // the focused entities is always in frame
    this.entity.camera.horizontalFov = height > width;
  },

  _buildAabb(entity, modelsAdded) {
    var i = 0;
    var j = 0;
    var meshInstances;

    if (entity instanceof pc.Entity) {
      var allMeshInstances = [];
      var renders = entity.findComponents("render");

      for (i = 0; i < renders.length; ++i) {
        meshInstances = renders[i].meshInstances;
        for (j = 0; j < meshInstances.length; j++) {
          allMeshInstances.push(meshInstances[j]);
        }
      }

      var models = entity.findComponents("model");
      for (i = 0; i < models.length; ++i) {
        meshInstances = models[i].meshInstances;
        for (j = 0; j < meshInstances.length; j++) {
          allMeshInstances.push(meshInstances[j]);
        }
      }

      for (i = 0; i < allMeshInstances.length; i++) {
        if (modelsAdded === 0) {
          this._modelsAabb.copy(allMeshInstances[i].aabb);
        }
        else {
          this._modelsAabb.add(allMeshInstances[i].aabb);
        }

        modelsAdded += 1;
      }
    }

    for (i = 0; i < entity.children.length; ++i) {
      modelsAdded += this._buildAabb(entity.children[i], modelsAdded);
    }

    return modelsAdded;
  },

  _calcYaw(quat) {
    var transformedForward = new pc.Vec3();
    quat.transformVector(pc.Vec3.FORWARD, transformedForward);

    return Math.atan2(-transformedForward.x, -transformedForward.z) * pc.math.RAD_TO_DEG;
  },

  _clampDistance(distance) {
    if (this.distanceMax > 0) {
      return pc.math.clamp(distance, this.distanceMin, this.distanceMax);
    }
    else {
      return Math.max(distance, this.distanceMin);
    }
  },

  _clampPitchAngle(pitch) {
    // Negative due as the pitch is inversed since the camera is orbiting the entity
    return pc.math.clamp(pitch, -this.pitchAngleMax, -this.pitchAngleMin);
  },

  _calcPitch(quat, yaw) {
    var quatWithoutYaw = OrbitCamera.quatWithoutYaw;
    var yawOffset = OrbitCamera.yawOffset;

    yawOffset.setFromEulerAngles(0, -yaw, 0);
    quatWithoutYaw.mul2(yawOffset, quat);

    var transformedForward = new pc.Vec3();

    quatWithoutYaw.transformVector(pc.Vec3.FORWARD, transformedForward);

    return Math.atan2(transformedForward.y, -transformedForward.z) * pc.math.RAD_TO_DEG;
  },


});
