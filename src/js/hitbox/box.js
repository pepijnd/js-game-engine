import Hitbox from "hitbox/hitbox";
import AABB from "hitbox/aabb";
import Polygon from "hitbox/polygon";

export default class Box extends Hitbox {
    constructor(options) {
        super(options);
        this.w = options.w;
        this.h = options.h;
        this.r = options.r;

        this.offset = {
            x: 0,
            y: 0
        };

        this.aabb = AABB.Create();
    }

    static Create(options = {}) {
        options = Object.assign({}, this.GetDefaultOptions(), options);
        return new this.prototype.constructor(options);
    }

    static GetDefaultOptions() {
        return Object.assign({}, super.GetDefaultOptions(), {w: 0, h: 0, r: 0});
    }

    center() {
        this.offset.x = this.w / 2;
        this.offset.y = this.h / 2;
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
        this.aabb.x = this.x - this.offset.x;
        this.aabb.y = this.y - this.offset.y;
    }

    checkCollision(other) {
        if (other instanceof AABB) {
            if (!this.aabb.checkCollision(other)) {
                return false;
            }
        }
        return this.toPolygon().checkCollision(other.toPolygon())
    }

    rotateVertice(vert) {
        let s = Math.sin(this.r);
        let c = Math.cos(this.r);

        let x = vert.x - this.offset.x;
        let y = vert.y - this.offset.y;

        let xnew = (x * c) - (y * s);
        let ynew = (x * s) + (y * c);

        xnew += this.offset.x;
        ynew += this.offset.y;

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

    toPolygon() {
        let polygon = Polygon.Create({vertices: this.getVertices()});
        polygon = Object.assign(polygon, this);
        return polygon;
    }
}