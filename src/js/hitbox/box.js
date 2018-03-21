import Hitbox from "hitbox/hitbox";
import AABB from 'hitbox/aabb';

export default class Box extends Hitbox{
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

    center() {
        this.offset.x = this.w / 2;
        this.offset.y = this.h / 2;
    }

    static Create(options={}) {
        Object.assign({}, this.GetDefaultOptions(), options);
        return new this.prototype.constructor(options);
    }

    static GetDefaultOptions() {
        return Object.assign({}, super.GetDefaultOptions(), {w: 0, h: 0, r:0});
    }

    update() {
        let w = this.w;
        let h = this.h;
        let r = this.r;
        if (!(this.r < Math.PI / 2 || (this.r > Math.PI && this.r < Math.PI * 3/2))) {
            w = this.h;
            h = this.w;
            r = this.r - Math.PI / 2;
        }
        this.aabb.w = Math.abs((w * Math.cos(r)) + (h * Math.sin(r)));
        this.aabb.h = Math.abs((w * Math.sin(r)) + (h * Math.cos(r)));
        this.aabb.x = this.x - (this.aabb.w / 2);
        this.aabb.y = this.y - (this.aabb.h / 2);
    }

    checkCollision(other) {
        return (this.aabb.checkCollision(other) &&

        )
    }
}