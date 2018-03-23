import Hitbox from "hitbox/hitbox";

export default class AABB extends Hitbox{
    constructor(options) {
        super(options);
        this.w = options.w;
        this.h = options.h;
    }

    static Create(options={}) {
        options = Object.assign({}, this.GetDefaultOptions(), options);
        return new this.prototype.constructor(options);
    }

    static GetDefaultOptions() {
        return Object.assign({}, super.GetDefaultOptions(), {w: 0, h: 0});
    }

    checkCollision(other) {
        return (this.x < other.x + other.w &&
                this.x + this.w > other.x &&
                this.y < other.y + other.h &&
                this.y + this.h > other.y &&
                super.checkCollision());
    }

    getVertices() {
        let vertices = [];
        vertices.push({x: 0, y: 0});
        vertices.push({x: this.w, y: 0});
        vertices.push({x: this.w, y: this.h});
        vertices.push({x: 0, y: this.h});
        return vertices;
    }
}