import Obj from "object";
import ObjSpike from "objects/obj_spike";
import ObjKid from "objects/obj_kid";
import ObjBlock from "objects/obj_block";

export default class ObjController extends Obj {
    evtCreate(controller) {
        //this.car = ObjCar.Create(controller);
        //this.box = ObjBox.Create(controller);
        for (let i = 0; i < controller.context.width / 32; i++) {
            let block = ObjBlock.Create(controller);
            block.position.x = i * 32;
            block.position.y = controller.context.height - 32;
        }

        let spike = ObjSpike.Create(controller);
        spike.position.x = 400;
        spike.position.y = 400 - 8;
        spike = ObjSpike.Create(controller);
        spike.position.x = 400;
        spike.position.y = 400 - 8 - 32 - 32;
        spike.direction = "down";

        spike = ObjSpike.Create(controller);
        spike.position.x = 496;
        spike.position.y = 400 - 8;
        spike.direction = "up";

        spike = ObjSpike.Create(controller);
        spike.position.x = 464;
        spike.position.y = 400 - 8 - 32;
        spike.direction = "down";

        spike = ObjSpike.Create(controller);
        spike.position.x = 496 + 64;
        spike.position.y = 400 - 8;
        spike.direction = "up";

        spike = ObjSpike.Create(controller);
        spike.position.x = 464 + 64;
        spike.position.y = 400 - 8 - 32;
        spike.direction = "right";

        let block = ObjBlock.Create(controller);
        block.position.x = 100;
        block.position.y = 500;

        block = ObjBlock.Create(controller);
        block.position.x = 200;
        block.position.y = 400;

        block = ObjBlock.Create(controller);
        block.position.x = 300;
        block.position.y = 300;

        block = ObjBlock.Create(controller);
        block.position.x = 400;
        block.position.y = 200;

        let kid = ObjKid.Create(controller);

    }

    evtStep(controller) {
    }

    evtDraw(controller, context) {
    }
}