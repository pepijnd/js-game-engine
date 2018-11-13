import Obj from "object";
import AABB from "hitbox/aabb";
import ObjBlock from "objects/obj_block";


export default class ObjKid extends Obj {
    evtCreate(controller) {
        this.offset = {
            x: 1,
            y: 1
        };

        this.hitbox = AABB.Create({
            w: 2,
            h: 2,
            x: this.position.x + this.offset.x,
            y: this.position.y + this.offset.y
        });
        this.hitbox.update();

        this.collision = false;

        this.hspeed = 8*(Math.random()-0.5);
        this.vspeed = 8*(Math.random()-0.8);

        this.counter = 0;

        this.gravity = 0.44;

        controller.registerHitbox("blood", this);
        controller.registerCollision("blood", this, ObjBlock);
    }

    evtCollision(other, hitbox) {
        this.collision = true;
        this.controller.deleteHitbox("blood", this);
        this.controller.deleteCollision("blood", this);
    }

    evtStep() {
        if (!this.collision) {
            this.vspeed += this.gravity;
            this.hspeed *= 0.98;
            this.vspeed *= 0.98;

            this.position.x += this.hspeed;
            this.position.y += this.vspeed;
        }
        if (this.counter > 200) {
            this.delete();
        }
        else this.counter += 1;
    }

    evtEndStep() {
        this.hitbox.x = this.position.x + this.offset.x;
        this.hitbox.y = this.position.y + this.offset.y;
        this.hitbox.update();
    }

    evtDraw(controller, context) {
        context.drawRect(this.position.x-1, this.position.y-1, 2, 2, "#ff0000");
    }
}