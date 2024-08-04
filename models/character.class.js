class Character extends MovableObject {
  height = 220;
  width = 120;
  speed = 10;
  world;
  x = 120;

  offset = {
    top: 120,
    bottom: 20,
    left: 30,
    right: 30,
  };

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "./img/2_character_pepe/5_dead/D-51.png",
    "./img/2_character_pepe/5_dead/D-52.png",
    "./img/2_character_pepe/5_dead/D-53.png",
    "./img/2_character_pepe/5_dead/D-54.png",
    "./img/2_character_pepe/5_dead/D-55.png",
    "./img/2_character_pepe/5_dead/D-56.png",
    "./img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "./img/2_character_pepe/4_hurt/H-41.png",
    "./img/2_character_pepe/4_hurt/H-42.png",
    "./img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "./img/2_character_pepe/1_idle/idle/I-2.png",
    "./img/2_character_pepe/1_idle/idle/I-3.png",
    "./img/2_character_pepe/1_idle/idle/I-4.png",
    "./img/2_character_pepe/1_idle/idle/I-5.png",
    "./img/2_character_pepe/1_idle/idle/I-6.png",
    "./img/2_character_pepe/1_idle/idle/I-7.png",
    "./img/2_character_pepe/1_idle/idle/I-8.png",
    "./img/2_character_pepe/1_idle/idle/I-9.png",
    "./img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONG_IDLE = [
    "./img/2_character_pepe/1_idle/long_idle/I-11.png",
    "./img/2_character_pepe/1_idle/long_idle/I-12.png",
    "./img/2_character_pepe/1_idle/long_idle/I-13.png",
    "./img/2_character_pepe/1_idle/long_idle/I-14.png",
    "./img/2_character_pepe/1_idle/long_idle/I-15.png",
    "./img/2_character_pepe/1_idle/long_idle/I-16.png",
    "./img/2_character_pepe/1_idle/long_idle/I-17.png",
    "./img/2_character_pepe/1_idle/long_idle/I-18.png",
    "./img/2_character_pepe/1_idle/long_idle/I-19.png",
    "./img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  walking_sound = new Audio("audio/walking.mp3");
  jumping_sound = new Audio("audio/jump.mp3");
  snoring_sound = new Audio("audio/snoring.mp3");
  hurt_sound = new Audio("audio/hurt.mp3");
  death_sound = new Audio("audio/death.mp3");

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.applyGravity();
    this.animate(this.IMAGES_WALKING);
    this.lastMovementTime = Date.now();
  }

  animate() {
    setInterval(() => {
      this.walking_sound.pause();
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.resetIdle();
        this.otherDirection = false;
        this.walking_sound.play();
      }
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.resetIdle();
        this.otherDirection = true;
        this.walking_sound.play();
      }

      if (
        (this.world.keyboard.SPACE && !this.isAboveGround()) ||
        (this.world.keyboard.UP && !this.isAboveGround())
      ) {
        this.jump();
        this.resetIdle();
      }

      //this.checkIdleState();

      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    setInterval(() => {
      /*if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
        this.death_sound.play();
        this.walking_sound.pause();
      }*/ if (this.isDead()) {
        this.deathAnimation();
      } else if (this.isHurt()) {
        //this.playAnimation(this.IMAGES_HURT);
        this.characterIsHurt();
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING);
        }
      }
    }, 1000 / 10);

    setInterval(() => {
      if (!this.isAboveGround() && !this.isDead() && !this.isHurt()) {
        if (this.idleState === "long") {
          this.characterLongIdle();
        } else {
          this.characterIdleAnimation();
        }
      }

      this.checkIdleState();
    }, 1000 / 5);
  }

  characterIsHurt() {
    this.playAnimation(this.IMAGES_HURT);
    this.hurt_sound.play();
    this.resetIdle();
  }

  deathAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
    this.death_sound.play();
    inGame_sound.pause();
    this.walking_sound.pause();

    setTimeout(() => {
      deathScreen();
    }, 1500);
  }

  jump() {
    this.speedY = 30;
    this.jumping_sound.play();
    this.resetIdle();
  }

  resetIdle() {
    this.lastMovementTime = Date.now();
    this.snoring_sound.pause();
  }

  checkIdleState() {
    const idleTime = Date.now() - this.lastMovementTime;
    if (idleTime > 30000) {
      this.characterLongIdle();
    } else if (idleTime > 15000) {
      this.characterIdleAnimation();
    }
  }

  characterIdleAnimation() {
    this.playAnimation(this.IMAGES_IDLE);
    this.snoring_sound.pause();
  }

  characterLongIdle() {
    this.playAnimation(this.IMAGES_LONG_IDLE);
    this.snoring_sound.play();
  }
  
}
