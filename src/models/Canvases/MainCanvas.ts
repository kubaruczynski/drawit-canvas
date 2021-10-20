import { Canvas } from "./Canvas";
import {CanvasSettings} from "./CanvasSettings";
import {WebGLCanvas} from "./WebGLCanvas";

export class MainCanvas extends WebGLCanvas {
  private isDrawing: boolean = false;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private settings: CanvasSettings;

  constructor(canvasHolder: HTMLElement,settings: CanvasSettings,sizeMultiplier?:number, width?: number, height?: number) {
    super(canvasHolder,'main-canvas',sizeMultiplier, width, height);
    this.settings = settings;
    super.updateSettings(this.settings)
    this.canvasNode.addEventListener("mousedown",this.startDrawing);
    this.canvasNode.addEventListener("mouseup",this.stopDrawing);
    this.canvasNode.addEventListener("mousemove",this.doDrawing);

    this.canvasNode.addEventListener("touchstart",this.startDrawing);
    this.canvasNode.addEventListener("touchend",this.stopDrawing);
    this.canvasNode.addEventListener("touchmove",this.doDrawing);


    requestAnimationFrame(()=>this.draw());
  }

  componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  rgbToHex(r, g, b) {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }

  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  startDrawing = (e: any) => {
    this.isDrawing = true;
    this.mouseX = e.offsetX;
    this.mouseY = e.offsetY;
    super.updateSettings(this.settings)
  };

  stopDrawing = () =>{
    this.isDrawing = false;
  };

  doDrawing = (e: any) =>{
        this.drawCursor(e);
  };

  /*draw = e => {
    const x = e.offsetX;
    const y = e.offsetY;
    if (e.buttons !== 1) return;

    this.canvasContext.beginPath(); // begin

    this.canvasContext.lineWidth = this.settings.pencilWidth;
    this.canvasContext.lineCap = "round";
    this.canvasContext.strokeStyle = this.settings.currentColor;

    this.canvasContext.moveTo(this.mouseX, this.mouseY); // from
    this.canvasContext.lineTo(x, y); // to
    this.mouseX = x;
    this.mouseY = y;

    this.canvasContext.stroke(); // draw it!
  };*/
}
