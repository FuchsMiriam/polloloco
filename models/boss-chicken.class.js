class Endboss extends MovableObject {
  height = 350;
  width = 300;
  y = 95;
  speed = 25;

  offset = {
    top: 90,
    bottom: 40,
    left: 35,
    right: 35,
  };

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "./img/4_enemie_boss_chicken/3_attack/G13.png",
    "./img/4_enemie_boss_chicken/3_attack/G14.png",
    "./img/4_enemie_boss_chicken/3_attack/G15.png",
    "./img/4_enemie_boss_chicken/3_attack/G16.png",
    "./img/4_enemie_boss_chicken/3_attack/G17.png",
    "./img/4_enemie_boss_chicken/3_attack/G18.png",
    "./img/4_enemie_boss_chicken/3_attack/G19.png",
    "./img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_WALKING = [
    "./img/4_enemie_boss_chicken/1_walk/G1.png",
    "./img/4_enemie_boss_chicken/1_walk/G2.png",
    "./img/4_enemie_boss_chicken/1_walk/G3.png",
    "./img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_HURT = [
    "./img/4_enemie_boss_chicken/4_hurt/G21.png",
    "./img/4_enemie_boss_chicken/4_hurt/G22.png",
    "./img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "./img/4_enemie_boss_chicken/5_dead/G24.png",
    "./img/4_enemie_boss_chicken/5_dead/G25.png",
    "./img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  hadFirstContact = false;
  i = 0;

  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 3000;
    this.endbossIsHurt = false;

    this.animate();
  }

  /**
   * Initiates the animation sequence for the endboss. This function continuously checks the state of the endboss
   * and triggers the appropriate animations and sounds based on its current state (alive, dead, or in combat).
   * The animation loop runs at 250ms intervals.
   */
  animate() {
    setInterval(() => {
      if (this.isDead()) {
        this.handleDeath();
      } else if (!this.hadFirstContact) {
        this.checkFirstContact();
      } else {
        this.handlePostContact();
      }
      world.showEndbossHealthbar();
    }, 250);
  }

  /**
   * Handles the death animation and any associated effects.
   */
  handleDeath() {
    this.deathAnimation();
  }

  /**
   * Checks if the first contact with the player has occurred and handles it.
   */
  checkFirstContact() {
    if (world.character.x > 2500) {
      this.firstContactRoutine();
    } else {
      this.playAnimation(this.IMAGES_ALERT);
    }
  }

  /**
   * Handles the animations and actions after the first contact with the player.
   */
  handlePostContact() {
    if (this.checkEndbossAttack()) {
      this.attackAnimation();
    } else {
      this.firstContactAnimation();
    }
  }

  /**
   * Triggers the routine that runs when the endboss first comes into contact with the player.
   * This includes stopping the background music and other sounds, and starting the endboss fight music.
   */
  firstContactRoutine() {
    this.hadFirstContact = true;
    game_music.pause();
    chicken_sound.pause();
    endboss_fight.play();
  }

  /**
   * Handles the animation sequence that occurs after the first contact with the player.
   * Initially, the endboss plays an alert animation, then switches to a walking animation and moves left.
   */
  firstContactAnimation() {
    if (this.i < 10) {
      this.playAnimation(this.IMAGES_ALERT);
    } else {
      this.playAnimation(this.IMAGES_WALKING);
      this.moveLeft();
    }
    this.i++;
  }

  /**
   * Checks if the endboss is currently moving.
   *
   * @returns {boolean} - Returns true if the endboss is moving (i.e., has a speed greater than 0).
   */
  isMoving() {
    return this.speed > 0;
  }

  /**
   * Plays the attack animation if the endboss is close enough to the player and not currently hurt or dead.
   */
  attackAnimation() {
    if (this.checkEndbossAttack() && !this.endbossIsHurt && !this.isDead()) {
      this.playAnimation(this.IMAGES_ATTACK);
      endboss_attack.play();
    }
  }

  /**
   * Checks if the endboss can attack, based on distance from the player.
   * @returns {boolean} True if the endboss is close enough to attack.
   */
  checkEndbossAttack() {
    return this.distanceCharacterEndboss() < 60;
  }

  /**
   * Calculates the horizontal distance between the endboss and the character in the game.
   *
   * @returns {number} The absolute horizontal distance between the endboss and the character.
   */
  distanceCharacterEndboss() {
    return Math.abs(this.x - world.character.x);
  }

  /**
   * Plays the "hurt" animation for the endboss and triggers the associated sound effect.
   */
  endbossIsHurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
    endboss_hit.play();
  }

  /**
   * Plays the death animation for the endboss, pauses the fight music, and plays the victory sound.
   * After a delay, all intervals are cleared, and the game won routine is triggered.
   */
  deathAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
    endboss_fight.pause();
    win_sound.play();

    setTimeout(() => {
      clearAllIntervals();
      gameWon();
    }, 1500);
  }
}
