export default class Vector {
    constructor(a, m) {
        this.a = a;
        this.m = m;
    }

    static fromPoints(x1, x2, y1, y2) {
        return this.fromPoint(x2 - x1, y2 -y1);
    }

    static fromPoint(x, y) {
        let a = Math.atan2(y, x);
        let m = Math.sqrt(x*x + y*y);
        return new Vector(a, m);
    }

    unitVector() {
        return {x: Math.cos(this.a), y: Math.sin(this.a)}
    }

    dotProduct(other) {
        return this.m * other.m * Math.cos(this.a - other.a);
    }
}