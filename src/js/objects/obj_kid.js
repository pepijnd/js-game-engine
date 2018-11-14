import Obj from "object";
import Sprite from "sprite";
import SprTheKid from "img/thekid.png";
import Keycodes from "keycodes";
import ObjSpike from "objects/obj_spike";
import AABB from "hitbox/aabb";
import ObjBlood from "objects/obj_blood";

export default class ObjKid extends Obj {
    evtCreate() {
        this.sprite = Sprite.fromSpritesheet(
            this.controller.imageController.getImage(SprTheKid),
            24, 24, [[0, 0], [1, 0], [2, 0], [3, 0]], 0, 0);

        this.position.x = 100;
        this.position.y = 100;

        this.offset = {
            x: 8,
            y: 3
        };

        this.hitbox = AABB.Create({
            w: 11,
            h: 21,
            x: this.position.x + this.offset.x,
            y: this.position.y + this.offset.y
        });
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

        this.controller.registerHitbox(0, this);
        this.controller.registerCollision(0, this, ObjSpike);

        //super.evtCreate();
    }


    evtBeginStep() {
        this.hspeed = 0;
    }

    evtCollision(other, hitbox) {
        this.collision = true;
        //console.log(other, hitbox)
    }

    evtStep() {
        //super.evtStep(this.controller);

        if (this.controller.inputController.checkDown(Keycodes.arrow.left)) {
            this.hspeed -= 3;
            //this.sprite.scale.x = -1;
        }

        if (this.controller.inputController.checkDown(Keycodes.arrow.right)) {
            this.hspeed += 3;
            //this.sprite.scale.x = 1;
        }

        if (this.controller.inputController.checkDown(Keycodes.space)) {
            this.collision = false;
        }

        if (this.controller.inputController.checkPressed(82)) {
            for (let i = 0; i < 20; i++) {
                let blood = ObjBlood.Create(this.controller);
                blood.position.x = this.position.x + this.offset.x;
                blood.position.y = this.position.y + this.offset.y;
            }
        }

        if (this.vspeed > this.maxVSpeed) {
            this.vspeed = this.maxVSpeed;
        }

        this.checkCollision();

        this.position.x += this.hspeed;
        this.position.y += this.vspeed;

        this.vspeed += this.gravity;

        let floor = this.controller.col_check_point("solid",
            this.hitbox.x,
            this.hitbox.y + 1,
            this.hitbox);
        if (floor) {
            this.djump = true;
        }
        if (this.controller.inputController.checkPressed(Keycodes.shift) && floor !== false) {
            this.vspeed = -this.jump;
            this.djump = true;
        }
        else if (this.controller.inputController.checkPressed(Keycodes.shift) && this.djump) {
            this.vspeed = -this.jump2;
            this.djump = false;
        }
        else if (this.controller.inputController.checkReleased(Keycodes.shift) && this.vspeed < 0) {
            this.vspeed *= this.jumpRelease;
        }
    }

    checkCollision() {
        let floor;
        let wall;
        let direction = Math.sign(this.hspeed);

        floor = this.controller.col_check_point("solid",
            this.hitbox.x,
            this.hitbox.y + this.vspeed,
            this.hitbox);
        if (floor) {
            let c = 1;
            let check_pos = {
                x: this.hitbox.x,
                y: this.hitbox.y
            };
            if (this.vspeed > 0) {
                while (c < Math.abs(this.vspeed) && !this.controller.col_check_point("solid",
                    check_pos.x, check_pos.y + c, this.hitbox)) {
                    this.position.y += 1;
                    c++;
                }
            } else if (this.vspeed < 0) {
                while (c < Math.abs(this.vspeed) && !this.controller.col_check_point("solid",
                    check_pos.x, check_pos.y - c, this.hitbox)) {
                    this.position.y -= 1;
                    c++;
                }
            }

            this.vspeed = 0;
        }

        wall = this.controller.col_check_point("solid",
            this.hitbox.x + this.hspeed,
            this.hitbox.y + this.vspeed,
            this.hitbox);

        if (wall) {
            let c = 1;
            let dx = 0;
            let check_pos = {
                x: this.hitbox.x,
                y: this.hitbox.y + this.vspeed
            };
            if (this.hspeed > 0) {
                while (c < Math.abs(this.hspeed) && !this.controller.col_check_point("solid",
                    check_pos.x + c, check_pos.y, this.hitbox)) {
                    dx += 1;
                    c++;
                }
            } else if (this.hspeed < 0) {
                while (c < Math.abs(this.hspeed) && !this.controller.col_check_point("solid",
                    check_pos.x - c, check_pos.y, this.hitbox)) {
                    dx -= 1;
                    c++;
                }
            }
            this.hspeed = dx;
        }
        let maxhspeed = (direction * (this.maxSpeed - Math.abs(this.hspeed)));
        let maxclimb = maxhspeed * 3;
        if (floor && wall) {
            let dy = this.vspeed;
            let c = 0;
            for (c = 1; c <= Math.abs(maxclimb); c++) {
                if (!this.controller.col_check_point("solid",
                    this.hitbox.x + maxhspeed,
                    this.hitbox.y + this.vspeed - c,
                    this.hitbox)) {
                    dy = this.vspeed - c;
                    break;
                }
            }
            if (!this.controller.col_check_point("solid",
                this.hitbox.x + maxhspeed,
                this.hitbox.y + dy,
                this.hitbox)) {
                this.position.y += dy;
                this.hspeed = maxhspeed;
            }
        }
    }

    evtEndStep() {
        this.hitbox.x = this.position.x + this.offset.x;
        this.hitbox.y = this.position.y + this.offset.y;
        this.hitbox.update()
    }

    evtDraw(context) {
        context.drawSprite(this.sprite, this.position.x, this.position.y);
    }
}