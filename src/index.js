import 'index.scss';
import settings from 'gameSettings';

import Context from 'context';
import Controller from 'controllers/controller';

import SprCar from 'img/car.png';
import SprCar2 from 'img/car2.png';
import SprBox from 'img/box.png';

import ObjController from 'objects/obj_controller';

window.onload = function() {
    let canvas = document.getElementById('gameCanvas');
    canvas.width = settings.width;
    canvas.height = settings.height;

    let context = new Context(canvas, settings);
    let controller = new Controller(context);

    controller.imageController.register(SprCar);
    controller.imageController.register(SprCar2);
    controller.imageController.register(SprBox);

    controller.run(() => {
        ObjController.Create(controller);
    });
};