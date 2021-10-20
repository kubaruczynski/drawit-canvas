export abstract class Canvas {
  private enabled: boolean = true;
  private canvasHolder: HTMLElement;
  protected canvasNode: HTMLCanvasElement;
  protected canvasContext: CanvasRenderingContext2D | null;
  private sizeMultiplier: number;

  private createCanvas = (width: number, height: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  };

  constructor(
    canvasHolder: HTMLElement,
    id: string,
    sizeMultiplier: number,
    width?: number,
    height?: number
  ) {
    this.sizeMultiplier = sizeMultiplier;
    this.canvasHolder = canvasHolder;
    const canvas = this.createCanvas(
      width
        ? width
        : canvasHolder.clientWidth * (sizeMultiplier ? sizeMultiplier : 1),
      height
        ? height
        : canvasHolder.clientHeight * (sizeMultiplier ? sizeMultiplier : 1)
    );
    canvas.id = id;
    this.canvasNode = canvasHolder.appendChild(canvas);
    this.canvasContext = this.canvasNode.getContext("2d");
  }

  resizeHandle = () => {
    const currentImage = this.canvasContext!.getImageData(
      0,
      0,
      this.canvasNode.width,
      this.canvasNode.height
    );
    this.canvasNode.width = this.canvasHolder.clientWidth * (this.sizeMultiplier ? this.sizeMultiplier : 1);
    this.canvasNode.height = this.canvasHolder.clientHeight * (this.sizeMultiplier ? this.sizeMultiplier : 1);

    this.canvasContext!.putImageData(currentImage,0,0);
  };

  abstract draw() : void;

  clear = () => {
    this.canvasContext!.fillStyle = "rgba(0,0,0,0)";
    this.canvasContext!.fillRect(
      0,
      0,
      this.canvasNode.width,
      this.canvasNode.height
    );
  };
}
