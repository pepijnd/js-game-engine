import "css/index.scss";
import settings from "gameSettings";

import "engine";
import Context from "context";
import Controller from "controllers/controller";
import ObjController from "objects/obj_controller";


window.onload = function () {
    import("../pkg").then(module => {
        window.fluid = module;


        let canvas = document.getElementById("gameCanvas");
        canvas.width = settings.width;
        canvas.height = settings.height;

        let context = new Context(canvas, settings);
        let controller = new Controller(context);

        controller.run(() => {
            ObjController.Create(controller);
        });
    });
};