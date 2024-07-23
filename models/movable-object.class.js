class MovableObject {
  x = 120;
  y = 215;
  img;
  height = 200;
  width = 120;

  loadImage(path){
    this.img = new Image();
    this.img.src = path;
  }

  moveRight() {
    console.log("Moving right!");
  }

  moveLeft(){}
}
