import AABB from "hitbox/aabb";

export default class Obj {
    constructor(sprite = null) {
        this._id = null;
        this._created = false;
        this._deleted = false;
        this._controller = null;

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

    get controller() {
        return this._controller;
    }

    static Create(controller, sprite = null) {
        let obj = new this.prototype.constructor(sprite);
        controller.objectController.register(obj);
        return obj;
    }

    evtCreate() {
        this.hitbox = (this.sprite !== null) ? AABB.Create({w: this.sprite.width, h: this.sprite.height}) : null;
    }

    evtBeginStep() {

    }

    evtStep() {
        if (this.sprite !== null) {
            let index_max = this.sprite.sprite_positions.length;
            this.sprite_index = Math.floor(this.controller.ticks * this.sprite_speed) % index_max;
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

    evtDraw(context) {
        this.vpi = 0;
        if (this.sprite !== null) {
            context.drawSprite(this.sprite, this.position.x, this.position.y, this.sprite_index);
        }
    }

    evtCollision(other) {

    }

    get deleted() {
        return this._deleted;
    }

    delete() {
        delete this.controller.objectController.objects[this.id];
        let collisionMap = this.controller.collisionMap;
        for (let layer in collisionMap) {
            if (!collisionMap.hasOwnProperty(layer)) continue;
            for (let object in collisionMap[layer]) {
                if (!collisionMap[layer].hasOwnProperty(object)) continue;
                if (object.id === this.id) {
                    delete collisionMap[layer][object];
                }
            }
        }
        let collisionMapEvents = this.controller.collisionMapEvents;
        for (let layer in collisionMapEvents) {
            if (!collisionMapEvents.hasOwnProperty(layer)) continue;
            if (collisionMapEvents[layer][this.id]) {
                delete collisionMapEvents[layer][this.id];
                break;
            }
        }
        this._deleted = true;
    }
}