import Obj from "object";
import Sprite from "sprite";
import SprBallRed from "img/ball_red.png"
import SprBallYellow from "img/ball_yellow.png"
import Circle from "hitbox/circle";

export default class ObjBall extends Obj {
    evtCreate() {
        this.sprite = Sprite.fromImage(this.controller.imageController.getImage(SprBallRed));
        this.hitbox = Circle.Create({
            r: this.sprite.width*5,
            x: this.position.x,
            y: this.position.y,
            res: 64
        });
        this.controller.registerHitbox("solid", this);
    }

    evtStep() {
        //super.evtStep(controller);

    }

    evtEndStep() {
        this.hitbox.x = this.position.x;
        this.hitbox.y = this.position.y;
        this.hitbox.update();
    }

    evtDraw(context) {
        //context.drawSprite(this.sprite, this.position.x, this.position.y);
        context.drawPolygon(this.position.x, this.position.y, this.hitbox.getVertices(), "#ff0000")
    }
}