class ThrowableObject extends MovableObject {
  characterDirection;

  BOTTLE_ROTATING = [
    "./img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "./img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "./img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "./img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  BOTTLE_SPLASH = [
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  throw_sound = new Audio("audio/glass_breaking.mp3");

  constructor(x, y, otherDirection) {
    super().loadImage(this.BOTTLE_ROTATING[0]);
    this.loadImages(this.BOTTLE_ROTATING);
    this.loadImages(this.BOTTLE_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 80;
    this.width = 60;
    this.characterDirection = otherDirection;
    this.throw();
    this.animateBottle();
  }

  /*throw() {
    this.speedY = 30;
    this.applyGravity();
    setInterval(() => {
      this.x += 10;
    }, 25);
  }*/

    throw() {
      this.speedY = 30;
      this.applyGravity();
  
      this.throwInterval = setInterval(() => {
        if (this.characterDirection) {
          this.x -= 10;
        } else {
          this.x += 10;
        }
      }, 25);
    }

  /**
 * Handles bottle animation: rotates until a collision is detected, then plays the collision animation.
 */
  animateBottle() {
    this.splash = setInterval(() => {
        world.checkCollisions();

        if (this.y > 350 || world.collisionWithEndboss) {
            this.playCollisionAnimation();
            clearInterval(this.splash);
        } else {
            this.playAnimation(this.BOTTLE_ROTATING);
        }
    }, 1000 / 60);
}

/**
* Plays the collision animation and sound, and stops the bottle's rotation.
*/
playCollisionAnimation() {
  this.throw_sound.play();
  this.playAnimation(this.BOTTLE_SPLASH);
  this.speed = 0;
}

}
