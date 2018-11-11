import Hitbox from "hitbox/hitbox";
import AABB from "hitbox/aabb";
import Polygon from "hitbox/polygon";

export default class Box extends Hitbox {
    constructor(options) {
        super(options);
        this.w = options.w;
        this.h = options.h;
        this.r = options.r;

        this.aabb = AABB.Create();
    }

    static Create(options = {}) {
        options = Object.assign({}, this.GetDefaultOptions(), options);
        return new this.prototype.constructor(options);
    }

    static GetDefaultOptions() {
        return Object.assign({}, super.GetDefaultOptions(), {w: 0, h: 0, r: 0});
    }

    update() {
        let w = this.w;
        let h = this.h;
        let r = this.r;
        if (!(this.r < Math.PI / 2 || (this.r > Math.PI && this.r < Math.PI * 3 / 2))) {
            w = this.h;
            h = this.w;
            r = this.r - Math.PI / 2;
        }
        this.aabb.w = Math.abs((w * Math.cos(r)) + (h * Math.sin(r)));
        this.aabb.h = Math.abs((w * Math.sin(r)) + (h * Math.cos(r)));
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
        vertices.push(this.rotateVertice({x: 0, y: 0}));
        vertices.push(this.rotateVertice({x: this.w, y: 0}));
        vertices.push(this.rotateVertice({x: this.w, y: this.h}));
        vertices.push(this.rotateVertice({x: 0, y: this.h}));
        return vertices;
    }

    toAABB() {
        return this.aabb;
    }

    toPolygon() {
        let polygon = Polygon.Create({vertices: this.getVertices()});
        polygon = Object.assign(polygon, this);
        polygon.update();
        return polygon;
    }
}