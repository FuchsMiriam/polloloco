class Chicken extends MovableObject {
  width = 60;
  height = 60;
  y = 370;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGE_DEAD = [
    './img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
]

  chicken_sound = new Audio("audio/chicken.mp3");

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGE_DEAD);

    this.x = 200 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.25;

    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    setInterval(() => {
      this.chicken_sound.play();
      this.playAnimation(this.IMAGES_WALKING);
    }, 250);
  }
}
