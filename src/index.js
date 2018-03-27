import "index.scss";
import settings from "gameSettings";

import Context from "context";
import Controller from "controllers/controller";

import SprCar from "img/car.png";
import SprCar2 from "img/car2.png";
import SprBox from "img/box.png";
import SprKillers1 from "img/killers1.png";
import SprTheKid from "img/thekid.png";
import SprSpikes from "img/spikes.png";
import SprBlock from "img/block.png";

import ObjController from "objects/obj_controller";

window.onload = function () {
    let canvas = document.getElementById("gameCanvas");
    canvas.width = settings.width;
    canvas.height = settings.height;

    let context = new Context(canvas, settings);
    let controller = new Controller(context);

    controller.imageController.register(SprCar);
    controller.imageController.register(SprCar2);
    controller.imageController.register(SprBox);
    controller.imageController.register(SprKillers1);
    controller.imageController.register(SprTheKid);
    controller.imageController.register(SprSpikes);
    controller.imageController.register(SprBlock);

    controller.run(() => {
        ObjController.Create(controller);
    });
};