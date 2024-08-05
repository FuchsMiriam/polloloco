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
  statusbarEndboss = new EndbossStatusbar();
  throwableObject = [];
  collisionWithEndboss = false;
  endbossIsDefenseless = false;
  lastThrowTime = 0;
  throwCooldown = 1500;

  bottleSound;
  coinSound;

  /*endboss_fight = new Audio("../audio/endboss_fight.mp3");*/

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

    this.bottleSound = new Audio("../audio/bottle.mp3");
    this.coinSound = new Audio("../audio/coin.mp3");

    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        this.endboss = enemy;
      }
    });

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

  /*checkCollisions() {
    this.collisionWithEndboss = false;
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
      this.throwableObject.forEach((bottle) => {//neu hinzugefügt
        if (bottle.isColliding(enemy)) {
          this.collisionWithEndboss = true;
          enemy.hurtEndboss();
          this.statusbarEndboss.setPercentage(enemy.energy);
        }
      });
    });
  }*/

  checkCollisions() {
    this.collisionWithEndboss = false;
    this.level.enemies.forEach((enemy, index) => {
      if (this.character.isColliding(enemy) && !this.character.isHurt()) {
        if (enemy instanceof Endboss) {
          this.endboss = enemy;
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        } else if (this.character.isAboveGround()) {
          console.log(`Character is above ground and collided with ${enemy.constructor.name}`);
          this.killChickens(enemy, index);
        } else {
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        }
      }
      /*this.throwableObject.forEach((bottle) => {
        if (bottle.isColliding(enemy)) {
          if (enemy instanceof Endboss) {
            this.collisionWithEndboss = true;
            enemy.hurtEndboss();
            this.statusbarEndboss.setPercentage(enemy.energy);
          }
        }
      });*/
    });
    this.checkThrowableCollisions();
  }

  killChickens(enemy, index) {
    if (enemy instanceof Chicken || enemy instanceof Chicklets) {
      if (typeof enemy.deathAnimation === 'function') {
        enemy.deathAnimation();
        
        setTimeout(() => {
          if (index > -1) {
            this.level.enemies.splice(index, 1);
          }
        }, 200);
      } else {
        console.error('deathAnimation nicht definiert für:', enemy);
      }
    }
  }

  /*killChickenWithBottle() {
    this.throwableObject.forEach((bottle) => {
      this.level.enemies.forEach((enemy, index) => {
        if (bottle.isColliding(enemy)) {
          if (enemy instanceof Chicken || enemy instanceof Chicklets) {
            this.killChickens(enemy, index);
          }
        }
      });
    });
  }*/

  checkThrowableCollisions() {
    this.throwableObject.forEach((bottle) => {
      this.level.enemies.forEach((enemy, index) => {
        if (bottle.isColliding(enemy)) {
          if (enemy instanceof Endboss) {
            this.collisionWithEndboss = true;
            enemy.hurtEndboss();
            this.statusbarEndboss.setPercentage(enemy.energy);
          } else if (enemy instanceof Chicken || enemy instanceof Chicklets) {
            this.killChickens(enemy, index);
          }
        }
      });
    });
  }
  


  /*killChickens(enemy, index) {
    // Aufruf der Todesanimation für den Feind
    enemy.deathAnimation();

    // Entferne den Feind aus der Liste der Feinde
    this.level.enemies.splice(index, 1);
  }*/

  /*checkThrowObjects() {
    if (this.keyboard.THROW) {
      let bottle = new ThrowableObject(
        this.character.x + 20,
        this.character.y + 100
      );
      this.throwableObject.push(bottle);
      this.character.bottles -= 1;
      this.character.resetIdle();
      this.statusbarBottle.setPercentage(this.character.bottles);
    }
  }*/

  checkThrowObjects() {
    let currentTime = Date.now();
    //let canThrow =
      //this.endboss && this.endboss.hadFirstContact && this.endboss.isMoving();

    if (
      this.keyboard.THROW &&
      this.character.bottles > 0 &&
      currentTime - this.lastThrowTime >= this.throwCooldown
    ) {
      let bottle = new ThrowableObject(
        this.character.x + 20,
        this.character.y + 100,
        this.character.otherDirection
      );
      this.throwableObject.push(bottle);
      this.character.bottles -= 1;
      this.character.resetIdle();
      this.statusbarBottle.setPercentage(this.character.bottles);

      this.lastThrowTime = currentTime;
    }
  }

  showEndbossHealthbar() {
    if (this.endboss && this.endboss.hadFirstContact) {
      this.addToMap(this.statusbarEndboss);
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
    this.showEndbossHealthbar();

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
      if (this.character.isColliding(bottle) && this.character.bottles < 100) {
        this.bottleCollected(bottle);
        bottleSound.play();
        this.character.addBottles();
        this.statusbarBottle.setPercentage(this.character.bottles);
      }
    });
  }

  collectCoins() {
    this.level.coins.forEach((coin) => {
      if (this.character.isColliding(coin)) {
        this.coinCollected(coin);
        coinSound.play();
        this.character.addCoins();
        this.statusbarCoin.setPercentage(this.character.coins);
      }
    });
  }

  bottleCollected(bottle) {
    let i = this.level.bottles.indexOf(bottle);
    if (i > -1) {
      this.level.bottles.splice(i, 1);
    }
  }

  coinCollected(coin) {
    let i = this.level.coins.indexOf(coin);
    if (i > -1) {
      this.level.coins.splice(i, 1);
    }
  }
}
