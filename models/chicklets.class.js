class Chicklets extends MovableObject {
  y = 380;
  height = 50;
  width = 50;

  offset = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10
  };

  IMAGES_WALKING = [
    "./img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "./img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "./img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGE_DEAD = ["./img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGE_DEAD);

    this.x = 700 + Math.random() * 600;
    this.speed = 0.15 + Math.random() * 0.3;

    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 250);
  }

  deathAnimation() {
    chicken_sound.play();
    this.playAnimation(this.IMAGE_DEAD);
  }
}
