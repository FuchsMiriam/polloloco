class Cloud extends MovableObject {
  y = 50;
  width = 400;
  height = 200;
  screenWidth = 720;

  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");

    this.x = Math.random() * this.screenWidth;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.x -= 0.2;

      if (this.x + this.width < 0) {
        this.x = this.screenWidth;
      }
    }, 1000 / 60);
  }
}

