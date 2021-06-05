import {Vec3} from "../Vectors/Vec3";

export class Polyline {
    public points: Vec3[];
    private count: number;

    readonly position: Float32Array;
    readonly next: Float32Array;
    readonly prev: Float32Array;

    readonly index: Uint16Array;
    readonly side: Float32Array;
    readonly uv: Float32Array;

    constructor(points: Vec3[]) {
        this.points = points;
        this.count = points.length;
        this.position = new Float32Array(this.count * 3 *2);
        this.prev = new Float32Array(this.count * 3 *2);
        this.next = new Float32Array(this.count * 3 *2);

        this.index = new Uint16Array((this.count - 1) * 3 * 2);
        this.side = new Float32Array(this.count * 2);
        this.uv = new Float32Array(this.count * 2 * 2);

        for (let i = 0; i < this.count; i++) {
            this.side.set([-1, 1], i * 2);
            const v = i / (this.count - 1);
            this.uv.set([0, v, 1, v], i * 4);
            if (i === this.count - 1) continue;
            const ind = i * 2;
            this.index.set([ind, ind + 1, ind + 2], ind * 3);
            this.index.set([ind + 2, ind + 1, ind + 3], (ind + 1) * 3);
        }

        this.updateGeometry();
    }

    private tmp: Vec3 = new Vec3();

    updateGeometry() {
        this.points.forEach((p, i) => {
            p.toArray(this.position, i * 3 * 2);
            p.toArray(this.position, i * 3 * 2 + 3);
            if (!i) {
                this.tmp = p.copy().sub(this.points[i + 1]).add(p);
                this.tmp.toArray(this.prev, i * 3 * 2);
                this.tmp.toArray(this.prev, i * 3 * 2 + 3);
            } else {
                p.toArray(this.next, (i - 1) * 3 * 2);
                p.toArray(this.next, (i - 1) * 3 * 2 + 3);
            }
            if (i === this.points.length - 1) {
                this.tmp = p.copy().sub(this.points[i - 1]).add(p);
                this.tmp.toArray(this.next, i * 3 * 2);
                this.tmp.toArray(this.next, i * 3 * 2 + 3);
            } else {
                p.toArray(this.prev, (i + 1) * 3 * 2);
                p.toArray(this.prev, (i + 1) * 3 * 2 + 3);
            }
        });
    }

    stackNewPoint(v: Vec3){
        this.points.push(v);
        this.points.shift();
        this.updateGeometry();
    }
}
