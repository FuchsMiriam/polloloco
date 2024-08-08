class Cloud extends MovableObject {
  y = 50;
  width = 400;
  height = 200;
  canvasWidth = 720;
  speed = 0.5;

  IMAGES_CLOUDS = [
    "img/5_background/layers/4_clouds/1.png",
    "img/5_background/layers/4_clouds/2.png",
  ];

  constructor(imagePath, x) {
    super().loadImage(imagePath, x);
    this.animate();
    this.x = x;
  }

  /**
   * Animation of the clouds' movement.
   */
  animate() {
    setInterval(() => this.moveLeft(), 1000 / 25);
  }
}
