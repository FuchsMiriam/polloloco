class Chicken extends MovableObject {
  height = 60;
  width = 60;
  y = 370;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGE_DEAD = ["./img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGE_DEAD);

    this.x = 200 + Math.random() * 800;
    this.speed = 0.15 + Math.random() * 0.15;

    this.animate();
  }

  /**
   * Initiates the animation sequence for a chicken.
   *
   * This function sets up two intervals:
   * 1. Moves the chicken to the left at 60 frames per second.
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
   * Triggers the death animation for the chicken.
   * This plays a sound effect and displays the death image.
   */
  deathAnimation() {
    chicken_sound.play();
    this.playAnimation(this.IMAGE_DEAD);
  }
}
