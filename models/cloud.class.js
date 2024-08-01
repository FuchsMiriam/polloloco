class Cloud extends MovableObject {
  y = 50;
  width = 400;
  height = 200;
  canvasWidth = 720;

  IMAGES_CLOUDS = [
    "img/5_background/layers/4_clouds/1.png",
    "img/5_background/layers/4_clouds/2.png"
  ];

  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");

    this.x = Math.random() * 500;
    this.animate();
  }

  /*animate() {
    this.moveLeft();
  }*/

  animate() {
    requestAnimationFrame(() => {
      this.moveLeft();
      this.animate();
    });
  }

  /*animate() {
    setInterval(() => {
      this.moveLeft();
      this.updateImage();
    }, 1000 / 60);
  }

   //Optional: Wechselt das Bild für die Wolkenanimation.
  updateImage() {
    const imageIndex = Math.floor((Date.now() / 1000) % this.IMAGES_CLOUDS.length);
    this.loadImage(this.IMAGES_CLOUDS[imageIndex]);
  }*/

}
