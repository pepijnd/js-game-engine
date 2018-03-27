import Obj from "object";
import Sprite from "sprite";
import SprSpikes from "img/spikes.png";
import Polygon from "hitbox/polygon";

export default class ObjSpike extends Obj {
    evtCreate(controller) {
        this.sprites = {
            up: Sprite.fromSpritesheet(
                controller.imageController.getImage(SprSpikes),
                32, 32, [[0, 0]], 0, 0),
            down: Sprite.fromSpritesheet(
                controller.imageController.getImage(SprSpikes),
                32, 32, [[1, 0]], 0, 0),
            left: Sprite.fromSpritesheet(
                controller.imageController.getImage(SprSpikes),
                32, 32, [[2, 0]], 0, 0),
            right: Sprite.fromSpritesheet(
                controller.imageController.getImage(SprSpikes),
                32, 32, [[3, 0]], 0, 0),
        };

        this.hitboxes = {
            up: Polygon.Create({
                vertices: [
                    {x: 0, y: 32}, {x: 32, y: 32}, {x: 16, y: 0}
                ]
            }),
            down: Polygon.Create({
                vertices: [
                    {x: 0, y: 0}, {x: 32, y: 0}, {x: 16, y: 32}
                ]
            }),
            left: Polygon.Create({
                vertices: [
                    {x: 32, y: 32}, {x: 0, y: 16}, {x: 32, y: 0}
                ]
            }),
            right: Polygon.Create({
                vertices: [
                    {x: 0, y: 0}, {x: 32, y: 16}, {x: 0, y: 32}
                ]
            }),
        };

        if (this.direction === undefined) this.direction = "up";

        this.sprite = this.sprites[this.direction];
        this.hitbox = this.hitboxes[this.direction];
        this.hitbox.x = this.position.x;
        this.hitbox.y = this.position.y;
        this.hitbox.update();

        controller.registerHitbox(0, this);

        //super.evtCreate();
    }

    evtCollision(controller, other) {
    }

    evtStep(controller) {
        //super.evtStep(controller);
    }

    evtDraw(controller, context) {
        context.drawSprite(this.sprite, this.position.x, this.position.y);
    }
}