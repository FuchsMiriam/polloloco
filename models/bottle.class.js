class Bottle extends MovableObject {
    width = 100;
    height = 100;
    y = 340;

    BOTTLE_IMAGES = [
        './img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        './img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor() {
        super().loadImage(this.BOTTLE_IMAGES[0]);
        this.loadImages(this.BOTTLE_IMAGES);
        this.animate();

        this.x = 300 + Math.random() * 2600;
    }


}
