class Coin extends MovableObject {
    width = 100;
    height = 100;


    COIN_IMAGE = [
        './img/8_coin/coin_1.png'
    ];

    constructor() {
        //super().loadImage(this.COIN_IMAGE[0]); <-prüfen

        this.x = 300 + Math.random() * 3000;
        this.y = 80 + Math.random() * 150;
    }
}