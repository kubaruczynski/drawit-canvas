// @ts-ignore
import vert from '../../shaders/vert.glsl';
// @ts-ignore
import frag from '../../shaders/frag.glsl';
import {createProgram, createShader} from "../../shaders/shaderUtils";
import {Vec3} from "../Vectors/Vec3";
import {Polyline} from "../Objects/Polyline";
import {CanvasSettings} from "./CanvasSettings";

export abstract class WebGLCanvas {
  protected canvasHolder: HTMLElement;
  protected canvasNode: HTMLCanvasElement;
  protected canvasContext: WebGLRenderingContext;
  private sizeMultiplier: number;
  private vertexShader: WebGLShader;
  private fragmentShader: WebGLShader;
  private webGLProgram: WebGLProgram;
  protected canvasSettings: CanvasSettings;


  private prev_positionBuffer;
  private next_positionBuffer;
  private positionBuffer;
  private sideBuffer;
  private uvBuffer;

  protected polyline: Polyline;


  private createCanvas = (width: number, height: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  };

  constructor(
    canvasHolder: HTMLElement,
    id: string,
    settings: CanvasSettings,
    sizeMultiplier?: number,
    width?: number,
    height?: number
  ) {
    this.canvasSettings = settings;
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
    this.canvasContext = this.canvasNode.getContext("webgl", {preserveDrawingBuffer:false});
    //this.primitiveType = this.canvasContext.TRIANGLES;
    //this.primitiveType = this.canvasContext.LINES;
    //this.primitiveType = this.canvasContext.TRIANGLE_STRIP;
    this.webGLShadersInitialize();
  }

  webGLShadersInitialize = () => {
    this.vertexShader = createShader(this.canvasContext,this.canvasContext.VERTEX_SHADER,vert);
    this.fragmentShader = createShader(this.canvasContext,this.canvasContext.FRAGMENT_SHADER,frag);
    this.webGLProgram = createProgram(this.canvasContext,this.vertexShader,this.fragmentShader);
    this.canvasContext.enable(this.canvasContext.DEPTH_TEST);
    this.canvasContext.useProgram(this.webGLProgram);

    const prev_positionAttributeLocation = this.canvasContext.getAttribLocation(this.webGLProgram, "prev_position");
    const positionAttributeLocation = this.canvasContext.getAttribLocation(this.webGLProgram, "position");
    const next_positionAttributeLocation = this.canvasContext.getAttribLocation(this.webGLProgram, "next_position");
    const sideAttributeLocation = this.canvasContext.getAttribLocation(this.webGLProgram, "side");
    const uvAttributeLocation = this.canvasContext.getAttribLocation(this.webGLProgram, "uv");

    this.prev_positionBuffer = this.canvasContext.createBuffer();
    this.next_positionBuffer = this.canvasContext.createBuffer();
    this.positionBuffer = this.canvasContext.createBuffer();
    this.sideBuffer = this.canvasContext.createBuffer();
    this.uvBuffer = this.canvasContext.createBuffer();

    const colorUniformLocation = this.canvasContext.getUniformLocation(this.webGLProgram, "u_color");
    this.canvasContext.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
    //this.canvasContext.uniform4f(colorUniformLocation, 255, 0, 0, 1);

    const resolutionUniformLocation  = this.canvasContext.getUniformLocation(this.webGLProgram, "u_resolution");


    const widthUniformLocation = this.canvasContext.getUniformLocation(this.webGLProgram, "width");
    this.canvasContext.uniform1f(widthUniformLocation, 0.01);

    this.canvasContext.viewport(0,0,this.canvasNode.width,this.canvasNode.height);
    this.canvasContext.clearColor(0,0,0,0);
    this.canvasContext.clear(this.canvasContext.COLOR_BUFFER_BIT | this.canvasContext.DEPTH_BUFFER_BIT);
    this.canvasContext.uniform2f(resolutionUniformLocation,this.canvasNode.width,this.canvasNode.height);
    const size = 3;          // 2 components per iteration
    const type = this.canvasContext.FLOAT;   // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0;        // start at the beginning of the buffer

    const count = 20;
    const points: Vec3[] = [];
    for (let i = 0; i < count; i++) {
      const x = 0;
      const y = 0;
      const z = 0;
      points.push(new Vec3(x,y,z));
    };

    this.polyline = new Polyline(points);

    this.canvasContext.bindBuffer(this.canvasContext.ARRAY_BUFFER,this.prev_positionBuffer);
    this.canvasContext.bufferData(this.canvasContext.ARRAY_BUFFER, this.polyline.prev, this.canvasContext.STATIC_DRAW);
    this.canvasContext.vertexAttribPointer(prev_positionAttributeLocation, size, type, normalize, stride, offset);
    this.canvasContext.enableVertexAttribArray(prev_positionAttributeLocation);

    this.canvasContext.bindBuffer(this.canvasContext.ARRAY_BUFFER,this.next_positionBuffer);
    this.canvasContext.bufferData(this.canvasContext.ARRAY_BUFFER, this.polyline.next, this.canvasContext.STATIC_DRAW);
    this.canvasContext.vertexAttribPointer(next_positionAttributeLocation, size, type, normalize, stride, offset);
    this.canvasContext.enableVertexAttribArray(next_positionAttributeLocation);

    this.canvasContext.bindBuffer(this.canvasContext.ARRAY_BUFFER,this.positionBuffer);
    this.canvasContext.bufferData(this.canvasContext.ARRAY_BUFFER, this.polyline.position, this.canvasContext.STATIC_DRAW);
    this.canvasContext.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    this.canvasContext.enableVertexAttribArray(positionAttributeLocation);

    this.canvasContext.bindBuffer(this.canvasContext.ARRAY_BUFFER,this.sideBuffer);
    this.canvasContext.bufferData(this.canvasContext.ARRAY_BUFFER, this.polyline.side, this.canvasContext.STATIC_DRAW);
    this.canvasContext.vertexAttribPointer(sideAttributeLocation, 1, type, normalize, stride, offset);
    this.canvasContext.enableVertexAttribArray(sideAttributeLocation);

    this.canvasContext.bindBuffer(this.canvasContext.ARRAY_BUFFER,this.uvBuffer);
    this.canvasContext.bufferData(this.canvasContext.ARRAY_BUFFER, this.polyline.uv, this.canvasContext.STATIC_DRAW);
    this.canvasContext.vertexAttribPointer(uvAttributeLocation, 2, type, normalize, stride, offset);
    this.canvasContext.enableVertexAttribArray(uvAttributeLocation);

    this.canvasContext.drawArrays(this.canvasContext.TRIANGLE_STRIP,0,1);

  };


  updateBuffersAndDraw(){

    const widthUniformLocation = this.canvasContext.getUniformLocation(this.webGLProgram, "width");
    this.canvasContext.uniform1f(widthUniformLocation, this.canvasSettings.pencilWidth);

    const colorUniformLocation = this.canvasContext.getUniformLocation(this.webGLProgram, "u_color");
    this.canvasContext.uniform4f(colorUniformLocation, this.canvasSettings.colorInRGB.r, this.canvasSettings.colorInRGB.g, this.canvasSettings.colorInRGB.b, this.canvasSettings.colorInRGB.a);

    this.canvasContext.bindBuffer(this.canvasContext.ARRAY_BUFFER,this.prev_positionBuffer);
    this.canvasContext.bufferData(this.canvasContext.ARRAY_BUFFER, this.polyline.prev, this.canvasContext.STATIC_DRAW);

    this.canvasContext.bindBuffer(this.canvasContext.ARRAY_BUFFER,this.next_positionBuffer);
    this.canvasContext.bufferData(this.canvasContext.ARRAY_BUFFER, this.polyline.next, this.canvasContext.STATIC_DRAW);

    this.canvasContext.bindBuffer(this.canvasContext.ARRAY_BUFFER,this.positionBuffer);
    this.canvasContext.bufferData(this.canvasContext.ARRAY_BUFFER, this.polyline.position, this.canvasContext.STATIC_DRAW);

    this.canvasContext.bindBuffer(this.canvasContext.ARRAY_BUFFER,this.sideBuffer);
    this.canvasContext.bufferData(this.canvasContext.ARRAY_BUFFER, this.polyline.side, this.canvasContext.STATIC_DRAW);

    this.canvasContext.bindBuffer(this.canvasContext.ARRAY_BUFFER,this.uvBuffer);
    this.canvasContext.bufferData(this.canvasContext.ARRAY_BUFFER, this.polyline.uv, this.canvasContext.STATIC_DRAW);

    this.canvasContext.drawArrays(this.canvasContext.TRIANGLE_STRIP,0,40);
  }


  resizeHandle = () => {
    const displayWidth  = this.canvasHolder.clientWidth;
    const displayHeight = this.canvasHolder.clientHeight;

    if (this.canvasNode.width  != displayWidth ||
        this.canvasNode.height != displayHeight) {

      this.canvasNode.width  = displayWidth;
      this.canvasNode.height = displayHeight;
    }
    const resolutionUniformLocation  = this.canvasContext.getUniformLocation(this.webGLProgram, "u_resolution");
    this.canvasContext.viewport(0,0,this.canvasNode.width,this.canvasNode.height);
    this.canvasContext.uniform2f(resolutionUniformLocation,this.canvasNode.width,this.canvasNode.height);

  };
}
