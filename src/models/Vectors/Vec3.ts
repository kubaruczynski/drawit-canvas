export class Vec3 {
  constructor(x = 0, y = x, z = y) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  get z() {
    return this[2];
  }
  set x(i: number) {
    this[0] = i;
  }
  set y(i: number) {
    this[1] = i;
  }
  set z(i: number) {
    this[2] = i;
  }

  set(x: number, y: number, z: number) {
    this[0] = x;
    this[1] = y;
    this[2] = z;
    return this;
  }

  copy() {
    return new Vec3(this.x, this.y, this.z);
  }

  add(v: Vec3) {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  sub(v: Vec3) {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  scale(k: number) {
    return new Vec3(this.x * k, this.y * k, this.z * k);
  }

  dot(v: Vec3) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vec3) {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  negate() {
    return new Vec3(this.x * -1, this.y * -1, this.z * -1);
  }

  len() {
    return Math.sqrt(this.x**2 + this.y**2 + this.z**2);
  }

  normalize() {
    const len = this.len();
    return new Vec3(this.x/len,this.y/len,this.z/len);
  }

  lerp(v, t) {
    this.x = this.x + t * (v.x - this.x);
    this.y = this.y + t * (v.y - this.y);
    this.z = this.z + t * (v.z - this.z);
  }

  toArray(a: Float32Array,i=0) {
    a[i] = this.x;
    a[i+1] = this.y;
    a[i+2] = this.z;
    return a;
  }
}
