import Obj from "object";
import Sprite from "sprite";
import SprTheKid from "img/thekid.png";
import Keycodes from "keycodes";
import ObjSpike from "objects/obj_spike";
import AABB from "hitbox/aabb";
import ObjBlood from "objects/obj_blood";


export default class ObjKid extends Obj {
    evtCreate(controller) {
        this.sprite = Sprite.fromSpritesheet(
            controller.imageController.getImage(SprTheKid),
            24, 24, [[0, 0], [1, 0], [2, 0], [3, 0]], 0, 0);

        this.position.x = 99;
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
        this.djump = true;
        this.jumpRelease = 0.45;
        this.gravity = 0.44;
        this.maxSpeed = 3;
        this.maxVSpeed = 9;
        this.vspeed = 0;
        this.hspeed = 0;

        controller.registerHitbox(0, this);
        controller.registerCollision(0, this, ObjSpike);

        //super.evtCreate();
    }

    evtBeginStep(controller) {
        //this.collision = false
        this.hspeed = 0;
    }

    evtCollision(controller, other, hitbox) {
        this.collision = true;
        //console.log(other, hitbox)
    }

    evtStep(controller) {
        //super.evtStep(controller);

        if (controller.inputController.checkDown(Keycodes.arrow.left)) {
            this.hspeed -= 3;
            //this.sprite.scale.x = -1;
        }

        if (controller.inputController.checkDown(Keycodes.arrow.right)) {
            this.hspeed += 3;
            //this.sprite.scale.x = 1;
        }

        if (controller.inputController.checkDown(Keycodes.space)) {
            this.collision = false;
        }

        if (controller.inputController.checkPressed(82)) {
            for (let i=0; i<80; i++) {
                let blood = ObjBlood.Create(controller);
                blood.position.x = this.position.x - this.hitbox.offset.x;
                blood.position.y = this.position.y - this.hitbox.offset.y;
            }
        }

        if (this.vspeed > this.maxVSpeed) {
            this.vspeed = this.maxVSpeed;
        }

        this.checkCollision(controller);


        this.position.x += this.hspeed;
        this.position.y += this.vspeed;

        this.vspeed += this.gravity;

        let floor = controller.col_check_point("solid",
            this.hitbox.x - this.hitbox.offset.x,
            this.hitbox.y - this.hitbox.offset.y + 1,
            this.hitbox);
        if (floor) {
            this.djump = true;
        }
        if (controller.inputController.checkPressed(Keycodes.shift) && floor !== false) {
            this.vspeed = -this.jump;
            this.djump = true;
        }
        else if (controller.inputController.checkPressed(Keycodes.shift) && this.djump) {
            this.vspeed = -this.jump2;
            this.djump = false;
        }
        else if (controller.inputController.checkReleased(Keycodes.shift) && this.vspeed < 0) {
            this.vspeed *= this.jumpRelease;
        }

        this.hitbox.x = this.position.x;
        this.hitbox.y = this.position.y;
        this.hitbox.update();
    }

    checkCollision(controller) {
        let floor;
        let wall;

        floor = controller.col_check_point("solid",
            this.hitbox.x - this.hitbox.offset.x,
            this.hitbox.y - this.hitbox.offset.y + this.vspeed,
            this.hitbox);
        if (floor) {
            let c = 1;
            let check_pos = {
                x: this.hitbox.x - this.hitbox.offset.x,
                y: this.hitbox.y - this.hitbox.offset.y
            };
            if (this.vspeed > 0) {
                while (c < Math.abs(this.vspeed) && !controller.col_check_point("solid",
                    check_pos.x, check_pos.y + c, this.hitbox)) {
                    this.position.y += 1;
                    c++;
                }
            } else if (this.vspeed < 0) {
                while (c < Math.abs(this.vspeed) && !controller.col_check_point("solid",
                    check_pos.x, check_pos.y - c, this.hitbox)) {
                    this.position.y -= 1;
                    c++;
                }
            }

            this.vspeed = 0;
        }

        this.hitbox.x = this.position.x;
        this.hitbox.y = this.position.y;
        this.hitbox.update();

        wall = controller.col_check_point("solid",
            this.hitbox.x - this.hitbox.offset.x + this.hspeed,
            this.hitbox.y - this.hitbox.offset.y + this.vspeed,
            this.hitbox);
        if (wall) {
            let c = 1;
            let check_pos = {
                x: this.hitbox.x - this.hitbox.offset.x,
                y: this.hitbox.y - this.hitbox.offset.y + this.vspeed
            };
            if (this.hspeed > 0) {
                while (c < Math.abs(this.hspeed) && !controller.col_check_point("solid",
                    check_pos.x + c, check_pos.y, this.hitbox)) {
                    this.position.x += 1;
                    c++;
                }
            } else if (this.hspeed < 0) {
                while (c < Math.abs(this.hspeed) && !controller.col_check_point("solid",
                    check_pos.x - c, check_pos.y, this.hitbox)) {
                    this.position.x -= 1;
                    c++;
                }
            }
            this.hspeed = 0;
        }

        this.hitbox.x = this.position.x;
        this.hitbox.y = this.position.y;
        this.hitbox.update();
    }

    evtDraw(controller, context) {
        context.drawSprite(this.sprite, this.position.x, this.position.y);
        context.drawText(this.position.x + " " + this.position.y, 5, 17, 12);
    }
}