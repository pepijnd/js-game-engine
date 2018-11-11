import $ from "jquery";

export default class InputController {
    constructor(controller) {
        this.controller = controller;

        this.keysPressed = [];
        this.keysReleased = [];
        this.newKeys = [];
        this.keys = [];

        this.mouse = {
            x: 0,
            y: 0,
            click: false
        };

        this.newMouse = {
            x: 0,
            y: 0,
            click: false
        };


        $(document).on("keydown", (e) => {
            let keycode = e.which;
            if (this.newKeys.indexOf(keycode) === -1) {
                this.newKeys.push(keycode);
            }
            e.preventDefault();
        });

        $(document).on("keyup", (e) => {
            let keycode = e.which;
            this.newKeys = this.newKeys.filter((e) => {
                return (e !== keycode)
            });
            e.preventDefault();
        });

        $(document).on("mousemove", (e) => {
            let offset = controller.context.canvas.getBoundingClientRect();
            this.newMouse.x = e.pageX - offset.left;
            this.newMouse.y = e.pageY - offset.top;
        });

        $(document).on("click", (e) => {
            this.newMouse.click = true;
        })
    }

    setInputs() {
        this.keysPressed = this.newKeys.filter((e) => {
            return (this.keys.indexOf(e) === -1);
        });
        this.keysReleased = this.keys.filter((e) => {
            return (this.newKeys.indexOf(e) === -1);
        });
        this.keys = this.newKeys.slice();

        this.mouse = Object.assign({}, this.newMouse);

        this.newMouse.click = false;
    }

    checkDown(keycode) {
        return (this.keys.indexOf(keycode) !== -1);
    }

    checkPressed(keycode) {
        return (this.keysPressed.indexOf(keycode) !== -1);
    }

    checkReleased(keycode) {
        return (this.keysReleased.indexOf(keycode) !== -1);
    }
}