export default class Vector {
    constructor(a, m) {
        this.a = a;
        this.m = m;
    }

    static fromPoints(x1, x2, y1, y2) {
        return this.fromPoint(x1 - x2, y1 -y2);
    }

    static fromPoint(x, y) {
        let a = Math.atan2(y, x);
        let m = Math.sqrt(x*x + y*y);
        return new this.prototype.constructor(a, m);
    }
}