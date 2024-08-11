class Chicklets extends MovableObject {
  y = 375;
  height = 50;
  width = 50;

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

    this.x = 700 + Math.random() * 800;
    this.speed = 0.15 + Math.random() * 0.3;

    this.animate();
  }

  /**
   * Initiates the animation sequence for a chicklet.
   *
   * This function sets up two intervals:
   * 1. Moves the chicklet to the left at 60 frames per second.
   * 2. Plays the walking animation at 4 frames per second.
   */
  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 250);
  }

  /**
   * Triggers the death animation for the chicklet.
   * This plays a sound effect and displays the death image.
   */
  deathAnimation() {
    chicken_sound.play();
    this.playAnimation(this.IMAGE_DEAD);
  }
}
