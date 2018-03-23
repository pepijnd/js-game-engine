export default class Context {
    constructor(canvas, settings) {
        this.canvas = canvas;
        this.settings = settings;
        this.controller = null;

        this.ctx = null;
        this.width = null;
        this.height = null;

        this.viewport = [{
            x: 0,
            y: 0,
            w: this.width,
            h: this.height,
        }];

        this.vpi = 0;
    }

    init() {
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    setViewportContext() {
        if (this.vpi !== false) {
            this.ctx.scale(
                this.width / this.viewport[this.vpi].w,
                this.height / this.viewport[this.vpi].h);
            this.ctx.translate(
                -this.viewport[this.vpi].x,
                -this.viewport[this.vpi].y);
        }
    }

    setController(controller) {
        this.controller = controller;
    }

    drawSprite(sprite, dstX, dstY, index = 0) {
        this.ctx.save();
        this.setViewportContext();
        this.ctx.translate(dstX, dstY);
        this.ctx.drawImage(
            sprite.img,
            sprite.offsetX + (sprite.sprite_positions[index][0] * (sprite.spacingX + sprite.sprite_width)),
            sprite.offsetY + (sprite.sprite_positions[index][1] * (sprite.spacingY + sprite.sprite_height)),
            sprite.sprite_width, sprite.sprite_height,
            -(sprite.sprite_width - sprite.offset.x) * sprite.scale.x,
            -(sprite.sprite_height - sprite.offset.y) * sprite.scale.y,
            sprite.sprite_width * sprite.scale.x, sprite.sprite_height * sprite.scale.y
        );
        this.ctx.restore();
    }

    drawSpriteRot(sprite, dstX, dstY, rot, index = 0) {
        this.ctx.save();
        this.setViewportContext();
        this.ctx.translate(dstX, dstY);
        this.ctx.rotate(rot);
        this.ctx.drawImage(
            sprite.img,
            sprite.offsetX + (sprite.sprite_positions[index][0] * (sprite.spacingX + sprite.sprite_width)),
            sprite.offsetY + (sprite.sprite_positions[index][1] * (sprite.spacingY + sprite.sprite_height)),
            sprite.sprite_width, sprite.sprite_height,
            -(sprite.sprite_width - sprite.offset.x) * sprite.scale.x,
            -(sprite.sprite_height - sprite.offset.y) * sprite.scale.y,
            sprite.sprite_width * sprite.scale.x, sprite.sprite_height * sprite.scale.y
        );
        this.ctx.restore();
    }

    drawClear() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawText(str, x, y, size = 30, font = 'arial', maxwidth) {
        this.ctx.save();
        this.setViewportContext();
        this.ctx.font = size + 'px ' + font;
        this.ctx.fillStyle = '#000000';
        this.ctx.fillText(str, x, y, maxwidth);
        this.ctx.restore();
    }

    drawLine(x1, y1, x2, y2, color='#000000') {
        this.ctx.save();
        this.setViewportContext();
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawRect(x, y, w, h, color='#000000') {
        this.ctx.save();
        this.setViewportContext();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
        this.ctx.restore();
    }

    drawRectRot(x, y, w, h, r, color='#000000') {
        this.ctx.save();
        this.setViewportContext();
        this.ctx.translate(x + (w/2), y + (h/2));
        this.ctx.rotate(r);
        this.ctx.fillStyle = color;
        this.ctx.fillRect(-w/2, -h/2, w, h);
        this.ctx.restore();
    }

    drawVector(x, y, vector, color='#000000') {
        this.ctx.save();
        this.setViewportContext();
        this.ctx.translate(x, y);
        this.drawLine(0, 0, vector.m * Math.cos(vector.a), vector.m * Math.sin(vector.a));
        this.ctx.restore();
    }

    drawPolygon(x, y, polygons, color='#000000') {
        this.ctx.save();
        this.setViewportContext();
        this.ctx.beginPath();
        this.ctx.translate(x, y);
        let p1 = polygons[0];
        this.ctx.moveTo(p1.x, p1.y);
        for (let i=1; i<polygons.length; i++) {
            let p = polygons[i];
            this.ctx.lineTo(p.x, p.y);
        }
        this.ctx.closePath();
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
        this.ctx.restore();
    }
}