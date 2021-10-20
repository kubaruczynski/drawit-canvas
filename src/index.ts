import {MainCanvas} from "./models/Canvases/MainCanvas";
import {CanvasSettingsBox} from "./models/Settings/CanvasSettingsBox";
import {CanvasBackground} from "./models/Canvases/CanvasBackground";
import {CanvasSettings} from "./models/Canvases/CanvasSettings";

export class DrawitCanvas {

  public mainCanvas: MainCanvas;

  private mainAppHolder: HTMLElement;
  private canvasSettings: CanvasSettings;
  private canvasSettingsBox: CanvasSettingsBox;
  private canvasBackground: CanvasBackground;

  constructor(mainAppHolder: HTMLElement) {
    this.mainAppHolder = mainAppHolder;
    //this.canvasBackground = new CanvasBackground(mainAppHolder,0.95);
    this.canvasSettings=new CanvasSettings();
    this.canvasSettingsBox = new CanvasSettingsBox(mainAppHolder, this.canvasSettings);
    //this.canvasBackground.draw();
    this.mainCanvas = new MainCanvas(mainAppHolder, this.canvasSettings,1);
    window.onresize = () =>{
      this.mainCanvas.resizeHandle();
      //this.canvasBackground.resizeBackgroundHandle();
    }
  }
}
