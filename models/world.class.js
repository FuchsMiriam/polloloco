class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new Statusbar();
  statusbarBottle = new BottleStatusbar();
  statusbarCoin = new CoinStatusbar();
  //bottle = [new Bottle()];
  throwableObject = [];

  bottleSound;
  coinSound;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

    this.bottleSound = new Audio("../audio/bottle.mp3");
    this.coinSound = new Audio("../audio/coin.mp3");

    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.collectBottles();
      this.collectCoins();
    }, 500);
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  checkThrowObjects() {
    if (this.keyboard.THROW) {
      let bottle = new ThrowableObject(
        this.character.x + 20,
        this.character.y + 100
      );
      this.throwableObject.push(bottle);
      this.character.resetIdle();
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.statusbarBottle);
    this.addToMap(this.statusbarCoin);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.throwableObject);
    this.addToMap(this.character);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Collect bottles and coins
   */

  collectBottles() {
    this.level.bottles.forEach((bottle) => {
      if (this.character.isColliding(bottle) && this.character.bottles < 80) {
        this.bottleCollected(bottle);
        this.bottleSound.play();
        this.character.addBottles();
        this.statusbarBottle.setPercentage(this.character.bottles);
      }
    });
  }

  collectCoins() {
    this.level.coins.forEach((coin) => {
      if (this.character.isColliding(coin)) {
        this.coinCollected(coin);
        this.coinSound.play();
        this.character.addCoins();
        this.statusbarCoin.setPercentage(this.character.coins);
      }
    });
  }

  bottleCollected(bottle) {
    let i = this.level.bottles.indexOf(bottle);
    if (i > -1) {
      this.level.bottles.splice(i, 1); // Flasche entfernen
    }
  }

  coinCollected(coin) {
    let i = this.level.coins.indexOf(coin);
    if (i > -1) {
      this.level.coins.splice(i, 1); // Münze entfernen
    }
  }
}
