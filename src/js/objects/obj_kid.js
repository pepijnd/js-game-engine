import Obj from "object";
import Sprite from "sprite";
import SprTheKid from "img/thekid.png";
import Keycodes from "keycodes";
import ObjSpike from "objects/obj_spike";
import ObjPlatform from "objects/obj_platform";
import AABB from "hitbox/aabb";
import ObjBlood from "objects/obj_blood";

export default class ObjKid extends Obj {
    evtCreate() {
        this.sprite = Sprite.fromSpritesheet(
            this.controller.imageController.getImage(SprTheKid),
            24, 24, [[0, 0], [1, 0], [2, 0], [3, 0]], 0, 0);

        this.position.x = 100;
        this.position.y = 407;

        this.offset = {
            x: 8,
            y: 3
        };

        this.hitbox = AABB.Create({
            w: 11,
            h: 21,
            x: this.position.x,
            y: this.position.y
        });
        this.hitbox.update();

        this.depth = -50;

        this.jump = 8.5;
        this.jump2 = 7;
        this.djump = true;
        this.jumpRelease = 0.45;
        this.gravity = 0.44;
        this.maxSpeed = 3;
        this.maxVSpeed = 9;
        this.vspeed = 0;
        this.hspeed = 0;
        this.platform = false;

        this.controller.registerHitbox(0, this);
        this.controller.registerCollision(0, this, ObjSpike);

        this.controller.registerHitbox("platform", this);
        this.controller.registerCollision("platform", this, ObjPlatform);

        //super.evtCreate();
    }


    evtBeginStep() {
        this.hspeed = 0;
        this.platform = false;
    }

    evtCollision(other, hitbox) {
        /*        this.collision = true;
                if (hitbox.layer === "platform") {
                    if (this.position.y - this.vspeed/2 + this.sprite.height/2 + 3 <= other.position.y) {
                        this.position.y = other.position.y - this.sprite.height - 1;
                        if (other.vspeed !== undefined && other.vspeed >= 0) {
                            this.vspeed = other.vspeed;
                        } else {
                            this.vspeed = 0;
                        }
                        this.djump = true;
                        this.platform = true;
                    }
                }*/
    }

    evtStep() {
        //super.evtStep(this.controller);

        if (this.controller.inputController.checkDown(Keycodes.arrow.left)) {
            this.hspeed = -3;
            this.sprite.scale.x = -1;
        }

        if (this.controller.inputController.checkDown(Keycodes.arrow.right)) {
            this.hspeed = 3;
            this.sprite.scale.x = 1;
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


        this.vspeed += this.gravity;
        if (this.placeFree('solid', this.position.x, this.position.y + 1)) {
            if (this.vspeed > this.maxVSpeed) {
                this.vspeed = this.maxVSpeed;
            }
        }

        if (this.controller.inputController.checkPressed(Keycodes.shift) && !this.placeFree('solid', this.position.x, this.position.y + 1)) {
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

        if (!this.placeFree('solid', this.position.x + this.hspeed, this.position.y)) {
            if (this.hspeed <= 0) {
                this.moveContact('solid', Math.PI, Math.abs(this.hspeed));
            }
            else if (this.hspeed > 0) {
                this.moveContact('solid', 0, Math.abs(this.hspeed));
            }
            this.hspeed = 0;
        }

        if (!this.placeFree('solid', this.position.x, this.position.y + this.vspeed)) {
            if (this.vspeed <= 0) {
                this.moveContact('solid', Math.PI * 1.5, Math.abs(this.vspeed))
            }
            else if (this.vspeed > 0) {
                this.moveContact('solid', Math.PI * 0.5, Math.abs(this.vspeed));
                this.djump = true;
            }
            this.vspeed = 0;
        }

        if (!this.placeFree('solid', this.position.x + this.hspeed, this.position.y + this.vspeed)) {
            this.hspeed = 0;
        }
    }


    evtEndStep() {
        this.position.x += this.hspeed;
        this.position.y += this.vspeed;

        this.hitbox.x = this.position.x;
        this.hitbox.y = this.position.y;
        this.hitbox.update();
    }

    evtDraw(context) {
        if (this.sprite.scale.x < 0) {
            context.drawSprite(this.sprite, this.position.x + this.sprite.width - 5, this.position.y - this.offset.y);
        } else {
            context.drawSprite(this.sprite, this.position.x - this.offset.x, this.position.y - this.offset.y);
        }
    }
}