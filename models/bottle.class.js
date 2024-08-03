class Bottle extends MovableObject {
  height = 80;
  width = 60;
  x= 0;
  y = 350;

  BOTTLE_IMAGES = [
    "./img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "./img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  constructor() {
    super().loadImage(this.BOTTLE_IMAGES[0]);
    this.loadImages(this.BOTTLE_IMAGES);
    this.animate();

    this.x = 300 + Math.random() * 2250;
  }

  animate() {
    setInterval(() => this.playAnimation(this.BOTTLE_IMAGES), 500);
  }
}
