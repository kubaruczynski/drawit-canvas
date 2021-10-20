import { ColorSelectionCanvas } from "./ColorSelectionCanvas";
import { HueSelectionCanvas } from "./HueSelectionCanvas";
import {RGBA} from "../Types/Rgba";
import {CanvasSettings} from "../Canvases/CanvasSettings";

export class CanvasSettingsBox {
  currentColor: string = "#C3C3C3";
  private colorDisplay: HTMLElement;
  private colorPicker: ColorSelectionCanvas;
  private huePicker: HueSelectionCanvas;
  private sizePicker: HTMLElement;
  colorInHex: string;
  private settings: CanvasSettings;

  constructor(mainAppHolder: HTMLElement, canvasSettings: CanvasSettings) {
    this.settings = canvasSettings;

    const settingsHolder = document.createElement("div");
    settingsHolder.id = "settings-holder";
    mainAppHolder.appendChild(settingsHolder);



    const slidersHolder = document.createElement("div");
    slidersHolder.id = "sliders-holder";
    settingsHolder.appendChild(slidersHolder);

    const sizePicker = document.createElement("input");
    sizePicker.type = "range";
    sizePicker.min = "1";
    sizePicker.max="100";
    sizePicker.value = "10";
    sizePicker.oninput = (e:Event) => {
      this.settings.pencilWidth = Number((e.target as HTMLInputElement).value);
    }
    sizePicker.id = "pencil-size-picker";
    slidersHolder.appendChild(sizePicker);
    this.sizePicker = sizePicker;

    const springPicker = document.createElement("input");
    springPicker.type = "range";
    springPicker.min = "1";
    springPicker.max="10";
    springPicker.value = "5";
    springPicker.oninput = (e:Event) => {
      this.settings.spring = Number((e.target as HTMLInputElement).value);
    }
    springPicker.id = "pencil-size-picker";
    slidersHolder.appendChild(springPicker);


    const frictionPicker = document.createElement("input");
    frictionPicker.type = "range";
    frictionPicker.min = "90";
    frictionPicker.max="100";
    frictionPicker.value = "92";
    frictionPicker.oninput = (e:Event) => {
      this.settings.friction = Number((e.target as HTMLInputElement).value);
    }
    frictionPicker.id = "pencil-size-picker";
    slidersHolder.appendChild(frictionPicker);

    const colorSelectionWrapper = document.createElement("div");
    colorSelectionWrapper.id = "color-selection-wrapper";
    settingsHolder.appendChild(colorSelectionWrapper);

    const hueSelectionWrapper = document.createElement("div");
    hueSelectionWrapper.id = "hue-selection-wrapper";
    settingsHolder.appendChild(hueSelectionWrapper);

    this.colorPicker = new ColorSelectionCanvas(
      colorSelectionWrapper,
        (color)=>{
        this.settings.colorInRGB = color
        },
    );
    this.huePicker = new HueSelectionCanvas(
      hueSelectionWrapper,
      this.colorPicker.setNewHue
    );
    this.settings.pencilWidth
  }

}
