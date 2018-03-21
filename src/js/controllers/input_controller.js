import $ from 'jquery';

export default class InputController {
    constructor(controller) {
        this.controller = controller;

        this.keysPressed = [];
        this.keysReleased = [];
        this.newKeys = [];
        this.keys = [];

        $(document).keydown((e) => {
            let keycode = e.which;
            if (this.newKeys.indexOf(keycode) === -1) {
                this.newKeys.push(keycode);
            }
            e.preventDefault();
        });

        $(document).keyup((e) => {
            let keycode = e.which;
            this.newKeys = this.newKeys.filter((e) => {
                return (e !== keycode)
            });
            e.preventDefault();
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
    }

    checkDown(keycode) {
        return (this.keys.indexOf(keycode) !== -1);
    }

    checkPressed(keycode) {
        return (this.keysPressed.indexOf(keycode) !== -1);
    }

    checlReleased(keycode) {
        return (this.keysReleased.indexOf(keycode) !== -1);
    }
}