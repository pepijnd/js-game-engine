import Obj from "object";
import ObjSpike from "objects/obj_spike";
import ObjKid from "objects/obj_kid";
import ObjBlock from "objects/obj_block";
import ObjBall from "objects/obj_ball";
import ObjPlatform from "objects/obj_platform";
import Keycodes from "keycodes";

export default class ObjController extends Obj {
    evtCreate() {
        //this.car = ObjCar.Create(controller);
        //this.box = ObjBox.Create(controller);
        ObjKid.Create(this.controller);

        this.depth = -100;

        this.grid = false;
        this.gridSize = 32;

        for (let i = 1; i < this.controller.context.width / 32 - 1; i++) {
            let floor = ObjBlock.Create(this.controller);
            floor.position.x = i * 32;
            floor.position.y = this.controller.context.height - 32;

            let ceil = ObjBlock.Create(this.controller);
            ceil.position.x = i * 32;
            ceil.position.y = 0;
        }

        for (let j = 0; j < this.controller.context.height / 32; j++) {
            let left = ObjBlock.Create(this.controller);
            left.position.x = 0;
            left.position.y = j * 32;

            let right = ObjBlock.Create(this.controller);
            right.position.x = this.controller.context.width - 32;
            right.position.y = j * 32;
        }

    }

    evtStep() {
        let mouse_x = Math.floor(this.controller.inputController.mouse.x / this.gridSize) * this.gridSize;
        let mouse_y = Math.floor(this.controller.inputController.mouse.y / this.gridSize) * this.gridSize;

        if (this.controller.inputController.mouse.click) {
            let block = ObjBlock.Create(this.controller);
            block.position.x = mouse_x;
            block.position.y = mouse_y;
        }


        if (this.controller.inputController.checkReleased(Keycodes.s)) {
            let spike = ObjSpike.Create(this.controller);
            spike.position.x = mouse_x;
            spike.position.y = mouse_y;
        }

        if (this.controller.inputController.checkReleased(Keycodes.b)) {
            let ball = ObjBall.Create(this.controller);
            ball.position.x = mouse_x;
            ball.position.y = mouse_y;
        }


        if (this.controller.inputController.checkReleased(Keycodes.p)) {
            let platoform = ObjPlatform.Create(this.controller);
            platoform.position.x = mouse_x;
            platoform.position.y = mouse_y;
        }

        if (this.controller.inputController.checkReleased(Keycodes.backspace)) {
            let closest = null;
            let distance = -1;
            let origin = {
                x: mouse_x,
                y: mouse_y
            };
            this.controller.objectController.forAll((obj) => {
                let dist = Math.sqrt((origin.x - obj.position.x)**2 + (origin.y - obj.position.y)**2);
                if (distance === -1 || dist < distance) {
                    closest = obj;
                    distance = dist;
                }
            });
            if (distance < this.gridSize) {
                closest.delete();
            }
        }

        if (this.controller.inputController.checkPressed(Keycodes.zero)) {
            this.grid = !this.grid;
        }

        if (this.controller.inputController.checkPressed(Keycodes.minus)) {
            this.gridSize /= 2;
        }

        if (this.controller.inputController.checkPressed(Keycodes.plus)) {
            this.gridSize *= 2;
        }

    }

    evtDraw(context) {
        if (this.grid) {
            for (let xx=this.gridSize; xx<context.width; xx+=this.gridSize) {
                context.drawLine(xx, 0, xx, context.height, "#000000");
            }
            for (let yy=this.gridSize; yy<context.height; yy+=this.gridSize) {
                context.drawLine(0, yy, context.width, yy, "#000000");
            }
        }
    }
}
