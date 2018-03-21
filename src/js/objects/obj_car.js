import Obj from "object";
import keycodes from 'keycodes';
import Sprite from "sprite";
import SprCar from 'img/car.png'
import Box from 'hitbox/box';

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

        this.hitbox = Box.Create();
        this.hitbox.w = this.sprite.width;
        this.hitbox.h = this.sprite.height;
        this.hitbox.center();
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

        this.position.x += Math.cos(this.direction) * this.speed;
        this.position.y += Math.sin(this.direction) * this.speed;

        let vscale = 0.5;
        let vw = controller.context.width * vscale;
        let vh = controller.context.height * vscale;
        let vx = this.position.x - (vw/2);
        let vy = this.position.y - (vh/2);

        controller.context.viewport[0] = {
            x: vx,
            y: vy,
            w: vw,
            h: vh,
        };

        this.hitbox.r = this.direction;
        this.hitbox.x = this.position.x;
        this.hitbox.y = this.position.y;
        this.hitbox.update();
    }

    evtDraw(controller, context) {

        context.vpi = 0;

        let color = '#f430ff';
        let color2 = '#a430ff';
        if (this.hasCollision) {
            color = '#f4307f'
            color2 = '#a4307f';
        }

        if (this.sprite !== null) {
            context.drawRect(this.hitbox.aabb.x, this.hitbox.aabb.y, this.hitbox.aabb.w, this.hitbox.aabb.h, color);
            context.drawRectRot(this.hitbox.x - this.hitbox.offset.x, this.hitbox.y - this.hitbox.offset.y, this.hitbox.w, this.hitbox.h, this.hitbox.r, color2);

            context.drawSpriteRot(
                this.sprite,
                this.position.x, this.position.y,
                this.direction,
                this.sprite_index);
        }

    }
}