import Obj from "object";
import Sprite from "sprite";
import SprBlock from "img/block.png"
import AABB from "hitbox/aabb";

export default class ObjBlock extends Obj {
    evtCreate(controller) {
        this.sprite = Sprite.fromImage(controller.imageController.getImage(SprBlock));
        this.hitbox = AABB.Create();
        this.hitbox.w = this.sprite.width;
        this.hitbox.h = this.sprite.height;
        this.hitbox.x = this.position.x;
        this.hitbox.y = this.position.y;
        this.hitbox.update();

        controller.registerHitbox("solid", this);
    }

    evtStep(controller) {
        //super.evtStep(controller);

    }

    evtDraw(controller, context) {
        context.drawSprite(this.sprite, this.position.x, this.position.y);
    }
}