// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"shaders/vert.glsl":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nattribute vec3 prev_position;\nattribute vec3 position;\nattribute vec3 next_position;\nattribute float side;\nattribute vec2 uv;\n\nuniform vec2 u_resolution;\n\nvoid main() {\n    //ratio wyświetlania\n    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1);\n    //przeliczanie z -1,1 na pixele\n    vec2 nextScreen = next_position.xy * aspect;\n    vec2 prevScreen = prev_position.xy * aspect;\n    //tg do wyliczenia punktu po środku\n    vec2 tangent = normalize(nextScreen - prevScreen);\n    //odwrócamy vector\n    vec2 normal = vec2(-tangent.y, tangent.x);\n    //dzielimy przez aspect, żeby wrócić do -1,1\n    normal /= aspect;\n    //10% ekranu, bo o -1,1;\n    //normal *= 0.1;\n    normal *= (1.0 - pow(abs(uv.y - 0.5) * 2.0, 2.0)) * 0.1;\n    float dist = length(nextScreen - prevScreen);\n    normal *= smoothstep(0.0, 0.05, dist);\n\n    vec4 current = vec4(position,1);\n    current.xy -= normal * side;\n\n    gl_Position = current;\n}\n";
},{}],"shaders/frag.glsl":[function(require,module,exports) {
module.exports = "precision mediump float;\n#define GLSLIFY 1\n\nuniform vec4 u_color;\n\nvoid main() {\n    gl_FragColor = u_color;\n}\n";
},{}],"shaders/shaderUtils.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProgram = exports.createShader = void 0; //TODO: types?

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  gl.deleteShader(shader);
}

exports.createShader = createShader; //TODO: types?

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (success) {
    return program;
  }

  gl.deleteProgram(program);
}

exports.createProgram = createProgram;
},{}],"models/Vectors/Vec3.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vec3 = void 0;

var Vec3 =
/** @class */
function () {
  function Vec3(x, y, z) {
    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = x;
    }

    if (z === void 0) {
      z = y;
    }

    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  Object.defineProperty(Vec3.prototype, "x", {
    get: function get() {
      return this[0];
    },
    set: function set(i) {
      this[0] = i;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Vec3.prototype, "y", {
    get: function get() {
      return this[1];
    },
    set: function set(i) {
      this[1] = i;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Vec3.prototype, "z", {
    get: function get() {
      return this[2];
    },
    set: function set(i) {
      this[2] = i;
    },
    enumerable: false,
    configurable: true
  });

  Vec3.prototype.set = function (x, y, z) {
    this[0] = x;
    this[1] = y;
    this[2] = z;
    return this;
  };

  Vec3.prototype.copy = function () {
    return new Vec3(this.x, this.y, this.z);
  };

  Vec3.prototype.add = function (v) {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  };

  Vec3.prototype.sub = function (v) {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  };

  Vec3.prototype.scale = function (k) {
    return new Vec3(this.x * k, this.y * k, this.z * k);
  };

  Vec3.prototype.dot = function (v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  };

  Vec3.prototype.cross = function (v) {
    return new Vec3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
  };

  Vec3.prototype.negate = function () {
    return new Vec3(this.x * -1, this.y * -1, this.z * -1);
  };

  Vec3.prototype.len = function () {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
  };

  Vec3.prototype.normalize = function () {
    var len = this.len();
    return new Vec3(this.x / len, this.y / len, this.z / len);
  };

  Vec3.prototype.lerp = function (v, t) {
    this.x = this.x + t * (v.x - this.x);
    this.y = this.y + t * (v.y - this.y);
    this.z = this.z + t * (v.z - this.z);
  };

  Vec3.prototype.toArray = function (a, i) {
    if (i === void 0) {
      i = 0;
    }

    a[i] = this.x;
    a[i + 1] = this.y;
    a[i + 2] = this.z;
    return a;
  };

  return Vec3;
}();

exports.Vec3 = Vec3;
},{}],"models/Objects/Polyline.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Polyline = void 0;

var Vec3_1 = require("../Vectors/Vec3");

var Polyline =
/** @class */
function () {
  function Polyline(points) {
    this.tmp = new Vec3_1.Vec3();
    this.points = points;
    this.count = points.length;
    this.position = new Float32Array(this.count * 3 * 2);
    this.prev = new Float32Array(this.count * 3 * 2);
    this.next = new Float32Array(this.count * 3 * 2);
    this.index = new Uint16Array((this.count - 1) * 3 * 2);
    this.side = new Float32Array(this.count * 2);
    this.uv = new Float32Array(this.count * 2 * 2);

    for (var i = 0; i < this.count; i++) {
      this.side.set([-1, 1], i * 2);
      var v = i / (this.count - 1);
      this.uv.set([0, v, 1, v], i * 4);
      if (i === this.count - 1) continue;
      var ind = i * 2;
      this.index.set([ind, ind + 1, ind + 2], ind * 3);
      this.index.set([ind + 2, ind + 1, ind + 3], (ind + 1) * 3);
    }

    this.updateGeometry();
  }

  Polyline.prototype.updateGeometry = function () {
    var _this = this;

    this.points.forEach(function (p, i) {
      p.toArray(_this.position, i * 3 * 2);
      p.toArray(_this.position, i * 3 * 2 + 3);

      if (!i) {
        _this.tmp = p.copy().sub(_this.points[i + 1]).add(p);

        _this.tmp.toArray(_this.prev, i * 3 * 2);

        _this.tmp.toArray(_this.prev, i * 3 * 2 + 3);
      } else {
        p.toArray(_this.next, (i - 1) * 3 * 2);
        p.toArray(_this.next, (i - 1) * 3 * 2 + 3);
      }

      if (i === _this.points.length - 1) {
        _this.tmp = p.copy().sub(_this.points[i - 1]).add(p);

        _this.tmp.toArray(_this.next, i * 3 * 2);

        _this.tmp.toArray(_this.next, i * 3 * 2 + 3);
      } else {
        p.toArray(_this.prev, (i + 1) * 3 * 2);
        p.toArray(_this.prev, (i + 1) * 3 * 2 + 3);
      }
    });
  };

  Polyline.prototype.stackNewPoint = function (v) {
    this.points.push(v);
    this.points.shift();
    this.updateGeometry();
  };

  return Polyline;
}();

exports.Polyline = Polyline;
},{"../Vectors/Vec3":"models/Vectors/Vec3.ts"}],"models/Canvases/WebGLCanvas.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebGLCanvas = void 0; // @ts-ignore

var vert_glsl_1 = __importDefault(require("../../shaders/vert.glsl")); // @ts-ignore


var frag_glsl_1 = __importDefault(require("../../shaders/frag.glsl"));

var shaderUtils_1 = require("../../shaders/shaderUtils");

var Vec3_1 = require("../Vectors/Vec3");

var Polyline_1 = require("../Objects/Polyline");

var WebGLCanvas =
/** @class */
function () {
  function WebGLCanvas(canvasHolder, id, sizeMultiplier, width, height) {
    var _this = this;

    this.enabled = true;
    this.mouse = new Vec3_1.Vec3();

    this.createCanvas = function (width, height) {
      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      return canvas;
    };

    this.webGLShadersInitialize = function () {
      _this.vertexShader = shaderUtils_1.createShader(_this.canvasContext, _this.canvasContext.VERTEX_SHADER, vert_glsl_1.default);
      _this.fragmentShader = shaderUtils_1.createShader(_this.canvasContext, _this.canvasContext.FRAGMENT_SHADER, frag_glsl_1.default);
      _this.webGLProgram = shaderUtils_1.createProgram(_this.canvasContext, _this.vertexShader, _this.fragmentShader);

      _this.canvasContext.enable(_this.canvasContext.DEPTH_TEST);

      _this.canvasContext.useProgram(_this.webGLProgram);

      var prev_positionAttributeLocation = _this.canvasContext.getAttribLocation(_this.webGLProgram, "prev_position");

      var positionAttributeLocation = _this.canvasContext.getAttribLocation(_this.webGLProgram, "position");

      var next_positionAttributeLocation = _this.canvasContext.getAttribLocation(_this.webGLProgram, "next_position");

      var sideAttributeLocation = _this.canvasContext.getAttribLocation(_this.webGLProgram, "side");

      var uvAttributeLocation = _this.canvasContext.getAttribLocation(_this.webGLProgram, "uv");

      _this.prev_positionBuffer = _this.canvasContext.createBuffer();
      _this.next_positionBuffer = _this.canvasContext.createBuffer();
      _this.positionBuffer = _this.canvasContext.createBuffer();
      _this.sideBuffer = _this.canvasContext.createBuffer();
      _this.uvBuffer = _this.canvasContext.createBuffer();

      var colorUniformLocation = _this.canvasContext.getUniformLocation(_this.webGLProgram, "u_color");

      _this.canvasContext.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1); //this.canvasContext.uniform4f(colorUniformLocation, 255, 0, 0, 1);


      var resolutionUniformLocation = _this.canvasContext.getUniformLocation(_this.webGLProgram, "u_resolution");

      _this.resizeHandle();

      _this.canvasContext.viewport(0, 0, _this.canvasNode.width, _this.canvasNode.height);

      _this.canvasContext.clearColor(0, 0, 0, 0);

      _this.canvasContext.clear(_this.canvasContext.COLOR_BUFFER_BIT | _this.canvasContext.DEPTH_BUFFER_BIT);

      _this.canvasContext.uniform2f(resolutionUniformLocation, _this.canvasNode.width, _this.canvasNode.height);

      var size = 3; // 2 components per iteration

      var type = _this.canvasContext.FLOAT; // the data is 32bit floats

      var normalize = false; // don't normalize the data

      var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position

      var offset = 0; // start at the beginning of the buffer

      var count = 20;
      var points = [];

      for (var i = 0; i < count; i++) {
        var x = i / (count - 1) - 0.5;
        var y = 0;
        var z = 0;
        points.push(new Vec3_1.Vec3(x, y, z));
      }

      ;
      _this.polyline = new Polyline_1.Polyline(points);

      _this.canvasContext.bindBuffer(_this.canvasContext.ARRAY_BUFFER, _this.prev_positionBuffer);

      _this.canvasContext.bufferData(_this.canvasContext.ARRAY_BUFFER, _this.polyline.prev, _this.canvasContext.STATIC_DRAW);

      _this.canvasContext.vertexAttribPointer(prev_positionAttributeLocation, size, type, normalize, stride, offset);

      _this.canvasContext.enableVertexAttribArray(prev_positionAttributeLocation);

      _this.canvasContext.bindBuffer(_this.canvasContext.ARRAY_BUFFER, _this.next_positionBuffer);

      _this.canvasContext.bufferData(_this.canvasContext.ARRAY_BUFFER, _this.polyline.next, _this.canvasContext.STATIC_DRAW);

      _this.canvasContext.vertexAttribPointer(next_positionAttributeLocation, size, type, normalize, stride, offset);

      _this.canvasContext.enableVertexAttribArray(next_positionAttributeLocation);

      _this.canvasContext.bindBuffer(_this.canvasContext.ARRAY_BUFFER, _this.positionBuffer);

      _this.canvasContext.bufferData(_this.canvasContext.ARRAY_BUFFER, _this.polyline.position, _this.canvasContext.STATIC_DRAW);

      _this.canvasContext.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

      _this.canvasContext.enableVertexAttribArray(positionAttributeLocation);

      _this.canvasContext.bindBuffer(_this.canvasContext.ARRAY_BUFFER, _this.sideBuffer);

      _this.canvasContext.bufferData(_this.canvasContext.ARRAY_BUFFER, _this.polyline.side, _this.canvasContext.STATIC_DRAW);

      _this.canvasContext.vertexAttribPointer(sideAttributeLocation, 1, type, normalize, stride, offset);

      _this.canvasContext.enableVertexAttribArray(sideAttributeLocation);

      _this.canvasContext.bindBuffer(_this.canvasContext.ARRAY_BUFFER, _this.uvBuffer);

      _this.canvasContext.bufferData(_this.canvasContext.ARRAY_BUFFER, _this.polyline.uv, _this.canvasContext.STATIC_DRAW);

      _this.canvasContext.vertexAttribPointer(uvAttributeLocation, 2, type, normalize, stride, offset);

      _this.canvasContext.enableVertexAttribArray(uvAttributeLocation);

      _this.canvasContext.drawArrays(_this.canvasContext.TRIANGLE_STRIP, 0, 40);
    };

    this.drawCursor = function (e) {
      var x = e.offsetX;
      var y = e.offsetY;
      _this.mouse.x = x / _this.canvasNode.width * 2 - 1;
      _this.mouse.y = y / _this.canvasNode.height * -2 + 1;
    };

    this.spring = 0.05;
    this.friction = 0.93;
    this.tmp = new Vec3_1.Vec3();
    this.mouseVelocity = new Vec3_1.Vec3();

    this.resizeHandle = function () {
      var displayWidth = _this.canvasNode.clientWidth;
      var displayHeight = _this.canvasNode.clientHeight;

      if (_this.canvasNode.width != displayWidth || _this.canvasNode.height != displayHeight) {
        _this.canvasNode.width = displayWidth;
        _this.canvasNode.height = displayHeight;
      }
    };

    this.sizeMultiplier = sizeMultiplier;
    this.canvasHolder = canvasHolder;
    var canvas = this.createCanvas(width ? width : canvasHolder.clientWidth * (sizeMultiplier ? sizeMultiplier : 1), height ? height : canvasHolder.clientHeight * (sizeMultiplier ? sizeMultiplier : 1));
    canvas.id = id;
    this.canvasNode = canvasHolder.appendChild(canvas);
    this.canvasContext = this.canvasNode.getContext("webgl"); //this.primitiveType = this.canvasContext.TRIANGLES;
    //this.primitiveType = this.canvasContext.LINES;
    //this.primitiveType = this.canvasContext.TRIANGLE_STRIP;

    this.webGLShadersInitialize();
  }

  WebGLCanvas.prototype.draw = function () {
    var _this = this;

    this.updateBuffersAndDraw();

    for (var i = this.polyline.points.length - 1; i >= 0; i--) {
      if (!i) {
        this.tmp = this.mouse.copy();
        this.tmp = this.tmp.sub(this.polyline.points[i]);
        this.tmp = this.tmp.scale(this.spring);
        this.mouseVelocity = this.mouseVelocity.add(this.tmp);
        this.mouseVelocity = this.mouseVelocity.scale(this.friction);
        this.polyline.points[i] = this.polyline.points[i].add(this.mouseVelocity);
      } else {
        this.polyline.points[i].lerp(this.polyline.points[i - 1], 0.9);
      }
    }

    this.polyline.updateGeometry();
    requestAnimationFrame(function () {
      return _this.draw();
    });
  };

  WebGLCanvas.prototype.updateBuffersAndDraw = function () {
    this.canvasContext.bindBuffer(this.canvasContext.ARRAY_BUFFER, this.prev_positionBuffer);
    this.canvasContext.bufferData(this.canvasContext.ARRAY_BUFFER, this.polyline.prev, this.canvasContext.STATIC_DRAW);
    this.canvasContext.bindBuffer(this.canvasContext.ARRAY_BUFFER, this.next_positionBuffer);
    this.canvasContext.bufferData(this.canvasContext.ARRAY_BUFFER, this.polyline.next, this.canvasContext.STATIC_DRAW);
    this.canvasContext.bindBuffer(this.canvasContext.ARRAY_BUFFER, this.positionBuffer);
    this.canvasContext.bufferData(this.canvasContext.ARRAY_BUFFER, this.polyline.position, this.canvasContext.STATIC_DRAW);
    this.canvasContext.bindBuffer(this.canvasContext.ARRAY_BUFFER, this.sideBuffer);
    this.canvasContext.bufferData(this.canvasContext.ARRAY_BUFFER, this.polyline.side, this.canvasContext.STATIC_DRAW);
    this.canvasContext.bindBuffer(this.canvasContext.ARRAY_BUFFER, this.uvBuffer);
    this.canvasContext.bufferData(this.canvasContext.ARRAY_BUFFER, this.polyline.uv, this.canvasContext.STATIC_DRAW);
    this.canvasContext.drawArrays(this.canvasContext.TRIANGLE_STRIP, 0, 40);
  };

  return WebGLCanvas;
}();

exports.WebGLCanvas = WebGLCanvas;
},{"../../shaders/vert.glsl":"shaders/vert.glsl","../../shaders/frag.glsl":"shaders/frag.glsl","../../shaders/shaderUtils":"shaders/shaderUtils.ts","../Vectors/Vec3":"models/Vectors/Vec3.ts","../Objects/Polyline":"models/Objects/Polyline.ts"}],"models/Canvases/MainCanvas.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MainCanvas = void 0;

var WebGLCanvas_1 = require("./WebGLCanvas");

var MainCanvas =
/** @class */
function (_super) {
  __extends(MainCanvas, _super);

  function MainCanvas(canvasHolder, settings, sizeMultiplier, width, height) {
    var _this = _super.call(this, canvasHolder, 'main-canvas', sizeMultiplier, width, height) || this;

    _this.isDrawing = false;
    _this.mouseX = 0;
    _this.mouseY = 0;

    _this.startDrawing = function (e) {
      _this.isDrawing = true;
      _this.mouseX = e.offsetX;
      _this.mouseY = e.offsetY;
    };

    _this.stopDrawing = function () {
      _this.isDrawing = false;
    };

    _this.doDrawing = function (e) {
      _this.drawCursor(e);
    };

    _this.settings = settings;

    _this.canvasNode.addEventListener("mousedown", _this.startDrawing);

    _this.canvasNode.addEventListener("mouseup", _this.stopDrawing);

    _this.canvasNode.addEventListener("mousemove", _this.doDrawing);

    _this.canvasNode.addEventListener("touchstart", _this.startDrawing);

    _this.canvasNode.addEventListener("touchend", _this.stopDrawing);

    _this.canvasNode.addEventListener("touchmove", _this.doDrawing);

    requestAnimationFrame(function () {
      return _this.draw();
    });
    return _this;
  }

  return MainCanvas;
}(WebGLCanvas_1.WebGLCanvas);

exports.MainCanvas = MainCanvas;
},{"./WebGLCanvas":"models/Canvases/WebGLCanvas.ts"}],"models/Canvases/Canvas.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Canvas = void 0;

var Canvas =
/** @class */
function () {
  function Canvas(canvasHolder, id, sizeMultiplier, width, height) {
    var _this = this;

    this.enabled = true;

    this.createCanvas = function (width, height) {
      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      return canvas;
    };

    this.resizeHandle = function () {
      var currentImage = _this.canvasContext.getImageData(0, 0, _this.canvasNode.width, _this.canvasNode.height);

      _this.canvasNode.width = _this.canvasHolder.clientWidth * (_this.sizeMultiplier ? _this.sizeMultiplier : 1);
      _this.canvasNode.height = _this.canvasHolder.clientHeight * (_this.sizeMultiplier ? _this.sizeMultiplier : 1);

      _this.canvasContext.putImageData(currentImage, 0, 0);
    };

    this.clear = function () {
      _this.canvasContext.fillStyle = "rgba(0,0,0,0)";

      _this.canvasContext.fillRect(0, 0, _this.canvasNode.width, _this.canvasNode.height);
    };

    this.sizeMultiplier = sizeMultiplier;
    this.canvasHolder = canvasHolder;
    var canvas = this.createCanvas(width ? width : canvasHolder.clientWidth * (sizeMultiplier ? sizeMultiplier : 1), height ? height : canvasHolder.clientHeight * (sizeMultiplier ? sizeMultiplier : 1));
    canvas.id = id;
    this.canvasNode = canvasHolder.appendChild(canvas);
    this.canvasContext = this.canvasNode.getContext("2d");
  }

  return Canvas;
}();

exports.Canvas = Canvas;
},{}],"models/Canvases/ColorSelectionCanvas.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColorSelectionCanvas = void 0;

var Canvas_1 = require("./Canvas");

var ColorSelectionCanvas =
/** @class */
function (_super) {
  __extends(ColorSelectionCanvas, _super);

  function ColorSelectionCanvas(canvasHolder, onColorSelect, width, height) {
    var _this = _super.call(this, canvasHolder, 'color-selection-canvas', 1, width, height) || this;

    _this.selectedColor = "rgba(255,0,0,1)";
    _this.drawingColor = "rgba(255,0,0,1)";
    _this.selectedColorAsRGBAObject = {
      r: 255,
      g: 0,
      b: 0,
      a: 1
    };
    /*private selectedColorAsHSLAObject: {
      h: number;
      s: number;
      l: number;
      a: number;
    };*/

    _this.isDragging = false;

    _this.rgbatohsla = function (r, g, b, a) {
      r /= 255;
      g /= 255;
      b /= 255;
      var cmin = Math.min(r, g, b),
          cmax = Math.max(r, g, b),
          delta = cmax - cmin,
          h = 0,
          s = 0,
          l = 0;
      if (delta == 0) h = 0;else if (cmax == r) h = (g - b) / delta % 6;else if (cmax == g) h = (b - r) / delta + 2;else h = (r - g) / delta + 4;
      h = Math.round(h * 60);
      if (h < 0) h += 360;
      l = (cmax + cmin) / 2;
      s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      s = +(s * 100).toFixed(1);
      l = +(l * 100).toFixed(1); //return "hsla(" + h + "," + s + "%," +l + "%," + a + ")";

      return {
        h: h,
        s: s,
        l: l,
        a: a
      };
    };

    _this.hslatorgba = function (h, s, l, a) {
      s /= 100;
      l /= 100;
      var c = (1 - Math.abs(2 * l - 1)) * s,
          x = c * (1 - Math.abs(h / 60 % 2 - 1)),
          m = l - c / 2,
          r = 0,
          g = 0,
          b = 0;

      if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
      } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
      } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
      } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
      } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
      } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
      }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);
      return {
        r: r,
        g: g,
        b: b,
        a: a
      };
    };

    _this.setNewHue = function (hue) {
      var hsla = _this.rgbatohsla(_this.selectedColorAsRGBAObject.r, _this.selectedColorAsRGBAObject.g, _this.selectedColorAsRGBAObject.b, _this.selectedColorAsRGBAObject.a);

      var rgbaSelected = _this.hslatorgba(hue, 100, 50, hsla.a);

      var rgbaDrawing = _this.hslatorgba(hue, hsla.s, hsla.l, hsla.a);

      _this.selectedColor = "rgba(" + rgbaSelected.r + "," + rgbaSelected.g + "," + rgbaSelected.b + "," + rgbaSelected.a + ")";
      _this.drawingColor = "rgba(" + rgbaDrawing.r + "," + rgbaDrawing.g + "," + rgbaDrawing.b + "," + rgbaDrawing.a + ")";
      _this.selectedColorAsRGBAObject = rgbaDrawing;

      _this.onColorSelect(_this.drawingColor);

      _this.draw();
    };

    _this.changeColor = function (e) {
      var x = e.offsetX;
      var y = e.offsetY;

      var imageData = _this.canvasContext.getImageData(x, y, 1, 1).data;

      _this.drawingColor = "rgba(" + imageData[0] + "," + imageData[1] + "," + imageData[2] + ",1)";
      _this.selectedColorAsRGBAObject = {
        r: imageData[0],
        g: imageData[1],
        b: imageData[2],
        a: imageData[3]
      };

      _this.onColorSelect(_this.drawingColor);
    };

    _this.drawGradientsOnColorSelectionCanvas = function () {
      var grdWhite = _this.canvasContext.createLinearGradient(0, 0, _this.canvasNode.width, 0);

      grdWhite.addColorStop(0, "rgba(255,255,255,1)");
      grdWhite.addColorStop(1, "rgba(255,255,255,0)");
      _this.canvasContext.fillStyle = grdWhite;

      _this.canvasContext.fillRect(0, 0, _this.canvasNode.width, _this.canvasNode.height);

      var grdBlack = _this.canvasContext.createLinearGradient(0, 0, 0, _this.canvasNode.height);

      grdBlack.addColorStop(0, "rgba(0,0,0,0)");
      grdBlack.addColorStop(1, "rgba(0,0,0,1)");
      _this.canvasContext.fillStyle = grdBlack;

      _this.canvasContext.fillRect(0, 0, _this.canvasNode.width, _this.canvasNode.height);
    };

    _this.draw = function () {
      _this.canvasContext.fillStyle = _this.selectedColor;

      _this.canvasContext.fillRect(0, 0, _this.canvasNode.width, _this.canvasNode.height);

      _this.drawGradientsOnColorSelectionCanvas();
    };

    _this.onColorSelect = onColorSelect;

    _this.canvasNode.addEventListener("click", _this.changeColor);

    _this.canvasNode.addEventListener("mousedown", function (e) {
      _this.isDragging = true;

      _this.changeColor(e);
    });

    _this.canvasNode.addEventListener("mouseup", function (e) {
      _this.isDragging = false;
    });

    _this.canvasNode.addEventListener("mousemove", function (e) {
      if (_this.isDragging) {
        _this.changeColor(e);
      }
    });

    _this.draw();

    return _this;
  }

  return ColorSelectionCanvas;
}(Canvas_1.Canvas);

exports.ColorSelectionCanvas = ColorSelectionCanvas;
},{"./Canvas":"models/Canvases/Canvas.ts"}],"models/Canvases/HueSelectionCanvas.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HueSelectionCanvas = void 0;

var Canvas_1 = require("./Canvas");

var HueSelectionCanvas =
/** @class */
function (_super) {
  __extends(HueSelectionCanvas, _super);

  function HueSelectionCanvas(canvasHolder, onHueSelect, width, height) {
    var _this = _super.call(this, canvasHolder, 'hue-selection-canvas', 1, width, height) || this;

    _this.selectedHue = "rgba(0,0,0,1)";
    _this.isDragging = false;

    _this.changeHue = function (e) {
      var x = e.offsetX;
      var y = e.offsetY;

      var imageData = _this.canvasContext.getImageData(x, y, 1, 1).data;

      var hue = _this.getHueFromRGB(imageData[0], imageData[1], imageData[2]);

      _this.onHueSelect(hue);
    };

    _this.getHueFromRGB = function (r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
      var cmin = Math.min(r, g, b),
          cmax = Math.max(r, g, b),
          delta = cmax - cmin,
          h = 0;
      if (delta == 0) h = 0;else if (cmax == r) h = (g - b) / delta % 6;else if (cmax == g) h = (b - r) / delta + 2;else h = (r - g) / delta + 4;
      h = Math.round(h * 60);
      if (h < 0) h += 360;
      return h;
    };

    _this.draw = function () {
      _this.canvasContext.rect(0, 0, _this.canvasNode.width, _this.canvasNode.height);

      var grd1 = _this.canvasContext.createLinearGradient(0, 0, 0, _this.canvasNode.height);

      grd1.addColorStop(0, "rgba(255, 0, 0, 1)");
      grd1.addColorStop(0.17, "rgba(255, 255, 0, 1)");
      grd1.addColorStop(0.34, "rgba(0, 255, 0, 1)");
      grd1.addColorStop(0.51, "rgba(0, 255, 255, 1)");
      grd1.addColorStop(0.68, "rgba(0, 0, 255, 1)");
      grd1.addColorStop(0.85, "rgba(255, 0, 255, 1)");
      grd1.addColorStop(1, "rgba(255, 0, 0, 1)");
      _this.canvasContext.fillStyle = grd1;

      _this.canvasContext.fill();
    };

    _this.onHueSelect = onHueSelect;

    _this.canvasNode.addEventListener("click", _this.changeHue);

    _this.canvasNode.addEventListener("mousedown", function (e) {
      _this.isDragging = true;

      _this.changeHue(e);
    });

    _this.canvasNode.addEventListener("mouseup", function (e) {
      _this.isDragging = false;
    });

    _this.canvasNode.addEventListener("mousemove", function (e) {
      if (_this.isDragging) {
        _this.changeHue(e);
      }
    });

    _this.draw();

    return _this;
  }

  return HueSelectionCanvas;
}(Canvas_1.Canvas);

exports.HueSelectionCanvas = HueSelectionCanvas;
},{"./Canvas":"models/Canvases/Canvas.ts"}],"models/Canvases/CanvasSettings.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CanvasSettings = void 0;

var ColorSelectionCanvas_1 = require("./ColorSelectionCanvas");

var HueSelectionCanvas_1 = require("./HueSelectionCanvas");

var CanvasSettings =
/** @class */
function () {
  function CanvasSettings(mainAppHolder) {
    var _this = this;

    this.currentColor = "rgba(255,0,0,1)";
    this.pencilWidth = 15;

    this.changeCurrentlySelectedColor = function (color) {
      _this.currentColor = color;
      _this.colorDisplay.style.background = color;
    }; //TODO: change this type to proper one


    this.changePencilSize = function (size) {
      _this.pencilWidth = Number(size.target.value);
      _this.colorDisplay.style.width = _this.pencilWidth + "px";
      _this.colorDisplay.style.height = _this.pencilWidth + "px";
    };

    var settingsHolder = document.createElement("div");
    settingsHolder.id = "settings-holder";
    mainAppHolder.appendChild(settingsHolder);
    var currentColorWrapper = document.createElement('div');
    currentColorWrapper.id = "current-color-wrapper";
    settingsHolder.appendChild(currentColorWrapper);
    var currentlySelectedColor = document.createElement("div");
    currentlySelectedColor.id = "current-color";
    currentlySelectedColor.style.background = this.currentColor;
    currentColorWrapper.appendChild(currentlySelectedColor);
    this.colorDisplay = currentlySelectedColor;
    var sizePicker = document.createElement("input");
    sizePicker.type = "range";
    sizePicker.min = "1";
    sizePicker.max = "50";
    sizePicker.value = "15";
    sizePicker.oninput = this.changePencilSize;
    sizePicker.id = "pencil-size-picker";
    settingsHolder.appendChild(sizePicker);
    this.sizePicker = sizePicker;
    var colorSelectionWrapper = document.createElement("div");
    colorSelectionWrapper.id = "color-selection-wrapper";
    settingsHolder.appendChild(colorSelectionWrapper);
    var hueSelectionWrapper = document.createElement("div");
    hueSelectionWrapper.id = "hue-selection-wrapper";
    settingsHolder.appendChild(hueSelectionWrapper);
    this.colorPicker = new ColorSelectionCanvas_1.ColorSelectionCanvas(colorSelectionWrapper, this.changeCurrentlySelectedColor);
    this.huePicker = new HueSelectionCanvas_1.HueSelectionCanvas(hueSelectionWrapper, this.colorPicker.setNewHue);
    this.changeCurrentlySelectedColor("rgba(255,0,0,1)");
    this.changePencilSize({
      target: {
        value: "15"
      }
    });
  }

  return CanvasSettings;
}();

exports.CanvasSettings = CanvasSettings;
},{"./ColorSelectionCanvas":"models/Canvases/ColorSelectionCanvas.ts","./HueSelectionCanvas":"models/Canvases/HueSelectionCanvas.ts"}],"models/Canvases/CanvasBackground.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CanvasBackground = void 0;

var Canvas_1 = require("./Canvas");

var CanvasBackground =
/** @class */
function (_super) {
  __extends(CanvasBackground, _super); //private currentSetting: number;


  function CanvasBackground(mainAppHolder, sizeMultiplier) {
    var _this = _super.call(this, mainAppHolder, "background-canvas", sizeMultiplier) || this;

    _this.draw = function () {
      var w = _this.canvasNode.width;
      var h = _this.canvasNode.height;
      _this.canvasContext.fillStyle = "white";

      _this.canvasContext.fillRect(0, 0, w, h);

      var ctx = _this.canvasContext;
      ctx.translate(0.5, 0.5);
      ctx.beginPath();
      var gridSpacing = 40;
      var gridSpacingBigger = 5 * gridSpacing;

      for (var x = w / 2, i = x; x <= w; x += gridSpacing, i -= gridSpacing) {
        for (var y = h / 2, j = y; y <= h; y += gridSpacing, j -= gridSpacing) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.moveTo(i, 0);
          ctx.lineTo(i, h);
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.moveTo(0, j);
          ctx.lineTo(w, j);
        }
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgb(189,189,189)';
      ctx.stroke();
      ctx.beginPath();
      ctx.translate(0.5, 0.5);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(170,170,170)';

      for (var x = w / 2, i = x; x <= w; x += gridSpacingBigger, i -= gridSpacingBigger) {
        for (var y = h / 2, j = y; y <= h; y += gridSpacingBigger, j -= gridSpacingBigger) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.moveTo(i, 0);
          ctx.lineTo(i, h);
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.moveTo(0, j);
          ctx.lineTo(w, j);
        }
      }

      ctx.stroke();
    };

    _this.resizeBackgroundHandle = function () {
      _this.resizeHandle();

      _this.draw();
    };

    return _this;
  }

  return CanvasBackground;
}(Canvas_1.Canvas);

exports.CanvasBackground = CanvasBackground;
},{"./Canvas":"models/Canvases/Canvas.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawitCanvas = void 0;

var MainCanvas_1 = require("./models/Canvases/MainCanvas");

var CanvasSettings_1 = require("./models/Canvases/CanvasSettings");

var CanvasBackground_1 = require("./models/Canvases/CanvasBackground");

var DrawitCanvas =
/** @class */
function () {
  function DrawitCanvas(mainAppHolder) {
    var _this = this;

    this.mainAppHolder = mainAppHolder;
    this.canvasSettings = new CanvasSettings_1.CanvasSettings(mainAppHolder);
    this.canvasBackground = new CanvasBackground_1.CanvasBackground(mainAppHolder, 0.95);
    this.canvasBackground.draw();
    this.mainCanvas = new MainCanvas_1.MainCanvas(mainAppHolder, this.canvasSettings, 0.95);

    window.onresize = function () {
      _this.mainCanvas.resizeHandle();

      _this.canvasBackground.resizeBackgroundHandle();
    };
  }

  return DrawitCanvas;
}();

exports.DrawitCanvas = DrawitCanvas;
},{"./models/Canvases/MainCanvas":"models/Canvases/MainCanvas.ts","./models/Canvases/CanvasSettings":"models/Canvases/CanvasSettings.ts","./models/Canvases/CanvasBackground":"models/Canvases/CanvasBackground.ts"}],"C:/Users/kuba/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"C:/Users/kuba/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"C:/Users/kuba/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"styles/normalize.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"C:/Users/kuba/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"styles/index.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"C:/Users/kuba/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"testingonly.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var index_1 = require("./index");

require("./styles/normalize.css");

require("./styles/index.css");

var app = document.getElementById("app");
new index_1.DrawitCanvas(app);
},{"./index":"index.ts","./styles/normalize.css":"styles/normalize.css","./styles/index.css":"styles/index.css"}],"C:/Users/kuba/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60283" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/kuba/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","testingonly.ts"], null)
//# sourceMappingURL=/testingonly.23e5de38.js.map