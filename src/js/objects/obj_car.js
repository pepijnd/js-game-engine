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

        this.speed = {x: 0, y: 0};
        this.accel = {x: 0, y: 0};

        this.direction = 0;

        this.depth = -100;

        this.position.x = 100;
        this.position.y = 100;


        this.hasCollision = false;

        this.hitbox = Box.Create();
        this.hitbox.w = this.sprite.width;
        this.hitbox.h = this.sprite.height;
        this.hitbox.center();

        controller.registerCollision(0, this);
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

        if (controller.inputController.checkDown(keycodes.arrow.up)) {
            this.accel.x = 0.05 * Math.cos(this.direction);
            this.accel.y = 0.05 * Math.sin(this.direction);
        } else if (controller.inputController.checkDown(keycodes.arrow.down)) {

        }


        if (controller.inputController.checkDown(keycodes.arrow.left)) {
            console.log(0.06 * ((this.speed.x * this.speed.y) / 25));
            this.direction -= 0.06 * ((this.speed.x*this.speed.x + this.speed.y*this.speed.y) / 25);
        } else if (controller.inputController.checkDown(keycodes.arrow.right)) {
            this.direction += 0.06 * ((this.speed.x*this.speed.x + this.speed.y*this.speed.y) / 25);
        }

        if (this.direction > Math.PI) {
            this.direction = -Math.PI;
        } else if (this.direction < -Math.PI) {
            this.direction = Math.PI;
        }

        this.speed.x += this.accel.x;
        this.speed.y += this.accel.y;

        let maxspeed = 5;
        if (((this.speed.x * this.speed.x)+(this.speed.y*this.speed.y)) > maxspeed*maxspeed) {
            this.speed.x = maxspeed * Math.cos(Math.atan2(this.speed.y , this.speed.x));
            this.speed.y = maxspeed * Math.sin(Math.atan2(this.speed.y , this.speed.x));
        }

        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        let vscale = 0.5;
        let vw = controller.context.width * vscale;
        let vh = controller.context.height * vscale;
        let vx = this.position.x - (vw/2);
        let vy = this.position.y - (vh/2);

        controller.context.viewport[1] = {
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

        let color = '#f430ff';
        let color2 = '#a430ff';
        if (this.hasCollision) {
            color = '#f4307f';
            color2 = '#a4307f';
        }

        if (this.sprite !== null) {

            let color = this.hasCollision ? '#ff0000' : '#000000';

            context.drawPolygon(this.hitbox.aabb.x - this.hitbox.aabb.offset.x,
                                this.hitbox.aabb.y - this.hitbox.aabb.offset.y,
                                this.hitbox.aabb.getVertices());

            context.drawPolygon(this.hitbox.x - this.hitbox.offset.x,
                                this.hitbox.y - this.hitbox.offset.y,
                                this.hitbox.getVertices(), color);
            context.drawText(this.hasCollision, 5, 17, 12);

            context.drawRect(this.hitbox.x - 2, this.hitbox.y - 2, 4, 4);

        }

    }
}