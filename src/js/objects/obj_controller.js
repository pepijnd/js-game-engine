import Obj from "object";
import ObjCar from "objects/obj_car";
import ObjBox from "objects/obj_box";

export default class ObjController extends Obj {
    evtCreate(controller) {
        this.car = ObjCar.Create(controller);
        this.box = ObjBox.Create(controller);
    }

    evtStep(controller) {

    }

    evtDraw(controller, context) {
        context.vpi = 0;
        context.drawLine(0, 0, context.width, 0);
        context.drawLine(0, 0, 0, context.height);
        context.drawLine(0, context.height, context.width, context.height);
        context.drawLine(context.width, 0, context.width, context.height);

        for(let xx=0; xx<4; xx++){
            for(let yy=0; yy<4; yy++) {
                let xxx = context.width / 4 * xx;
                let yyy = context.height / 4 * yy;
                context.drawRect(xxx + context.width/12, yyy + context.width/12, context.width/12, context.height/12);
            }
        }
    }
}