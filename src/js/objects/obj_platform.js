import Obj from "object";
import Sprite from "sprite";
import SprPlatform from "img/platform.png"
import AABB from "hitbox/aabb";

export default class ObjPlatform extends Obj {
    evtCreate() {
        this.sprite = Sprite.fromImage(this.controller.imageController.getImage(SprPlatform));
        this.hitbox = AABB.Create();
        this.hitbox.w = this.sprite.width;
        this.hitbox.h = this.sprite.height;
        this.hitbox.x = this.position.x;
        this.hitbox.y = this.position.y;
        this.hitbox.update();

        this.controller.registerHitbox("platform", this);
        this.controller.registerHitbox("block", this);
    }

    evtStep() {
        //super.evtStep(controller);

    }

    evtDraw(context) {
        context.drawSprite(this.sprite, this.position.x, this.position.y);
    }
}