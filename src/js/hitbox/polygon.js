import Hitbox from "hitbox/hitbox";
import AABB from "hitbox/aabb";
import Vector from "vector";

export default class Polygon extends Hitbox {
    constructor(options) {
        super(options);
        this.r = options.r;
        this.vertices = options.vertices;

        this.aabb = AABB.Create();
    }

    static Create(options = {}) {
        options = Object.assign({}, this.GetDefaultOptions(), options);
        return new this.prototype.constructor(options);
    }

    static GetDefaultOptions() {
        return Object.assign({}, super.GetDefaultOptions(),
            {
                r: 0,
                vertices: [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}]
            });
    }

    getsize() {
        let xmin = null;
        let ymin = null;
        let xmax = null;
        let ymax = null;
        for (let i = 0; i < this.vertices.length; i++) {
            if (xmin === null || this.vertices[i].x < xmin) {
                xmin = this.vertices[i].x
            }
            if (ymin === null || this.vertices[i].y < ymin) {
                ymin = this.vertices[i].y
            }
            if (xmax === null || this.vertices[i].x > xmax) {
                xmax = this.vertices[i].x
            }
            if (ymax === null || this.vertices[i].y > ymax) {
                ymax = this.vertices[i].y
            }
        }
        return {w: xmax - xmin, h: ymax - ymin};
    }

    update() {
        let size = this.getsize();
        let w = size.w;
        let h = size.h;
        let r = this.r;
        if (!(this.r < Math.PI / 2 || (this.r > Math.PI && this.r < Math.PI * 3 / 2))) {
            w = size.h;
            h = size.w;
            r = this.r - Math.PI / 2;
        }
        this.aabb.w = Math.abs((w * Math.cos(r)) + (h * Math.sin(r)));
        this.aabb.h = Math.abs((w * Math.sin(r)) + (h * Math.cos(r)));
        this.aabb.x = this.x;
        this.aabb.y = this.y;
    }

    checkPolygonCollision(other) {
        let verts = this.getVertices();
        let verts2 = other.getVertices();

        let normals = [];
        for (let i = 0; i < verts.length; i++) {
            let p1 = verts[i];
            let p2 = verts[i + 1 === verts.length ? 0 : i + 1];
            normals.push(new Vector(Math.atan2(p2.y - p1.y, p2.x - p1.x) + (Math.PI / 2), 1));
        }
        for (let i = 0; i < verts2.length; i++) {
            let p1 = verts2[i];
            let p2 = verts2[i + 1 === verts2.length ? 0 : i + 1];
            normals.push(new Vector(Math.atan2(p2.y - p1.y, p2.x - p1.x) + (Math.PI / 2), 1));
        }
        let projections = [];
        for (let i = 0; i < normals.length; i++) {
            let projection = {p1_min: null, p1_max: null, p2_min: null, p2_max: null};
            for (let j = 0; j < verts.length; j++) {
                let proj_new = Vector.fromPoint(
                    verts[j].x  + this.x,
                    verts[j].y  + this.y
                ).dotProduct(normals[i]);
                if (projection.p1_min === null || proj_new <= projection.p1_min) {
                    projection.p1_min = proj_new;
                }
                if (projection.p1_max === null || proj_new >= projection.p1_max) {
                    projection.p1_max = proj_new;
                }
            }
            for (let j = 0; j < verts2.length; j++) {
                let proj_new = Vector.fromPoint(
                    verts2[j].x + other.x,
                    verts2[j].y + other.y
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
        for (let i = 0; i < projections.length; i++) {
            if (projections[i].p1_max < projections[i].p2_min || projections[i].p2_max < projections[i].p1_min) {
                return false;
            }
        }
        return true;
    }

    checkCollision(other) {
        if (this.toAABB().checkCollision(other.toAABB())) {
            if (other.constructor === Polygon) {
                return this.checkPolygonCollision(other);
            }
            else {
                return this.checkCollision(other.toPolygon());
            }
        }
        return false;
    }

    toAABB() {
        return this.aabb;
    }

    toPolygon() {
        return this;
    }

    rotateVertice(vert) {
        let s = Math.sin(this.r);
        let c = Math.cos(this.r);

        let x = vert.x;
        let y = vert.y;

        let xnew = (x * c) - (y * s);
        let ynew = (x * s) + (y * c);

        return {x: xnew, y: ynew};
    }

    getVertices() {
        if (this.r !== 0) {
            return this.vertices.map(x => this.rotateVertice(x));
        }
        return this.vertices.slice();
    }
}