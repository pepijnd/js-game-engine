import Obj from "object";

Obj.prototype.placeCollision = function (layer, x, y, hitbox = false) {
    let hb = hitbox || Object.assign(Object.create(Object.getPrototypeOf(this.hitbox)), this.hitbox);
    hb.x = x;
    hb.y = y;
    hb.update();
    return this.controller.hitboxCheckCollision(layer, hb, this);
};

Obj.prototype.placeFree = function (layer, x, y, hitbox=false) {
    return !this.placeCollision(layer, x, y, hitbox);
};

Obj.prototype.moveContact = function (layer, direction, max, hitbox) {
    let i = 0;
    let xx = Math.cos(direction), yy = Math.sin(direction);

    while (Math.sqrt((xx * i) ** 2) + Math.sqrt((yy * i) ** 2) < max) {
        if (this.placeFree(layer, this.position.x + xx*(i+1), this.position.y + yy*(i+1), hitbox)) {
            i++;
        } else break;
    }

    this.position.x += xx*i;
    this.position.y += yy*i;
};

