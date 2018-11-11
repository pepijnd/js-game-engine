import ImageController from "./image_controller";
import InputController from "./input_controller";
import ObjectController from "./object_controller";
import AABB from "hitbox/aabb";

export default class Controller {
    constructor(context) {
        this.context = context;
        this.context.setController(this);

        this.imageController = new ImageController(this);
        this.inputController = new InputController(this);
        this.objectController = new ObjectController(this);

        this.collisionMap = {};
        this.collisionMapEvents = {};
        this.newObjects = [];

        this.drawInterval = null;
        this.tickInterval = null;

        this.frames = 0;
        this.ticks = 0;

        this.realFps = 0;
        this.realTicks = 0;

        this.frametime = 0;
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
            obj.evtDraw(this, this.context);
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
        for (let i = 0; i < this.collisionMap[layer].length; i++) {
            let col = this.collisionMap[layer][i];
            if (col.hitbox !== false) {
                if (col.hitbox.checkCollision(hitbox)) return col;
            } else {
                if (col.obj.hitbox.checkCollision(hitbox)) return col;
            }
        }
        return false;
    }

    tickLoop() {
        let temp = window.performance.now();

        this.inputController.setInputs();

        let createEvents = this.newObjects.slice();
        this.newObjects = [];
        for (let i = 0; i < createEvents.length; i++) {
            createEvents[i].evtCreate(this);
            createEvents[i]._created = true;
        }

        this.objectController.forAll((object) => {
            object.evtBeginStep(this);
        });

        for (let layer in this.collisionMap) {
            if (!this.collisionMap.hasOwnProperty(layer)) continue;
            let collision_layer = this.collisionMap[layer];
            for (let i = 0; i < collision_layer.length; i++) {
                for (let j = 0; j < collision_layer.length; j++) {
                    if (collision_layer[i] !== collision_layer[j]) {
                        if (this.collisionMapEvents[layer] !== undefined &&
                            collision_layer[i].obj._id in this.collisionMapEvents[layer]) {
                                let event_map = this.collisionMapEvents[layer][collision_layer[i].obj._id];
                                for (let k = 0; k < event_map.length; k++) {
                                    if (event_map[k] === true || collision_layer[j].obj instanceof event_map[k]) {
                                        let a = collision_layer[i].hitbox ?
                                            collision_layer[i].hitbox : collision_layer[i].obj.hitbox;
                                        let b = collision_layer[j].hitbox ?
                                            collision_layer[j].hitbox : collision_layer[j].obj.hitbox;
                                        if (collision_layer[i].obj.constructor.name === 'ObjKid' && collision_layer[j].obj.constructor.name === 'ObjSpike') {
                                            //debugger;
                                        }
                                        if (a.checkCollision(b)) {
                                            collision_layer[i].obj.evtCollision(this, collision_layer[j].obj,
                                                {layer: layer, self: a, other: b});
                                        }
                                    }
                                }
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
        this.frametime = Math.round(100*(window.performance.now() - temp))/100;

        if (this.ticks%50 === 0) {
            document.getElementById('geFps').value = 'Fps: ' + this.realFps;
            document.getElementById('geTickrate').value = 'Tickrate: ' + this.realTicks;
        }
    }

    registerHitbox(layer, obj, hitbox = false) {
        if (!(layer in this.collisionMap)) {
            this.collisionMap[layer] = [];
        }
        this.collisionMap[layer].push({obj: obj, hitbox: hitbox});
    }

    registerCollision(layer, object, type) {
        if (!(layer in this.collisionMapEvents)) {
            this.collisionMapEvents[layer] = {};
        }
        if (!(object._id in this.collisionMapEvents[layer])) {
            this.collisionMapEvents[layer][object._id] = []
        }
        this.collisionMapEvents[layer][object._id].push(type);
    }
}