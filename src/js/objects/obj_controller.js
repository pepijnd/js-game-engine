import Obj from "object";
import ObjSpike from "objects/obj_spike";
import ObjKid from "objects/obj_kid";
import ObjBlock from "objects/obj_block";
import Keycodes from "keycodes";

export default class ObjController extends Obj {
    evtCreate(controller) {
        //this.car = ObjCar.Create(controller);
        //this.box = ObjBox.Create(controller);
        ObjKid.Create(controller);

        for (let i = 1; i < controller.context.width / 32 - 1; i++) {
            let floor = ObjBlock.Create(controller);
            floor.position.x = i * 32;
            floor.position.y = controller.context.height - 32;

            let ceil = ObjBlock.Create(controller);
            ceil.position.x = i*32;
            ceil.position.y = 0;
        }

        for (let j=0; j < controller.context.height / 32; j++) {
            let left = ObjBlock.Create(controller);
            left.position.x = 0;
            left.position.y = j*32;

            let right = ObjBlock.Create(controller);
            right.position.x = controller.context.width - 32;
            right.position.y = j*32;
        }

    }

    evtStep(controller) {
        if (controller.inputController.mouse.click) {
            let block = ObjBlock.Create(controller);
            block.position.x = Math.round(controller.inputController.mouse.x/16)*16;
            block.position.y = Math.round(controller.inputController.mouse.y/16)*16;
        }


        if (controller.inputController.checkReleased(Keycodes.s)) {
            let spike = ObjSpike.Create(controller);
            spike.position.x = Math.round(controller.inputController.mouse.x/16)*16;
            spike.position.y = Math.round(controller.inputController.mouse.y/16)*16;
        }
    }

    evtDraw(controller, context) {
    }
}
