class Bottle extends MovableObject {
  height = 80;
  width = 60;
  x = 0;
  y = 350;

  offset = {
    top: 12,
    bottom: 8,
    right: 16,
    left: 20,
  };

  BOTTLE_IMAGES = [
    "./img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "./img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  constructor() {
    super().loadImage(this.BOTTLE_IMAGES[0]);
    this.loadImages(this.BOTTLE_IMAGES);
    this.animate();

    this.x = 300 + Math.random() * 2550;
  }

  /**
   * Initiates an animation loop that plays the bottle animation.
   * The animation runs every 500 milliseconds, cycling through the images in `this.BOTTLE_IMAGES`.
   */
  animate() {
    setInterval(() => this.playAnimation(this.BOTTLE_IMAGES), 500);
  }
}
