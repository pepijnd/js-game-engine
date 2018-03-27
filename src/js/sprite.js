export default class Sprite {
    constructor(img,
                sprite_width,
                sprite_height,
                sprite_positions,
                offsetX,
                offsetY,
                spacingX,
                spacingY,
                scale) {
        this.img = img;
        this.sprite_width = sprite_width;
        this.sprite_height = sprite_height;
        this.sprite_positions = sprite_positions;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.spacingX = spacingX;
        this.spacingY = spacingY;
        this.scale = scale;

        this.offset = {
            x: 0,
            y: 0,
        };
        this.ratio = {
            x: 1,
            y: 1,
        };
    }

    get width() {
        return this.sprite_width * this.ratio.x;
    }

    get height() {
        return this.sprite_height * this.ratio.y;
    }

    static fromImage(img, srcW = null, srcH = null, srcX = 0, srcY = 0, scale = {x: 1, y: 1}) {
        return new Sprite(
            img,
            srcW ? srcW : img.width,
            srcH ? srcH : img.height,
            [[0, 0]],
            srcX, srcY,
            0, 0,
            scale);
    }

    static fromSpritesheet(img,
                           sprite_width = null,
                           sprite_height = null,
                           sprite_positions = [[0, 0]],
                           offsetX = 0,
                           offsetY = 0,
                           spacingX = 0,
                           spacingY = 0,
                           scale = {x: 1, y: 1}) {
        return new Sprite(
            img,
            sprite_width ? sprite_width : img.width,
            sprite_height ? sprite_height : img.height,
            sprite_positions,
            offsetX, offsetY,
            spacingX, spacingY,
            scale
        );
    }

    center() {
        this.offset.x = this.sprite_width / 2;
        this.offset.y = this.sprite_height / 2;
    }
}