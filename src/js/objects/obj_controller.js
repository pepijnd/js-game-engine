import Obj from "object";
import Keycodes from "keycodes";

import ObjFluid from "objects/obj_fluid";

import EventTypes from 'engine/events';

export default class ObjController extends Obj {
    setEvents() {
        this.onEvent(EventTypes.CREATE, () => {
            this.grid = false;
            this.gridSize = 32;

            this.fluid = ObjFluid.Create(this.controller)
        });

        this.onEvent(EventTypes.STEP, () => {

            let mouse_x = Math.floor(this.controller.inputController.mouse.x / this.gridSize) * this.gridSize;
            let mouse_y = Math.floor(this.controller.inputController.mouse.y / this.gridSize) * this.gridSize;


            if (this.controller.inputController.checkReleased(Keycodes.backspace)) {
                let closest = null;
                let distance = -1;
                let origin = {
                    x: mouse_x,
                    y: mouse_y
                };
                this.controller.objectController.forAll((obj) => {
                    let dist = Math.sqrt((origin.x - obj.position.x) ** 2 + (origin.y - obj.position.y) ** 2);
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

            if (this.controller.inputController.checkPressed(Keycodes.space)) {

            }

            if (this.controller.inputController.checkPressed(Keycodes.p)) {

            }
        });

        this.onEvent(EventTypes.DRAW, (context) => {
            if (this.grid) {
                for (let xx = this.gridSize; xx < context.width; xx += this.gridSize) {
                    context.drawLine(xx, 0, xx, context.height, "#000000");
                }
                for (let yy = this.gridSize; yy < context.height; yy += this.gridSize) {
                    context.drawLine(0, yy, context.width, yy, "#000000");
                }
            }
        })
    }
}
