import ImageController from "./image_controller";
import InputController from "./input_controller";
import ObjectController from "./object_controller";

export default class Controller {
    constructor(context) {
        this.context = context;
        this.context.setController(this);

        this.imageController = new ImageController(this);
        this.inputController = new InputController(this);
        this.objectController = new ObjectController(this);

        this.collisionMap = {};

        this.drawInterval = null;
        this.tickInterval = null;

        this.frames = 0;
        this.ticks = 0;

        this.realFps = 0;
        this.realTicks = 0;
    }

    run(onRunning) {
        Promise.all(this.imageController.promises).then(() => {
            this.context.init();
            this.setLoops();

            let lastFrames = 0;
            let lastTicks = 0;
            setInterval(() => {
                this.realFps = this.frames - lastFrames;
                lastFrames = this.frames;

                this.realTicks = this.ticks - lastTicks;
                lastTicks = this.ticks;
                }, 1000);
            onRunning();
            }
        ).catch((e) => {
            console.log(e);
        });
    }

    set fps(value) {
        this.context.settings.fps = value;
        this.setLoops();
    }

    set tickrate(value) {
        this.context.settings.tickrate = value;
        this.setLoops();
    }

    get fps() {
        return this.realFps;
    }

    get tickrate() {
        return this.realTicks;
    }

    setLoops() {
        clearInterval(this.drawInterval);
        clearInterval(this.tickInterval);

        this.drawInterval = setInterval(() => {
            this.drawLoop()
        }, 1000 / this.context.settings.fps);
        this.tickInterval = setInterval(() => {
            this.tickLoop()
        }, 1000 / this.context.settings.tickrate);
    }

    drawLoop() {
        this.context.drawClear();
        this.objectController.forAll((obj) => {
            obj.evtDraw(this, this.context);
        }, 'depth');
        this.frames += 1;
    }

    tickLoop() {
        this.inputController.setInputs();

        this.objectController.forAll((object) => {
            object.evtBeginStep(this);
        });

        for (let layer in this.collisionMap) {
            let collision_layer = this.collisionMap[layer];
            for (let i=0; i<collision_layer.length; i++) {
                for (let j=0; j<collision_layer.length; j++) {
                    if (collision_layer[i] !== collision_layer[j]) {
                        if (collision_layer[i].hitbox.checkCollision(collision_layer[j].hitbox)) {
                            collision_layer[i].evtCollision(this, collision_layer[j]);
                        }
                    }
                }
            }
        }

        this.objectController.forAll((object) => {
            object.evtStep(this);
        });

        this.objectController.forAll((object) => {
            object.evtEndStep(this);
        });

        this.ticks += 1;
    }

    registerCollision(layer, obj) {
        if (!(layer in this.collisionMap)) {
            this.collisionMap[layer] = [];
        }
        this.collisionMap[layer].push(obj);
    }
}