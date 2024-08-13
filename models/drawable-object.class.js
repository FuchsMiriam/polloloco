class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 215;
  height = 200;
  width = 120;

  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  /**
   * Loads an image from the specified path and assigns it to the `img` property of the object.
   *
   * @param {string} path - The path to the image file.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the loaded image on the canvas context at the object's current position and size.
   *
   * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas where the image should be drawn.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws a rectangular frame around the object if it is an instance of certain classes
   * (Character, Chicken, Chicklets, or Bottle). The frame is blue with a width of 5 pixels.
   *
   * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas where the frame should be drawn.
   */
  drawFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof Chicklets ||
      this instanceof Bottle
    ) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "blue";
      ctx.rect(
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.x + this.width - this.offset.right - (this.x + this.offset.left),
        this.y + this.height - this.offset.bottom - (this.y + this.offset.top)
      );
      ctx.stroke();
    }
  }

  /**
   * Loads multiple images from an array of image paths and caches them.
   *
   *@param {Array} array - An array of image paths z. B. ['img/image1.png', 'img/image2.png', ...]
   */
  loadImages(array) {
    array.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
