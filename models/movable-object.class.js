class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 3;
  energy = 100;
  lastHit = 0;
  coins = 0;
  bottles = 0;
  timePassed;

  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  /**
   * Applies gravity to the character or object by adjusting its vertical position and speed.
   * Gravity is applied every 40 milliseconds (25 times per second).
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the character or object is above the ground.
   *
   * @returns {boolean} - Returns true if the object is a ThrowableObject or if its vertical position (y) is less than 210.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 210;
    }
  }

  /**
   * Checks if the character or object is colliding with another object.
   * Collision detection considers offsets for more precise bounding box checks.
   *
   * @param {Object} obj - The object to check for a collision with.
   * @returns {boolean} - Returns true if the two objects are colliding.
   */
  isColliding(obj) {
    return (
      this.x + this.width - this.offset.right >= obj.x + obj.offset.left &&
      this.x + this.offset.left <= obj.x + obj.width - obj.offset.right &&
      this.y + this.height - this.offset.bottom >= obj.y + obj.offset.top &&
      this.y + this.offset.top <= obj.y + obj.height - obj.offset.bottom
    );
  }

  /**
   * Reduces the character's energy by 5 points when hit.
   * If energy drops to 0, it stays at 0. Records the time of the hit for subsequent checks.
   */
  hit() {
    this.energy -= 1;
    if (this.energy <= 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Reduces the endboss's energy by 10 points and triggers the hurt animation.
   * If the endboss's energy drops to 0, the death animation is triggered.
   * Prevents multiple hits within a short time by using a cooldown period.
   */
  hurtEndboss() {
    if (!this.endbossIsHurt) {
      this.endbossIsHurt = true;
      this.energy -= 10;

      if (this.energy <= 0) {
        this.energy = 0;
        this.deathAnimation();
      } else {
        this.endbossIsHurtAnimation();
      }

      setTimeout(() => {
        this.endbossIsHurt = false;
      }, 500);
    }
  }

  /**
   * Checks if the character is currently hurt, based on the time since the last hit.
   *
   * @returns {boolean} - Returns true if the character was hit within the last second.
   */
  isHurt() {
    this.timePassed = new Date().getTime() - this.lastHit;
    this.timePassed = this.timePassed / 1000;
    return this.timePassed < 1;
  }

  /**
   * Checks if the endboss is currently hurt, based on the time since the last hit.
   *
   * @returns {boolean} - Returns true if the endboss was hit within the last second.
   */
  endbossIsHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < 1;
  }

  /**
   * Checks if the character or object is dead (i.e., if its energy is 0).
   *
   * @returns {boolean} - Returns true if the energy is 0, indicating the character is dead.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Checks if the chicken character is killed (i.e., if its energy is 0).
   *
   * @returns {boolean} - Returns true if the chicken's energy is 0, indicating it is killed.
   */
  chickenKilled() {
    return this.energy == 0;
  }

  /**
   * Plays an animation by cycling through a set of images.
   * The images are stored in an array, and the current image index is updated each time the function is called.
   *
   * @param {Array<string>} images - An array of image paths representing the animation frames.
   */
  playAnimation(images) {
    if (images !== this.currentAnimation) {
      this.currentAnimation = images;
      this.currentImage = 0;
    }
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Moves the character or object to the right by increasing its x-coordinate by its speed.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the character or object to the left by decreasing its x-coordinate by its speed.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Initiates a jump by setting the vertical speed (speedY) to a positive value.
   */
  jump() {
    this.speedY = 30;
  }

  /**
   * Increases the character's coin count by 10.
   */
  addCoins() {
    this.coins += 10;
  }

  /**
   * Increases the character's bottle count by 10.
   */
  addBottles() {
    this.bottles += 10;
  }
}
