export default class ImageController {
    constructor(controller) {
        this.controller = controller;
        this.imageList = {};
        this.promises = [];
    }

    getImage(imageUrl) {
        return this.imageList[imageUrl];
    }

    register(imageUrl) {
        let newImage = new Image();
        this.promises.push(
            new Promise((resolve, reject) => {
                newImage.addEventListener('load', () => {
                    resolve(newImage.src);
                }, false);
                newImage.src = imageUrl;
                this.imageList[imageUrl] = newImage;
        }));
    }
}