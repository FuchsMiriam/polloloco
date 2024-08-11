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
  characterIsInvulnerable = false;
  invulnerabilityDuration = 3000;

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

  /**
   * Sets the world context for the character.
   * @function
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Starts the game loops by setting intervals for various game checks and actions.
   * @function
   */
  run() {
    // Check for throw objects, collect bottles and coins every 200 milliseconds
    setInterval(() => {
      this.checkThrowObjects();
      this.collectBottles();
      this.collectCoins();
    }, 200);

    // Check for collisions every 100 milliseconds
    setInterval(() => {
      this.checkCollisions();
    }, 100);
  }

  /*checkCollisions() {
    this.collisionWithEndboss = false;
    this.level.enemies.forEach((enemy, index) => {
      if (this.character.isColliding(enemy) && !this.character.isHurt()) {
        if (enemy instanceof Endboss) {
          this.endboss = enemy;
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        } else if (
          this.character.speedY > 0 &&
          this.character.isAboveGround()
        ) {
          this.killChickens(enemy, index);
        } else if (!this.character.isAboveGround()) {
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        }
      }
    });
    this.checkThrowableCollisions();
  }*/

  /**
   * Checks for collisions between the character and enemies, and handles the collisions.
   * @function
   */
  checkCollisions() {
    this.collisionWithEndboss = false;
    this.level.enemies.forEach((enemy, index) => {
      if (this.character.isColliding(enemy) && !this.characterIsInvulnerable) {
        this.handleEnemyCollision(enemy, index);
      }
    });
    this.checkThrowableCollisions();
  }

  /**
   * Handles the collision between the character and an enemy.
   * @function
   * @param {object} enemy - The enemy that was collided with.
   * @param {number} index - The index of the enemy in the enemies array.
   */
  handleEnemyCollision(enemy, index) {
    if (enemy instanceof Endboss) {
      this.handleEndbossCollision();
    } else if (this.character.speedY > 0 && this.character.isAboveGround()) {
      this.killChickens(enemy, index);
    } else if (!this.character.isAboveGround()) {
      this.character.hit();
      this.statusBar.setPercentage(this.character.energy);
      this.activateInvulnerability();
    }
  }

  /**
   * Activates invulnerability for the character for a specified duration.
   * The character will be immune to damage during this time.
   *
   * @function
   * @memberof World
   * @returns {void}
   */
  activateInvulnerability() {
    this.characterIsInvulnerable = true;
    setTimeout(() => {
      this.characterIsInvulnerable = false;
    }, this.invulnerabilityDuration);
  }

  /**
   * Handles the collision with an Endboss, updating the character's health and status bar.
   * @function
   */
  handleEndbossCollision() {
    this.endboss = this.level.enemies.find((e) => e instanceof Endboss);
    this.character.hit();
    this.statusBar.setPercentage(this.character.energy);
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

  /**
   * Handles the killing of a given enemy if it is of type `Chicken` or `Chicklets`.
   * The enemy is animated with a death animation, then removed from the level's enemies list after a short delay.
   *
   * @param {Chicken|Chicklets} enemy - The enemy object to be killed. Must be an instance of `Chicken` or `Chicklets`.
   * @returns {void}
   * @throws {Error} Throws an error if `deathAnimation` is not defined for the enemy.
   */
  killChickens(enemy) {
    if (enemy instanceof Chicken || enemy instanceof Chicklets) {
      if (this.character.speedY > 0 && this.character.isAboveGround()) {
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

  /**
   * Removes the specified enemy from the level's enemies list.
   *
   * @param {Chicken|Chicklets} enemy - The enemy object to be removed from the level.
   * @returns {void}
   * @throws {Error} Throws an error if the enemy is not found in the level's enemies list.
   */
  deleteChickens(enemy) {
    let i = this.level.enemies.indexOf(enemy);
    if (i > -1) {
      this.level.enemies.splice(i, 1);
    } else {
      console.error("Enemy not found in the list");
    }
  }

  /*checkThrowableCollisions() {
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
  }*/

  /**
   * Checks for collisions between throwable objects and enemies, and handles the collisions.
   * @function
   */
  checkThrowableCollisions() {
    this.throwableObject.forEach((bottle) => {
      this.level.enemies.forEach((enemy, index) => {
        if (bottle.isColliding(enemy)) {
          this.handleCollision(enemy, index);
        }
      });
    });
  }

  /**
   * Handles the collision between a throwable object and an enemy.
   * @function
   * @param {object} enemy - The enemy that was collided with.
   * @param {number} index - The index of the enemy in the enemies array.
   */
  handleCollision(enemy, index) {
    if (enemy instanceof Endboss) {
      this.handleEndbossCollision(enemy);
    } else if (enemy instanceof Chicken || enemy instanceof Chicklets) {
      this.killChickens(enemy, index);
    }
  }

  /**
   * Handles the collision with an Endboss.
   * @function
   * @param {Endboss} endboss - The Endboss that was collided with.
   */
  handleEndbossCollision(endboss) {
    if (!endboss.endbossIsHurt) {
      this.collisionWithEndboss = true;
      endboss.hurtEndboss();
      this.statusbarEndboss.setPercentage(endboss.energy);
    }
  }

  /*checkThrowObjects() {
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
  }*/

  /**
   * Checks if the character can throw an object and handles the throwing process.
   * @function
   */
  checkThrowObjects() {
    if (this.canThrow()) {
      this.createBottle();
      this.updateCharacterState();
    }
  }

  /**
   * Determines whether the character can throw an object based on keyboard input,
   * the number of available bottles, and the cooldown period.
   * @function
   * @returns {boolean} True if the object can be thrown, false otherwise.
   */
  canThrow() {
    let currentTime = Date.now();
    return (
      this.keyboard.THROW &&
      this.character.bottles > 0 &&
      currentTime - this.lastThrowTime >= this.throwCooldown
    );
  }

  /**
   * Creates a new ThrowableObject and adds it to the list of throwable objects.
   * @function
   */
  createBottle() {
    let bottle = new ThrowableObject(
      this.character.x + 20,
      this.character.y + 100,
      this.character.otherDirection
    );
    this.throwableObject.push(bottle);
  }

  /**
   * Updates the character's state after throwing an object, including decreasing
   * the number of bottles, resetting the idle state, and updating the status bar.
   * @function
   */
  updateCharacterState() {
    this.character.bottles -= 1;
    this.character.resetIdle();
    this.statusbarBottle.setPercentage(this.character.bottles);
    this.lastThrowTime = Date.now();
  }

  /**
   * Displays the Endboss health bar on the canvas if the Endboss has had first contact.
   * @function
   */
  showEndbossHealthbar() {
    if (this.endboss && this.endboss.hadFirstContact) {
      this.addToMap(this.statusbarEndboss);
    }
  }

  /**
   * Clears the canvas and redraws all game objects, including background, status bars, and characters.
   * @function
   */
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

  /**
   * Adds a list of objects to the canvas map.
   * @function
   * @param {Array} objects - Array of objects to be added to the map.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Draws an object on the canvas and handles its direction.
   * @function
   * @param {object} mo - The object to be drawn on the canvas.
   */
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

  /**
   * Flips an object horizontally on the canvas.
   * @function
   * @param {object} mo - The object to be flipped.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the canvas state and flips the object back to its original orientation.
   * @function
   * @param {object} mo - The object to be flipped back.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Collects bottles from the level if the character is colliding with them and the number of bottles is less than 100.
   * @function
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

  /**
   * Collects coins from the level if the character is colliding with them.
   * @function
   */
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

  /**
   * Handles the removal of a collected bottle from the level's list of bottles.
   * @function
   * @param {object} bottle - The bottle that was collected.
   */
  bottleCollected(bottle) {
    let i = this.level.bottles.indexOf(bottle);
    if (i > -1) {
      this.level.bottles.splice(i, 1);
    }
  }

  /**
   * Handles the removal of a collected coin from the level's list of coins.
   * @function
   * @param {object} coin - The coin that was collected.
   */
  coinCollected(coin) {
    let i = this.level.coins.indexOf(coin);
    if (i > -1) {
      this.level.coins.splice(i, 1);
    }
  }
}
