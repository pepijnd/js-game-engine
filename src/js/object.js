import AABB from "hitbox/aabb";

export default class Obj {
    constructor(sprite = null) {
        this._id = null;
        this._created = false;

        this.sprite = sprite;
        this.sprite_index = 0;
        this.sprite_speed = 1;

        this.depth = 0;

        this.position = {
            x: 0,
            y: 0,
        };

        this.hitbox = null;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    static Create(controller, sprite = null) {
        let obj = new this.prototype.constructor(sprite);
        controller.objectController.register(obj);
        controller.newObjects.push(obj);
        return obj;
    }

    evtCreate(controller) {
        this.hitbox = (this.sprite !== null) ? AABB.Create({w: this.sprite.width, h: this.sprite.height}) : null;
    }

    evtBeginStep(controller) {

    }

    evtStep(controller) {
        if (this.sprite !== null) {
            let index_max = this.sprite.sprite_positions.length;
            this.sprite_index = Math.floor(controller.ticks * this.sprite_speed) % index_max;
        }
        if (this.hitbox !== null) {
            this.hitbox.x = this.position.x;
            this.hitbox.y = this.position.y;
            if (this.sprite !== null) {
                this.hitbox.x -= this.sprite.offset.x * this.sprite.ratio.x;
                this.hitbox.y -= this.sprite.offset.y * this.sprite.ratio.y;
            }
        }
    }

    evtEndStep() {

    }

    evtDraw(controller, context) {
        this.vpi = 0;
        if (this.sprite !== null) {
            context.drawSprite(this.sprite, this.position.x, this.position.y, this.sprite_index);
        }
    }

    evtCollision(controller, other) {

    }
}