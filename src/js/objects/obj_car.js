import Obj from "object";
import keycodes from 'keycodes';
import Sprite from "sprite";
import SprCar from 'img/car.png'

export default class ObjCar extends Obj {
    evtCreate(controller) {
        this.sprite = Sprite.fromImage(controller.imageController.getImage(SprCar));
        this.sprite.scale = {
            x: 1/8,
            y: 1/8
        };
        this.sprite.center();

        this.speed = 0;
        this.direction = 0;

        this.depth = -100;

        controller.registerCollision(0, this);

        this.hasCollision = false;

        super.evtCreate();
    }

    evtBeginStep(controller) {
        super.evtBeginStep(controller);
        this.hasCollision = false;
    }

    evtCollision(controller, other) {
        this.hasCollision = true;
    }

    evtStep(controller) {
        super.evtStep(controller);

        this.speed *= 0.98;

        if (controller.inputController.checkDown(keycodes.arrow.up)) {
            this.speed += 0.05 * (0.5 * this.speed + 1);
        } else if (controller.inputController.checkDown(keycodes.arrow.down)) {
            if (this.speed > 0.06) {
                this.speed *= 0.98;
            } else {
                this.speed -= 0.05;
            }
        }


        if (controller.inputController.checkDown(keycodes.arrow.left)) {
            this.direction -= 0.06 * (this.speed / 5);
        } else if (controller.inputController.checkDown(keycodes.arrow.right)) {
            this.direction += 0.06 * (this.speed / 5);
        }

        if (this.direction > Math.PI * 2) {
            this.direction = 0;
        } else if (this.direction < 0) {
            this.direction = 2 * Math.PI;
        }

        let maxspeed = 5;
        if (this.speed > maxspeed) {
            this.speed -= 0.5**(2*(this.speed - maxspeed));
        }

        this.posistion.x += Math.cos(this.direction) * this.speed;
        this.posistion.y += Math.sin(this.direction) * this.speed;

        let vscale = 0.5;
        let vw = controller.context.width * vscale;
        let vh = controller.context.height * vscale;
        let vx = this.posistion.x - (vw/2);
        let vy = this.posistion.y - (vh/2);

        controller.context.viewport[0] = {
            x: vx,
            y: vy,
            w: vw,
            h: vh,
        };

        if (this.hitbox !== null) {
            let w = this.sprite.width;
            let h = this.sprite.height;
            let dir = this.direction;
            if (!(this.direction < Math.PI / 2 || (this.direction > Math.PI && this.direction < Math.PI * 3/2))) {
                w = this.sprite.height;
                h = this.sprite.width;
                dir = this.direction - Math.PI / 2;
            }
            this.hitbox.w = Math.abs((w * Math.cos(dir)) + (h * Math.sin(dir)));
            this.hitbox.h = Math.abs((w * Math.sin(dir)) + (h * Math.cos(dir)));
            this.hitbox.x = this.posistion.x - (this.hitbox.w / 2);
            this.hitbox.y = this.posistion.y - (this.hitbox.h / 2);
        }
    }

    evtDraw(controller, context) {

        context.vpi = 0;

        let color = '#f430ff';
        if (this.hasCollision) {
            color = '#f4307f'
        }

        if (this.sprite !== null) {
            context.drawRect(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h, color);

            context.drawSpriteRot(
                this.sprite,
                this.posistion.x, this.posistion.y,
                this.direction,
                this.sprite_index);
        }

    }
}