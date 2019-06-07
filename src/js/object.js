import AABB from "hitbox/aabb";
import EventTypes from 'engine/events';

export default class Obj {
    constructor(sprite = null) {
        this._id = null;
        this._created = false;
        this._deleted = false;
        this._controller = null;
        this._eventMap = {};
        this._eventsSetCheck = true;

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

    get created() {
        return this._created;
    }

    get controller() {
        return this._controller;
    }

    static Create(controller, sprite = null) {
        let obj = new this.prototype.constructor(sprite);
        obj._controller = controller;
        controller.objectController.register(obj);
        obj.init();
        return obj;
    }

    init() {
        this.setEvents();
        if (!this._eventsSetCheck) {
            throw Error('the SetEvents function of object ' + this.constructor.name + ' must be overridden');
        }
    }

    setEvents() {
        this._eventsSetCheck = false;
    }

    onEvent(event, func) {
        if (EventTypes.event_get(event) === EventTypes.UNKNOWN) {
            throw Error('Unknown event type');
        }

        if (!(event.id in this._eventMap)) {
            this._eventMap[event.id] = [];
        }
        this._eventMap[event.id].push(func);
    }

    hasEvent(event) {
        return (event.id in this._eventMap);
    }

    forEventMap(event, func) {
        for (let i = 0; i < this._eventMap[event.id].length; i++) {
            let eventCall = this._eventMap[event.id][i];
            func.call(this, eventCall);
        }
    }

    runEvent(event, eventData) {
        if (EventTypes.event_get(event) === EventTypes.UNKNOWN) {
            throw Error('Unknown event type');
        }
        if (this.hasEvent(event)) {
            if (event === EventTypes.CREATE) {
                if (this.created) return false;
            }
            this.forEventMap(event, (func) => {
                if (event === EventTypes.COLLISION) {
                    func.call(this, eventData.other, eventData.hitbox);
                } else if (event === EventTypes.DRAW) {
                    func.call(this, eventData.context);
                } else {
                    func.call(this);
                }
            });
            if (event === EventTypes.CREATE) this._created = true;
        }
        return true;
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
        //this.controller.deleteHitbox(true, this);
        //this.controller.deleteCollision(true, this);
        delete this.controller.objectController.objects[this.id];
    }
}