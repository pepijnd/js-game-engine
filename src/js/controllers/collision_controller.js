import EventType from 'engine/events';

export default class CollisionController {
    constructor(controller) {
        this.controller = controller;

        this.collisionMap = {};
        this.collisionMapEvents = {};
    }

    checkCollisionEvents() {
        for (let layer in this.collisionMap) {
            if (!this.collisionMap.hasOwnProperty(layer)) continue;
            let collision_layer = this.collisionMap[layer];
            for (let i = 0; i < collision_layer.length; i++) {
                for (let j = 0; j < collision_layer.length; j++) {
                    if (collision_layer[i] !== collision_layer[j]) {
                        if (this.collisionMapEvents[layer] !== undefined &&
                            collision_layer[i].obj.id in this.collisionMapEvents[layer]) {
                            let event_map = this.collisionMapEvents[layer][collision_layer[i].obj.id];
                            for (let k = 0; k < event_map.length; k++) {
                                if (event_map[k] === true || collision_layer[j].obj instanceof event_map[k]) {
                                    let a = collision_layer[i].hitbox ?
                                        collision_layer[i].hitbox : collision_layer[i].obj.hitbox;
                                    let b = collision_layer[j].hitbox ?
                                        collision_layer[j].hitbox : collision_layer[j].obj.hitbox;
                                    if (a.checkCollision(b)) {
                                        collision_layer[i].obj.runEvent(EventType.COLLISION, {
                                                other: collision_layer[j].obj,
                                                hitbox: {layer: layer, self: a, other: b}
                                            }
                                        );
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    hitboxCheckCollision(layer, hitbox, source = false) {
        layer = Array.isArray(layer) ? layer : [layer];
        for (let i=0; i<layer.length; i++) {
            let l = layer[i];
            if (l in this.collisionMap) {
                for (let i = 0; i < this.collisionMap[l].length; i++) {
                    let col = this.collisionMap[l][i];
                    if (col.hitbox !== false) {
                        if (hitbox !== col.hitbox &&
                            col.hitbox.checkCollision(hitbox)) return col;
                    } else {
                        if ((!source || source !== col.obj) &&
                            hitbox !== col.obj.hitbox &&
                            col.obj.hitbox.checkCollision(hitbox)) return col;
                    }
                }
            }
        }
        return false;
    }

    registerHitbox(layer, obj, hitbox = false) {
        if (!(layer in this.collisionMap)) {
            this.collisionMap[layer] = [];
        }
        this.collisionMap[layer].push({obj: obj, hitbox: hitbox});
    }

    deleteHitbox(layer, obj, hitbox = false) {
        if (layer === true) {
            for (let i in this.collisionMap) {
                if (!this.collisionMap.hasOwnProperty(i)) continue;
                this.deleteHitbox(i, obj, hitbox);
            }
        }
        else {
            if (!(layer in this.collisionMap)) {
                throw Error();
            }
            this.collisionMap[layer] = this.collisionMap[layer].filter((item) => {
                return !(item.obj === obj && (!hitbox || obj.hitbox === hitbox))
            });
        }
    }

    registerCollision(layer, object, type) {
        if (!(layer in this.collisionMapEvents)) {
            this.collisionMapEvents[layer] = {};
        }
        if (!(object.id in this.collisionMapEvents[layer])) {
            this.collisionMapEvents[layer][object.id] = []
        }
        this.collisionMapEvents[layer][object.id].push(type);
    }

    deleteCollision(layer, object, type = false) {
        if (layer === true) {
            for (let i in this.collisionMapEvents) {
                if (!this.collisionMapEvents.hasOwnProperty(i)) continue;
                this.deleteCollision(i, object, type);
            }
        }
        else {
            if (!(layer in this.collisionMapEvents)) {
                throw Error();
            }
            if (type) {
                let index = this.collisionMapEvents[layer][object.id].indexOf(type);
                if (index !== -1) {
                    this.collisionMapEvents[layer][object.id].slice(index, 1)
                }
            } else {
                if (object.id in this.collisionMapEvents[layer]) {
                    delete this.collisionMapEvents[layer][object.id];
                }
            }
        }
    }
}