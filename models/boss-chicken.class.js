class Endboss extends MovableObject {
  height = 350;
  width = 300;
  y = 95;
  speed = 5;

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

  animate() {
    setInterval(() => {
      if (this.isDead()) {
        this.deathAnimation();
      } else {
        if (!this.hadFirstContact && world.character.x > 2750) {
          this.firstContactRoutine();
        }
        if (this.hadFirstContact) {
          this.firstContactAnimation();
        } else {
          this.playAnimation(this.IMAGES_ALERT);
        }
        world.showEndbossHealthbar();
      }
    }, 250);
  }

  firstContactRoutine() {
    this.hadFirstContact = true;
    game_music.pause();
    chicken_sound.pause();
    endboss_fight.play();
  }

  firstContactAnimation() {
    if (this.i < 10) {
      this.playAnimation(this.IMAGES_ALERT);
    } else {
      this.playAnimation(this.IMAGES_WALKING);
      this.moveLeft();
    }
    this.i++;
  }

  isMoving() {
    return this.speed > 0;
  }

  endbossIsHurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
    endboss_hit.play();
  }

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
