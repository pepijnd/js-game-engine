import Obj from "object";
import ObjBox from "objects/obj_box"
import ObjCar from "objects/obj_car";
import Vector from "vector";

export default class ObjController extends Obj {
    evtCreate(controller) {
        this.car = ObjCar.Create(controller);
        this.box = ObjBox.Create(controller);
    }

    evtStep(controller) {
    }

    evtDraw(controller, context) {
    }
}