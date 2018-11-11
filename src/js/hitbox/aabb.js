import Hitbox from "hitbox/hitbox";
import Polygon from "./polygon";

export default class AABB extends Hitbox {
    constructor(options) {
        super(options);
        this.w = options.w;
        this.h = options.h;
    }

    static Create(options = {}) {
        options = Object.assign({}, this.GetDefaultOptions(), options);
        return new this.prototype.constructor(options);
    }

    static GetDefaultOptions() {
        return Object.assign({}, super.GetDefaultOptions(), {w: 0, h: 0});
    }

    checkAABBCollision(other) {
        return (this.x < other.x + other.w &&
            this.x + this.w > other.x &&
            this.y < other.y + other.h &&
            this.y + this.h > other.y);
    }

    checkCollision(other) {
        if (other.constructor === AABB) {
            return this.checkAABBCollision(other)
        }
        else if (this.checkAABBCollision(other.toAABB())) {
            return this.toPolygon().checkCollision(other.toPolygon());
        }
        return false;
    }

    getVertices() {
        let vertices = [];
        vertices.push({x: 0, y: 0});
        vertices.push({x: this.w, y: 0});
        vertices.push({x: this.w, y: this.h});
        vertices.push({x: 0, y: this.h});
        return vertices;
    }

    toAABB() {
        return this;
    }

    toPolygon() {
        let polygon = Polygon.Create({vertices: this.getVertices()});
        polygon = Object.assign(polygon, this);
        polygon.update();
        return polygon;
    }
}