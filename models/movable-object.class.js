class MovableObject {
  x = 120;
  y = 215;
  img;
  height = 200;
  width = 120;
  imageCache = {};

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

  moveRight() {
    console.log("Moving right!");
  }

  moveLeft() {}
}
