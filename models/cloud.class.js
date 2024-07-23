class Cloud extends MovableObject {
  y = 50;
  width = 400;
  height = 200;

  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");

    this.x = Math.random() * 500;
    this.animate();
  }

  animate() {
    this.moveLeft();
  }
}
