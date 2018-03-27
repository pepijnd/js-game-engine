import Obj from "object";
import Sprite from "sprite";
import SprTheKid from "img/thekid.png";
import Keycodes from "keycodes";
import ObjSpike from "objects/obj_spike";
import AABB from "../hitbox/aabb";


export default class ObjKid extends Obj {
    evtCreate(controller) {
        this.sprite = Sprite.fromSpritesheet(
            controller.imageController.getImage(SprTheKid),
            24, 24, [[0, 0], [1, 0], [2, 0], [3, 0]], 0, 0);

        this.position.x = 100;
        this.position.y = 100;

        this.hitbox = AABB.Create();
        this.hitbox.w = 11;
        this.hitbox.h = 21;
        this.hitbox.x = this.position.x;
        this.hitbox.y = this.position.y;
        this.hitbox.offset.x = -8;
        this.hitbox.offset.y = -3;
        this.hitbox.update();

        this.jump = 8.5;
        this.jump2 = 7;
        this.djump = false;
        this.jumpRelease = 0.45;
        this.gravity = 0.4;
        this.maxSpeed = 3;
        this.maxVSpeed = 9;
        this.vspeed = 0;

        controller.registerHitbox(0, this);
        controller.registerCollision(0, this, ObjSpike);

        //super.evtCreate();
    }

    evtBeginStep(controller) {
        //this.collision = false
    }

    evtCollision(controller, other, hitbox) {
        this.collision = true;
    }

    evtStep(controller) {
        //super.evtStep(controller);

        if (controller.inputController.checkDown(Keycodes.arrow.left)) {
            this.position.x -= 3;
            //this.sprite.scale.x = -1;
        }

        if (controller.inputController.checkDown(Keycodes.space)) {
            this.collision = false;
        }

        if (controller.inputController.checkDown(Keycodes.arrow.right)) {
            this.position.x += 3;
            //this.sprite.scale.x = 1;
        }

        this.vspeed += this.gravity;

        if (this.vspeed > this.maxVSpeed) {
            this.vspeed = this.maxVSpeed;
        }

        let floor;
        floor = controller.col_check_point("solid",
            this.hitbox.x - this.hitbox.offset.x,
            this.hitbox.y - this.hitbox.offset.y + this.vspeed,
            this.hitbox);
        if (floor !== false) {
            if (this.vspeed > 0) {
                this.vspeed = 0;
                let hb = floor.hitbox ? floor.hitbox : floor.obj.hitbox;
                this.position.y = hb.y - (this.hitbox.h - this.hitbox.offset.y);
            }
            this.vspeed = 0;
        }

        floor = controller.col_check_point("solid",
            this.hitbox.x - this.hitbox.offset.x,
            this.hitbox.y - this.hitbox.offset.y + 1,
            this.hitbox);
        console.log(floor);
        if (controller.inputController.checkPressed(Keycodes.shift) && floor !== false) {
            this.vspeed = -this.jump;
            this.djump = true;
        }
        else if (controller.inputController.checkPressed(Keycodes.shift) && this.djump) {
            this.vspeed = -this.jump2;
            this.djump = false;
        }
        else if (controller.inputController.checlReleased(Keycodes.shift) && this.vspeed < 0) {
            this.vspeed *= this.jumpRelease;
        }

        this.position.y += this.vspeed;

        this.hitbox.x = this.position.x;
        this.hitbox.y = this.position.y;
        this.hitbox.update();
    }

    evtDraw(controller, context) {
        context.drawSprite(this.sprite, this.position.x, this.position.y);
    }
}