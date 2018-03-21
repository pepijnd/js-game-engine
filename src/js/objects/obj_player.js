import Obj from "js/object";
import keycodes from 'keycodes';
import Sprite from "sprite";
import SprSampleSS from 'img/spritesheet.png'

export default class ObjPlayer extends Obj {
    evtCreate(controller) {
        this.sprite_speed = 1;

        this.vspeed = 0;
        this.doublejump = 2;

        this.spr_player_left = Sprite.fromSpritesheet(
            controller.imageController.getImage(SprSampleSS), 17, 28,
            [[0, 0], [1, 0], [2, 0]],
            0, 0,
            0, 0);
        this.spr_player_right = Sprite.fromSpritesheet(
            controller.imageController.getImage(SprSampleSS), 17, 28,
            [[0, 0], [1, 0], [2, 0]],
            0, 29,
            0, 0);

        this.sprite = this.spr_player_right;
    }

    evtStep(controller) {
        super.evtStep(controller);
        this.sprite_speed = 0.2;
        if(controller.inputController.checkDown(keycodes.arrow.left)) {
            this.posistion.x -= 3;
            this.sprite = this.spr_player_left;
        }
        else if(controller.inputController.checkDown(keycodes.arrow.right)) {
            this.posistion.x += 3;
            this.sprite = this.spr_player_right;
        } else {
            this.sprite_speed = 0;
            this.sprite_index = 0;
        }
        if(controller.inputController.checkPressed(keycodes.space)) {
            if (this.doublejump === 2) {
                this.vspeed = -6;
                this.doublejump = 1;
            } else if (this.doublejump === 1) {
                this.vspeed = -5;
                this.doublejump = 0;
            }
        }

        this.posistion.y += this.vspeed;
        this.vspeed += 0.3;

        if (this.posistion.y > 500 - this.sprite.sprite_height) {
            this.posistion.y = 500 - this.sprite.sprite_height;
            this.doublejump = 2;
        }
    }

    evtDraw(controller, context) {
        super.evtDraw(controller, context);
        context.drawLine(0, 500, context.width, 500);
    }
}