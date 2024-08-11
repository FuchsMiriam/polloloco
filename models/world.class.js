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
  lastThrowTime = 0;
  throwCooldown = 1500;

  bottleSound;
  coinSound;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

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
      this.checkThrowObjects();
      this.collectBottles();
      this.collectCoins();
    }, 200);

    setInterval(() => {
      this.checkCollisions();
    }, 100);
  }

  checkCollisions() {
    this.collisionWithEndboss = false;
    this.level.enemies.forEach((enemy, index) => {
      if (this.character.isColliding(enemy) && !this.character.isHurt()) {
        console.log('Collision detected with:', enemy);
        console.log('Character Position:', {
          x: this.character.x,
          y: this.character.y,
          width: this.character.width,
          height: this.character.height,
        });
        console.log('Enemy Position:', {
          x: enemy.x,
          y: enemy.y,
          width: enemy.width,
          height: enemy.height,
        });
        if (enemy instanceof Endboss) {
          this.endboss = enemy;
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        } else if (
          this.character.speedY > 0 &&
          this.character.isAboveGround()
        ) {
          console.log('Character is above ground and falling onto:', enemy);
          this.killChickens(enemy, index);
        } else if (!this.character.isAboveGround()) {
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        }
      }
    });
    this.checkThrowableCollisions();
  }

  /*killChickens(enemy) {
    this.character.speedY = 30;
    if (enemy instanceof Chicken || enemy instanceof Chicklets) {
      if (typeof enemy.deathAnimation === "function") {
        enemy.deathAnimation();

        setTimeout(() => {
          enemy.chickenKilled();
          this.deleteChickens(enemy);
        }, 200);
      } else {
        console.error("deathAnimation not defined for:", enemy);
      }
    }
  }*/

  killChickens(enemy) {
    if (enemy instanceof Chicken || enemy instanceof Chicklets) {
      if (this.character.speedY > 0 && this.character.isAboveGround()) {
        console.log('Character is falling from above. Initiating death animation.');
        if (typeof enemy.deathAnimation === "function") {
          enemy.deathAnimation();

          setTimeout(() => {
            enemy.chickenKilled();
            this.deleteChickens(enemy);
          }, 250);
        } else {
          console.error("deathAnimation not defined for:", enemy);
        }
      }
    }
  }

  deleteChickens(enemy) {
    let i = this.level.enemies.indexOf(enemy);
    if (i > -1) {
      this.level.enemies.splice(i, 1);
    } else {
      console.error("Enemy not found in the list");
    }
  }

  checkThrowableCollisions() {
    this.throwableObject.forEach((bottle) => {
      this.level.enemies.forEach((enemy, index) => {
        if (bottle.isColliding(enemy)) {
          if (enemy instanceof Endboss) {
            if (!enemy.endbossIsHurt) {
              this.collisionWithEndboss = true;
              enemy.hurtEndboss();
              this.statusbarEndboss.setPercentage(enemy.energy);
            }
          } else if (enemy instanceof Chicken || enemy instanceof Chicklets) {
            this.killChickens(enemy, index);
          }
        }
      });
    });
  }

  checkThrowObjects() {
    let currentTime = Date.now();
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
