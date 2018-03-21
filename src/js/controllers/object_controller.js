export default class ObjectController {
    constructor(controller) {
        this.objects = {};
        this.next_id = 3;
    }

    register(object) {
        object.id = this.next_id;
        this.objects[this.next_id] = object;
        this.next_id += 1;
    }

    forAll(f, order='id') {
        if(order === 'depth') {
            let items = Object.keys(this.objects).map((key) => {
                return [this.objects[key].depth, this.objects[key]]
            });
            items = items.sort((first, second) => {
                return second[0] - first[0];
            });
            for(let i=0; i<items.length; i++) {
                f(items[i][1]);
            }
        } else {
            for(let id in this.objects) {
                f(this.objects[id]);
            }
        }
    }
}