import { Canvas } from "./Canvas";

export class ColorSelectionCanvas extends Canvas {
  private selectedColor: string = "rgba(255,0,0,1)";
  private drawingColor: string = "rgba(255,0,0,1)";
  private selectedColorAsRGBAObject: {
    r: number;
    g: number;
    b: number;
    a: number;
  } = { r: 255, g: 0, b: 0, a: 1 };
  /*private selectedColorAsHSLAObject: {
    h: number;
    s: number;
    l: number;
    a: number;
  };*/
  private isDragging: boolean = false;
  private onColorSelect: (color: string) => any;

  constructor(
    canvasHolder: HTMLElement,
    onColorSelect: (color: string) => any,
    width?: number,
    height?: number
  ) {
    super(canvasHolder,'color-selection-canvas',1, width, height);
    this.onColorSelect = onColorSelect;
    this.canvasNode.addEventListener("click", this.changeColor);
    this.canvasNode.addEventListener("mousedown", e => {
      this.isDragging = true;
      this.changeColor(e);
    });
    this.canvasNode.addEventListener("mouseup", e => {
      this.isDragging = false;
    });
    this.canvasNode.addEventListener("mousemove", e => {
      if (this.isDragging) {
        this.changeColor(e);
      }
    });
    this.draw();
  }

  rgbatohsla = (r:number, g:number, b:number, a:number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;
    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    //return "hsla(" + h + "," + s + "%," +l + "%," + a + ")";
    return { h, s, l, a };
  };

  hslatorgba = (h:number,s:number,l:number, a:number) => {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return {r,g,b,a};
  };

  setNewHue = (hue: number) => {
    const hsla = this.rgbatohsla(
      this.selectedColorAsRGBAObject.r,
      this.selectedColorAsRGBAObject.g,
      this.selectedColorAsRGBAObject.b,
      this.selectedColorAsRGBAObject.a
    );
    const rgbaSelected = this.hslatorgba(hue,100,50,hsla.a);
    const rgbaDrawing = this.hslatorgba(hue,hsla.s,hsla.l,hsla.a);
    this.selectedColor = "rgba(" + rgbaSelected.r + "," + rgbaSelected.g + "," + rgbaSelected.b + "," + rgbaSelected.a + ")";
    this.drawingColor = "rgba(" + rgbaDrawing.r + "," + rgbaDrawing.g + "," + rgbaDrawing.b + "," + rgbaDrawing.a + ")";
    this.selectedColorAsRGBAObject = rgbaDrawing;
    this.onColorSelect(this.drawingColor);
    this.draw();
  };

  changeColor = (e: MouseEvent) => {
    const x = e.offsetX;
    const y = e.offsetY;
    const imageData = this.canvasContext!.getImageData(x, y, 1, 1).data;
    this.drawingColor =
      "rgba(" + imageData[0] + "," + imageData[1] + "," + imageData[2] + ",1)";
    this.selectedColorAsRGBAObject = {
      r: imageData[0],
      g: imageData[1],
      b: imageData[2],
      a: imageData[3]
    };
    this.onColorSelect(this.drawingColor);
  };

  drawGradientsOnColorSelectionCanvas = () => {
    const grdWhite = this.canvasContext!.createLinearGradient(
      0,
      0,
      this.canvasNode.width,
      0
    );
    grdWhite.addColorStop(0, "rgba(255,255,255,1)");
    grdWhite.addColorStop(1, "rgba(255,255,255,0)");
    this.canvasContext!.fillStyle = grdWhite;
    this.canvasContext!.fillRect(
      0,
      0,
      this.canvasNode.width,
      this.canvasNode.height
    );

    const grdBlack = this.canvasContext!.createLinearGradient(
      0,
      0,
      0,
      this.canvasNode.height
    );
    grdBlack.addColorStop(0, "rgba(0,0,0,0)");
    grdBlack.addColorStop(1, "rgba(0,0,0,1)");
    this.canvasContext!.fillStyle = grdBlack;
    this.canvasContext!.fillRect(
      0,
      0,
      this.canvasNode.width,
      this.canvasNode.height
    );
  };

  draw = () => {
    this.canvasContext!.fillStyle = this.selectedColor;
    this.canvasContext!.fillRect(
      0,
      0,
      this.canvasNode.width,
      this.canvasNode.height
    );
    this.drawGradientsOnColorSelectionCanvas();
  };
}
