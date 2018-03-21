import Hitbox from "hitbox/hitbox";

export default class AABB extends Hitbox{
    constructor(options) {
        super(options);
        this.w = options.w;
        this.h = options.h;
    }

    static Create(options={}) {
        Object.assign({}, this.GetDefaultOptions(), options);
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
}