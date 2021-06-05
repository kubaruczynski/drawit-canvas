import { Canvas } from "./Canvas";

export class HueSelectionCanvas extends Canvas {
    private selectedHue: string = "rgba(0,0,0,1)";
    private isDragging: boolean = false;
    private onHueSelect: (hue:number) => any;

    constructor(
        canvasHolder: HTMLElement,
        onHueSelect: (hue: number) => any,
        width?: number,
        height?: number
    ) {
        super(canvasHolder,'hue-selection-canvas',1, width, height);
        this.onHueSelect = onHueSelect;
        this.canvasNode.addEventListener("click", this.changeHue);
        this.canvasNode.addEventListener("mousedown", e => {
            this.isDragging = true;
            this.changeHue(e);
        });
        this.canvasNode.addEventListener("mouseup", e => {
            this.isDragging = false;
        });
        this.canvasNode.addEventListener("mousemove", e => {
            if (this.isDragging) {
                this.changeHue(e);
            }
        });
        this.draw();
    }

    changeHue = (e: MouseEvent) => {
        const x = e.offsetX;
        const y = e.offsetY;
        const imageData = this.canvasContext!.getImageData(x, y, 1, 1).data;
        const hue = this.getHueFromRGB(imageData[0],imageData[1],imageData[2]);
        this.onHueSelect(hue);
    };

    getHueFromRGB = (r:number, g:number, b:number) => {
        r /= 255;
        g /= 255;
        b /= 255;
        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0
        if (delta == 0) h = 0;
        else if (cmax == r) h = ((g - b) / delta) % 6;
        else if (cmax == g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;
        h = Math.round(h * 60);
        if (h < 0) h += 360;
        return h
    };

    draw = () => {
        this.canvasContext!.rect(
            0,
            0,
            this.canvasNode.width,
            this.canvasNode.height
        );
        const grd1 = this.canvasContext!.createLinearGradient(
            0,
            0,
            0,
            this.canvasNode.height
        );
        grd1.addColorStop(0, "rgba(255, 0, 0, 1)");
        grd1.addColorStop(0.17, "rgba(255, 255, 0, 1)");
        grd1.addColorStop(0.34, "rgba(0, 255, 0, 1)");
        grd1.addColorStop(0.51, "rgba(0, 255, 255, 1)");
        grd1.addColorStop(0.68, "rgba(0, 0, 255, 1)");
        grd1.addColorStop(0.85, "rgba(255, 0, 255, 1)");
        grd1.addColorStop(1, "rgba(255, 0, 0, 1)");
        this.canvasContext!.fillStyle = grd1;
        this.canvasContext!.fill();
    };
}
