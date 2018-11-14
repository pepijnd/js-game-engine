import Hitbox from "hitbox/hitbox";
import AABB from "hitbox/aabb";
import Polygon from "hitbox/polygon";

export default class Circle extends Hitbox {
    constructor(options) {
        super(options);
        this.r = options.r;
        this.res = options.res;
        this.aabb = AABB.Create();
    }

    static Create(options = {}) {
        options = Object.assign({}, this.GetDefaultOptions(), options);
        return new this.prototype.constructor(options);
    }

    static GetDefaultOptions() {
        return Object.assign({}, super.GetDefaultOptions(), {r: 1, res:12});
    }

    update() {
        let r = this.r;
        this.aabb.w = this.r * 2;
        this.aabb.h = this.r * 2;
        this.aabb.x = this.x;
        this.aabb.y = this.y;
    }

    checkCollision(other) {
        if (this.toAABB().checkCollision(other.toAABB())) {
            return this.toPolygon().checkCollision(other.toPolygon())
        }
        return false;
    }

    rotateVertice(vert) {
        let s = Math.sin(this.r);
        let c = Math.cos(this.r);

        let x = vert.x;
        let y = vert.y;

        let xnew = (x * c) - (y * s);
        let ynew = (x * s) + (y * c);

        return {x: xnew, y: ynew};
    }

    getVertices() {
        let vertices = [];
        for (let i=0; i<this.res; i++) {
            let j = (Math.PI * 2) / this.res * i;
            vertices.push({
                x: Math.cos(j) * this.r + this.r,
                y: Math.sin(j) * this.r + this.r
            });
        }
        return vertices;
    }

    toAABB() {
        return this.aabb;
    }

    toPolygon() {
        let polygon = Polygon.Create({
            vertices: this.getVertices(),
            x: this.x,
            y: this.y
        });
        polygon.update();
        return polygon;
    }
}