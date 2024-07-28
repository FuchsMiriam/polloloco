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

  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
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
    return this.y < 210;
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof Chicklets
    ) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  /*isColliding(obj) {
    return (
      this.X + this.width >= obj.X &&
      this.X <= obj.X + obj.width &&
      this.Y + this.offsetY + this.height >= obj.Y &&
      this.Y + this.offsetY <= obj.Y + obj.height &&
      obj.onCollisionCourse
    ); // Optional: hiermit könnten wir schauen, ob ein Objekt sich in die richtige Richtung bewegt. Nur dann kollidieren wir. Nützlich bei Gegenständen, auf denen man stehen kann.
  }*/

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

  /*playAnimation(images) {
    let i = this.currentImage % this.IMAGES_WALKING.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }*/

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
}
