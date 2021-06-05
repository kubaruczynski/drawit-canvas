import { Canvas } from "./Canvas";
import {CanvasSettings} from "./CanvasSettings";

export class CanvasBackground extends Canvas {
  //private currentSetting: number;

  constructor(mainAppHolder: HTMLElement,sizeMultiplier:number) {
    super(mainAppHolder, "background-canvas",sizeMultiplier);
  }

  draw = () => {
    const w = this.canvasNode.width;
    const h = this.canvasNode.height;

    this.canvasContext!.fillStyle = "white";
    this.canvasContext!.fillRect(0, 0, w, h);
    const ctx = this.canvasContext;
    ctx!.translate(0.5, 0.5);
    ctx!.beginPath();

    const gridSpacing = 40;
    const gridSpacingBigger = 5*gridSpacing;

    for (let x = w/2,i=x; x <= w; x += gridSpacing,i-=gridSpacing) {
      for (let y = h/2,j=y; y <= h; y += gridSpacing,j-=gridSpacing) {
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, h);
        ctx!.moveTo(i, 0);
        ctx!.lineTo(i, h);
        ctx!.moveTo(0, y);
        ctx!.lineTo(w, y);
        ctx!.moveTo(0, j);
        ctx!.lineTo(w, j);
      }
    }
    ctx!.lineWidth = 1;
    ctx!.strokeStyle = 'rgb(189,189,189)';
    ctx!.stroke();
    ctx!.beginPath();
    ctx!.translate(0.5, 0.5);
    ctx!.lineWidth = 2;
    ctx!.strokeStyle = 'rgb(170,170,170)';

    for (let x = w/2,i=x; x <= w; x += gridSpacingBigger,i-=gridSpacingBigger) {
      for (let y = h/2,j=y; y <= h; y += gridSpacingBigger,j-=gridSpacingBigger) {
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, h);
        ctx!.moveTo(i, 0);
        ctx!.lineTo(i, h);
        ctx!.moveTo(0, y);
        ctx!.lineTo(w, y);
        ctx!.moveTo(0, j);
        ctx!.lineTo(w, j);
      }
    }
    ctx!.stroke();
  };

  resizeBackgroundHandle = () =>{
    this.resizeHandle();
    this.draw();
  }
}
