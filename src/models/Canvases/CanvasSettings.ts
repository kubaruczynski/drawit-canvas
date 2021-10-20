import { ColorSelectionCanvas } from "./ColorSelectionCanvas";
import { HueSelectionCanvas } from "./HueSelectionCanvas";

export class CanvasSettings {
  currentColor: string = "#C3C3C3";
  pencilWidth: number = 15;
  private colorDisplay: HTMLElement;
  private colorPicker: ColorSelectionCanvas;
  private huePicker: HueSelectionCanvas;
  private sizePicker: HTMLElement;
  colorInHex: string;
  colorInRGB: {r:number,g:number,b:number,a:number};

  constructor(mainAppHolder: HTMLElement) {
    const settingsHolder = document.createElement("div");
    settingsHolder.id = "settings-holder";
    mainAppHolder.appendChild(settingsHolder);

    const currentColorWrapper = document.createElement('div');
    currentColorWrapper.id = "current-color-wrapper";
    settingsHolder.appendChild(currentColorWrapper);

    const currentlySelectedColor = document.createElement("div");
    currentlySelectedColor.id = "current-color";
    currentlySelectedColor.style.background = this.currentColor;
    currentColorWrapper.appendChild(currentlySelectedColor);
    this.colorDisplay = currentlySelectedColor;

    const sizePicker = document.createElement("input");
    sizePicker.type = "range";
    sizePicker.min = "1";
    sizePicker.max="100";
    sizePicker.value = "15";
    sizePicker.oninput = this.changePencilSize;
    sizePicker.id = "pencil-size-picker";
    settingsHolder.appendChild(sizePicker);
    this.sizePicker = sizePicker;

    const colorSelectionWrapper = document.createElement("div");
    colorSelectionWrapper.id = "color-selection-wrapper";
    settingsHolder.appendChild(colorSelectionWrapper);

    const hueSelectionWrapper = document.createElement("div");
    hueSelectionWrapper.id = "hue-selection-wrapper";
    settingsHolder.appendChild(hueSelectionWrapper);

    this.colorPicker = new ColorSelectionCanvas(
      colorSelectionWrapper,
      this.changeCurrentlySelectedColor,
    );
    this.huePicker = new HueSelectionCanvas(
      hueSelectionWrapper,
      this.colorPicker.setNewHue
    );
    this.changeCurrentlySelectedColor("#000000",
        {r:255,g:0,b:0,a:1});
    this.changePencilSize({target: {value: "15"}})
  }

  changeCurrentlySelectedColor = (color: string, rgb: {r:number,g:number,b:number,a:number}) => {
    this.currentColor = color;
    this.colorInRGB = rgb;
    this.colorDisplay.style.background = color;
  };

  //TODO: change this type to proper one
  changePencilSize = (size: any) => {
    this.pencilWidth = Number(size.target.value/1000);
    this.colorDisplay.style.width = this.pencilWidth + "px";
    this.colorDisplay.style.height = this.pencilWidth + "px";
  }
}
