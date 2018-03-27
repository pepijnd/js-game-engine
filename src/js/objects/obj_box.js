import Obj from "object";
import Sprite from "sprite";
import SprBox from "img/box.png"
import Box from "hitbox/box";

export default class ObjBox extends Obj {
    evtCreate(controller) {
        this.sprite = Sprite.fromImage(controller.imageController.getImage(SprBox));
        this.sprite.center();

        this.position.x = 300;
        this.position.y = 100;

        this.direction = Math.PI / 3;

        this.hitbox = Box.Create();

        controller.registerHitbox(0, this);

        //super.evtCreate();
    }

    evtStep(controller) {
        //super.evtStep(controller);
        this.hitbox.x = this.position.x;
        this.hitbox.y = this.position.y;
        this.hitbox.w = this.sprite.width;
        this.hitbox.h = this.sprite.height;
        this.hitbox.r = this.direction;
        this.hitbox.center();
        this.hitbox.update();
    }

    evtDraw(controller, context) {
        //context.drawSpriteRot(this.sprite, this.position.x, this.position.y, this.direction);
        context.drawPolygon(this.hitbox.x - this.hitbox.offset.x,
            this.hitbox.y - this.hitbox.offset.y,
            this.hitbox.getVertices());
        context.drawPolygon(this.hitbox.aabb.x - this.hitbox.aabb.offset.x,
            this.hitbox.aabb.y - this.hitbox.aabb.offset.y,
            this.hitbox.aabb.getVertices());
        context.drawRect(this.hitbox.x - 2, this.hitbox.y - 2, 4, 4);
    }
}