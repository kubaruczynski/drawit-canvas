import {RGBA} from "../Types/Rgba";

export class CanvasSettings {
    private _pencilWidth: number = 0.005;
    private _colorInRGB: RGBA = {r: 0, g: 0, b: 0, a: 1};
    private _spring: number = 0.05;
    private _friction: number = 0.92;
    private _time: number = 0.6;

    public get pencilWidth() {
        return this._pencilWidth
    };

    public get colorInRGB() {
        return this._colorInRGB
    };

    public get spring() {
        return this._spring
    };

    public get friction() {
        return this._friction
    };

    public get time() {
        return this._time
    };

    constructor() {
    }

    public set colorInRGB(rgba: RGBA) {
        this._colorInRGB = {
            r: rgba.r / 255,
            g: rgba.g / 255,
            b: rgba.b / 255,
            a: rgba.a / 255,
        };
    };

    public set pencilWidth(size: number) {
        this._pencilWidth = Number(size / 1000);
    }

    public set spring(spring: number) {
        this._spring = Number(spring/100);
    }

    public set friction(friction: number) {
        this._friction = Number(friction/100);
    }

    public set time(time: number) {
        this._time = time;
    }
}
