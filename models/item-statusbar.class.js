class ItemStatusbar extends DrawableObject {
    x = 40;
    y = 0;
    width = 250;
    height = 50;
    percentage = 0;
  
    constructor(images, y) {
      super();
      this.y = y;
      this.IMAGES = images;
      this.loadImages(this.IMAGES);
      this.setPercentage(0);
    }
  
    setPercentage(percentage) {
      this.percentage = percentage;
      this.updateImage();
    }
  
    updateImage() {
      let path = this.IMAGES[this.resolveImageIndex()];
      this.img = this.imageCache[path];
    }
  
    resolveImageIndex() {
      const clampedPercentage = Math.max(0, Math.min(this.percentage, 100));
      return Math.floor(clampedPercentage / 20);
    }
  }
  