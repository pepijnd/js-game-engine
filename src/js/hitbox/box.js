import Hitbox from "hitbox/hitbox";
import AABB from 'hitbox/aabb';
import Vector from "../vector";

export default class Box extends Hitbox{
    constructor(options) {
        super(options);
        this.w = options.w;
        this.h = options.h;
        this.r = options.r;

        this.offset = {
            x: 0,
            y: 0
        };

        this.aabb = AABB.Create();
    }

    center() {
        this.offset.x = this.w / 2;
        this.offset.y = this.h / 2;
    }

    static Create(options={}) {
        options = Object.assign({}, this.GetDefaultOptions(), options);
        return new this.prototype.constructor(options);
    }

    static GetDefaultOptions() {
        return Object.assign({}, super.GetDefaultOptions(), {w: 0, h: 0, r:0});
    }

    update() {
        let w = this.w;
        let h = this.h;
        let r = this.r;
        if (!(this.r < Math.PI / 2 || (this.r > Math.PI && this.r < Math.PI * 3/2))) {
            w = this.h;
            h = this.w;
            r = this.r - Math.PI / 2;
        }
        this.aabb.w = Math.abs((w * Math.cos(r)) + (h * Math.sin(r)));
        this.aabb.h = Math.abs((w * Math.sin(r)) + (h * Math.cos(r)));
        this.aabb.x = this.x - (this.aabb.w / 2);
        this.aabb.y = this.y - (this.aabb.h / 2);
    }

    checkCollision(other) {
        if (this.aabb.checkCollision(other.aabb)) {
            let verts = this.getVertices();
            let verts2 = other.getVertices();

            let normals = [];
            for (let i=0; i<verts.length; i++) {
                let p1 = verts[i];
                let p2 = verts[i+1 === verts.length ? 0 : i+1];
                normals.push(new Vector(Math.atan2(p2.y - p1.y, p2.x - p1.x) + (Math.PI/2), 1));
            }
            for (let i=0; i<verts2.length; i++) {
                let p1 = verts2[i];
                let p2 = verts2[i+1 === verts2.length ? 0 : i+1];
                normals.push(new Vector(Math.atan2(p2.y - p1.y, p2.x - p1.x) + (Math.PI/2), 1));
            }
            let projections = [];
            for (let i=0; i<normals.length; i++) {
                let projection = {p1_min: null, p1_max: null, p2_min: null, p2_max: null};
                for (let j=0; j<verts.length; j++) {
                    let proj_new = Vector.fromPoint(
                        verts[j].x - this.offset.x + this.x,
                        verts[j].y - this.offset.y + this.y
                    ).dotProduct(normals[i]);
                    if (projection.p1_min === null || proj_new <= projection.p1_min) {
                        projection.p1_min = proj_new;
                    }
                    if (projection.p1_max === null || proj_new >= projection.p1_max) {
                        projection.p1_max = proj_new;
                    }
                }
                for (let j=0; j<verts2.length; j++) {
                    let proj_new = Vector.fromPoint(
                        verts2[j].x - other.offset.x + other.x,
                        verts2[j].y - other.offset.y + other.y
                    ).dotProduct(normals[i]);
                    if (projection.p2_min === null || proj_new <= projection.p2_min) {
                        projection.p2_min = proj_new;
                    }
                    if (projection.p2_max === null || proj_new >= projection.p2_max) {
                        projection.p2_max = proj_new;
                    }
                }
                projections.push(projection);
            }
            for (let i=0; i<projections.length; i++) {
                if (projections[i].p1_max < projections[i].p2_min || projections[i].p2_max < projections[i].p1_min) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    rotateVertice(x, y) {
        let s = Math.sin(this.r);
        let c = Math.cos(this.r);

        x -= this.offset.x;
        y -= this.offset.y;

        let xnew = (x*c)-(y*s);
        let ynew = (x*s)+(y*c);

        xnew += this.offset.x;
        ynew += this.offset.y;

        return {x:xnew, y:ynew};
    }

    getVertices() {
        let vertices = [];
        vertices.push(this.rotateVertice(0, 0));
        vertices.push(this.rotateVertice(this.w, 0));
        vertices.push(this.rotateVertice(this.w, this.h));
        vertices.push(this.rotateVertice(0, this.h));
        return vertices;
    }
}