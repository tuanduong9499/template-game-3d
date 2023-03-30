import { Curve, CurveSet, Entity } from "playcanvas";
import { AssetManager } from "../../../template/assetManager";

export class ConfettiEffect extends Entity {
  constructor() {
    super("fx_confetti");

    this._initParticle();
  }

  _initParticle() {
    this.particle = new Entity("fx_confetti_particle");
    this.addChild(this.particle);

    let texture = AssetManager.find("tex_confetti").resource;

    let localVelocityGraph = new CurveSet([
      [0, 0.7, 0.5, 0.5, 1, 0],
      [0, 8, 0.3, 0, 0.5, -3, 1, -4],
      [0, 0.7, 0.5, 0.5, 1, 0],
    ]);

    let localVelocityGraph2 = new CurveSet([
      [0, -0.7, 0.5, -0.5, 1, 0],
      [0, 6, 0.3, 0, 0.5, -2, 1, -3],
      [0, -0.7, 0.5, -0.5, 1, 0],
    ]);

    let scaleGraph = new Curve([0, 0.08]);
    let scaleGraph2 = new Curve([0, 0.1]);
    let alphaGraph = new Curve([0, 0.8, 0.5, 0.8, 1, 0]);
    let rotationSpeedGraph = new Curve([0, 720]);
    let rotationSpeedGraph2 = new Curve([0, -720]);

    this.particle.addComponent("particlesystem", {
      autoPlay           : false,
      loop               : false,
      lifetime           : 2,
      numParticles       : 14,
      rate               : 0.05,
      colorMap           : texture,
      animNumAnimations  : 4,
      animNumFrames      : 1,
      randomizeAnimIndex : true,
      animLoop           : true,
      animTilesX         : 4,
      animTilesY         : 1,
      animSpeed          : 1,
      startAngle         : 0,
      startAngle2        : 360,
      scaleGraph,
      scaleGraph2,
      localVelocityGraph,
      localVelocityGraph2,
      alphaGraph,
      rotationSpeedGraph,
      rotationSpeedGraph2,
    });
  }

  play() {
    this.particle.particlesystem.play();
  }
}
