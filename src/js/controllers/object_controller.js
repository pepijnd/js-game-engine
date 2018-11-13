export default class ObjectController {
    constructor(controller) {
        this.controller = controller;
        this.objects = {};
        this.next_id = 3;
    }

    register(object) {
        object.id = this.next_id;
        this.objects[this.next_id] = object;
        this.next_id += 1;
        object._controller = this.controller;
        this.controller.newObjects.push(object);
    }

    forAll(f, order = "id", created = true) {
        if (order === "depth") {
            let items = Object.keys(this.objects).map((key) => {
                return [this.objects[key].depth, this.objects[key]]
            });
            items = items.sort((first, second) => {
                return second[0] - first[0];
            });
            for (let i = 0; i < items.length; i++) {
                if (!created || items[i][1].created) {
                    f(items[i][1]);
                }
            }
        } else {
            for (let id in this.objects) {
                if (!this.objects.hasOwnProperty(id)) continue;
                if (!created || this.objects[id].created) {
                    f(this.objects[id]);
                }
            }
        }
    }
}