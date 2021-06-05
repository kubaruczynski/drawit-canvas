import {MainCanvas} from "./models/Canvases/MainCanvas";
import {CanvasSettings} from "./models/Canvases/CanvasSettings";
import {CanvasBackground} from "./models/Canvases/CanvasBackground";

export class DrawitCanvas {
  private mainCanvas: MainCanvas;
  private mainAppHolder: HTMLElement;
  private canvasSettings: CanvasSettings;
  private canvasBackground: CanvasBackground;

  constructor(mainAppHolder: HTMLElement) {
    this.mainAppHolder = mainAppHolder;
    this.canvasSettings = new CanvasSettings(mainAppHolder);
    this.canvasBackground = new CanvasBackground(mainAppHolder,0.95);
    this.canvasBackground.draw();
    this.mainCanvas = new MainCanvas(mainAppHolder, this.canvasSettings,0.95);
    window.onresize = () =>{
      this.mainCanvas.resizeHandle();
      this.canvasBackground.resizeBackgroundHandle();
    }
  }
}
