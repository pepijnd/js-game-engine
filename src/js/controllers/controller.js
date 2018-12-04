import ImageController from "./image_controller";
import InputController from "./input_controller";
import ObjectController from "./object_controller";
import EventController from "./event_controller";
import CollisionController from "./collision_controller";

export default class Controller {
    constructor(context) {
        this.context = context;
        this.context.setController(this);

        this.imageController = new ImageController(this);
        this.inputController = new InputController(this);
        this.objectController = new ObjectController(this);
        this.eventController = new EventController(this);
        this.collisionController = new CollisionController(this);

        this.drawInterval = null;
        this.tickInterval = null;

        this.frames = 0;
        this.ticks = 0;

        this.realFps = 0;
        this.realTicks = 0;

        this.frametime = 0;

        this.stopped = false;
    }

    stop() {
        this.stopped = true;
    }

    get fps() {
        return this.realFps;
    }

    set fps(value) {
        this.context.settings.fps = value;
        this.setLoops();
    }

    get tickrate() {
        return this.realTicks;
    }

    set tickrate(value) {
        this.context.settings.tickrate = value;
        this.setLoops();
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

    setLoops() {
        window.cancelAnimationFrame(this.drawInterval);
        clearInterval(this.tickInterval);

        let controller = this;
        this.drawInterval = window.requestAnimationFrame(function drawLoop() {
            controller.drawLoop();
            controller.drawInterval = window.requestAnimationFrame(drawLoop);

        });
        this.tickInterval = setInterval(() => {
            this.tickLoop()
        }, 1000 / this.context.settings.tickrate);
    }

    drawLoop() {
        this.context.drawClear();
        this.objectController.forAll((obj) => {
            obj.evtDraw(this.context);
        }, "depth");
        this.frames += 1;
    }


    col_check_point(layer, x, y, hb = false) {
        let hitbox = hb ? Object.assign(Object.create(Object.getPrototypeOf(hb)), hb) : AABB.Create({
            x: x,
            y: y,
            w: 1,
            h: 1
        });
        hitbox.x = x;
        hitbox.y = y;
        hitbox.update();
        if (layer in this.collisionMap) {
            for (let i = 0; i < this.collisionMap[layer].length; i++) {
                let col = this.collisionMap[layer][i];
                if (col.hitbox !== false) {
                    if (col.hitbox.checkCollision(hitbox)) return col;
                } else {
                    if (col.obj.hitbox.checkCollision(hitbox)) return col;
                }
            }
        }
        return false;
    }

    tickLoop() {

        if (this.stopped) {
            return;
        }

        let temp = window.performance.now();

        this.inputController.setInputs();
        this.eventController.runEvents();

        this.ticks += 1;
        this.frametime = Math.round(100 * (window.performance.now() - temp)) / 100;

        if (this.ticks % 50 === 0) {
            document.getElementById('geFps').value = 'Fps: ' + this.realFps;
            document.getElementById('geTickrate').value = 'Tickrate: ' + this.realTicks;
            document.getElementById('geFrametime').value = 'Frametime: ' + this.frametime;
        }
    }
}