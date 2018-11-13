import Obj from "object";
import ObjSpike from "objects/obj_spike";
import ObjKid from "objects/obj_kid";
import ObjBlock from "objects/obj_block";
import Keycodes from "keycodes";

export default class ObjController extends Obj {
    evtCreate() {
        //this.car = ObjCar.Create(controller);
        //this.box = ObjBox.Create(controller);
        ObjKid.Create(this.controller);

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
        if (this.controller.inputController.mouse.click) {
            let block = ObjBlock.Create(this.controller);
            block.position.x = Math.round(this.controller.inputController.mouse.x / 16) * 16;
            block.position.y = Math.round(this.controller.inputController.mouse.y / 16) * 16;
        }


        if (this.controller.inputController.checkReleased(Keycodes.s)) {
            let spike = ObjSpike.Create(this.controller);
            spike.position.x = Math.round(this.controller.inputController.mouse.x / 16) * 16;
            spike.position.y = Math.round(this.controller.inputController.mouse.y / 16) * 16;
        }

        if (this.controller.inputController.checkReleased(Keycodes.backspace)) {
            let closest = null;
            let distance = -1;
            let origin = {
                x: Math.round(this.controller.inputController.mouse.x / 16) * 16,
                y: Math.round(this.controller.inputController.mouse.y / 16) * 16
            };
            this.controller.objectController.forAll((obj) => {
                let dist = Math.sqrt((origin.x - obj.position.x)**2 + (origin.y - obj.position.y)**2);
                if (distance === -1 || dist < distance) {
                    closest = obj;
                    distance = dist;
                }
            });
            if (distance < 48) {
                closest.delete();
            }
        }
    }

    evtDraw(context) {
    }
}
