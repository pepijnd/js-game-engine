import Obj from 'object';
import Sprite from 'sprite';
import SprBox from 'img/box.png'

export default class ObjBox extends Obj {
    evtCreate(controller) {
        this.sprite = Sprite.fromImage(controller.imageController.getImage(SprBox));
        this.sprite.center();

        this.posistion.x = 100;
        this.posistion.y = 100;
        controller.registerCollision(0, this);

        super.evtCreate();
    }

    evtStep(controller) {
        super.evtStep(controller);
    }

    evtDraw(controller, context) {
        super.evtDraw(controller, context);

        context.drawRect(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h, '#f430ff');
    }
}