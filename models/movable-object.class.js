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

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 210;
    }
  }

  /* isColliding(obj) {
    return (
      this.x + this.width >= obj.x &&
      this.x <= obj.x + obj.width &&
      this.y + this.offsetY + this.height >= obj.y &&
      this.y + this.offsetY <= obj.y + obj.height
    );
  }*/

  isColliding(obj) {
    return (
      this.x + this.width - this.offset.right >= obj.x + obj.offset.left &&
      this.x + this.offset.left <= obj.x + obj.width - obj.offset.right &&
      this.y + this.height - this.offset.bottom >= obj.y + obj.offset.top &&
      this.y + this.offset.top <= obj.y + obj.height - obj.offset.bottom
    );
  }

  hit() {
    this.energy -= 5;
    if (this.energy <= 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /*hurtEndboss() {
    this.energy -= 10;
    if (this.energy < 0) {
        this.energy = 0;
    } else {
        this.lastHit = new Date().getTime();
    }
}*/

hurtEndboss() {
  this.energy -= 5;
  if (this.energy <= 0) {
    this.energy = 0;
    this.deathAnimation();
  } else {
    this.endbossIsHurtAnimation();
  }
}

  isHurt() {
    this.timePassed = new Date().getTime() - this.lastHit;
    this.timePassed = this.timePassed / 1000;
    return this.timePassed < 1;
  }

  endbossIsHurt() {
    let timePassed = new Date().getTime() - this.lastHit; 
    timePassed = timePassed / 1000;                         
    return timePassed < 1;    
}

  isDead() {
    return this.energy == 0;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 30;
  }

  addCoins() {
    this.coins += 10;
  }

  addBottles() {
    this.bottles += 10;
  }
}
