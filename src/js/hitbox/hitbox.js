export default class Hitbox {
    constructor(options) {
        this.x = options.x;
        this.y = options.y;

        this.offset = options.offset;
    }

    static Create(options = {}) {
        options.push(this.GetDefaultOptions());
        return new this.prototype.constructor(options);
    }

    static GetDefaultOptions() {
        return {x: 0, y: 0, offset: {x: 0, y: 0}};
    }

    checkCollision(other) {
        throw new Error("use of base hitbox");
    }

    getVertices() {
        return [];
    }

    toPolygon() {
        throw new Error("use of base hitbox");
    }

    update() {
    }
}