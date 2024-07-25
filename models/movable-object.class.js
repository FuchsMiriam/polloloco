class MovableObject {
  x = 120;
  y = 215;
  img;
  height = 200;
  width = 120;
  imageCache = {};
  currentImage = 0;
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 3;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround(){return this.y < 210;}

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   *
   *@param {Array} array - Ein Array von Bildpfaden z. B. ['img/image1.png', 'img/image2.png', ...]
   */
  loadImages(array) {
    array.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  playAnimation(images) {
    let i = this.currentImage % this.IMAGES_WALKING.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveRight() {
    console.log("Moving right!");
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
