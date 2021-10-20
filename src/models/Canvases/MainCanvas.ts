import {CanvasSettingsBox} from "../Settings/CanvasSettingsBox";
import {WebGLCanvas} from "./WebGLCanvas";
import {CanvasSettings} from "./CanvasSettings";
import {Vec3} from "../Vectors/Vec3";
import {Polyline} from "../Objects/Polyline";

export class MainCanvas extends WebGLCanvas {
  private mouse: Vec3 = new Vec3();
  private tmp = new Vec3();
  private mouseVelocity: Vec3 = new Vec3();

  constructor(canvasHolder: HTMLElement, settings: CanvasSettings, sizeMultiplier?:number, width?: number, height?: number) {
    super(canvasHolder,'main-canvas',settings,sizeMultiplier, width, height);
    canvasHolder.addEventListener("mousemove",this.drawCursor);
    canvasHolder.addEventListener("touchmove",this.drawCursor);
    this.draw()
  }

  private drawCursor = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    this.mouse.x = (x/this.canvasNode.width)*2 -1;
    this.mouse.y = (y/this.canvasNode.height)*-2+1;
  };


  draw() {
    this.updateBuffersAndDraw();
    for (let i = this.polyline.points.length - 1; i >= 0; i--) {
      if (!i) {
        this.tmp = this.mouse.copy();
        this.tmp = this.tmp.sub(this.polyline.points[i]);
        this.tmp = this.tmp.scale(this.canvasSettings.spring);
        this.mouseVelocity = this.mouseVelocity.add(this.tmp);
        this.mouseVelocity = this.mouseVelocity.scale(this.canvasSettings.friction);
        this.polyline.points[i] = this.polyline.points[i].add(this.mouseVelocity);
      } else {
        this.polyline.points[i].lerp(this.polyline.points[i - 1], this.canvasSettings.time);
      }
    }

    this.polyline.updateGeometry();

    requestAnimationFrame(()=>this.draw());
  }

}
