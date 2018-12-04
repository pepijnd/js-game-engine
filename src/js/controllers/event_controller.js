import EventType from 'engine/events';

export default class EventController {
    constructor(controller) {
        this.controller = controller
    }

    runCreateEvents() {
        let new_objects = this.controller.objectController.getNewObjects();
        for (let i = 0; i < new_objects.length; i++) {
            new_objects[i].runEvent(EventType.CREATE);
        }
    }

    runDrawEvents() {
        this.controller.objectController.forAll((object) => {
            object.runEvent(EventType.DRAW);
        });
    }

    runEvents() {
        this.runCreateEvents();


        this.controller.objectController.forAll((object) => {
            object.runEvent(EventType.BEGINSTEP);
        });

        this.controller.collisionController.checkCollisionEvents();

        this.controller.objectController.forAll((object) => {
            object.runEvent(EventType.STEP);
        });

        this.controller.objectController.forAll((object) => {
            object.runEvent(EventType.ENDSTEP);
        });
    }
}