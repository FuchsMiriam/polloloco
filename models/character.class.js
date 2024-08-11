class Character extends MovableObject {
  height = 220;
  width = 120;
  speed = 10;
  world;
  x = 120;

  offset = {
    top: 120,
    bottom: -10,
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

  /**
   * Initiates the animation and movement handling for the character.
   * This function triggers movement, animation, and idle state management.
   */
  animate() {
    this.handleMovement();
    this.handleAnimations();
    this.handleIdle();
  }

  /**
   * Manages the character's movement by checking keyboard input for right, left, and jump actions.
   * Also updates the camera position.
   */
  handleMovement() {
    setInterval(() => {
      this.manageMovement();
      this.handleJump();
      this.updateCamera();
    }, 1000 / 60);
  }

  /**
   * Handles the actual movement of the character based on keyboard input.
   * The character moves left or right, and the corresponding sounds are played.
   */
  manageMovement() {
    walking_sound.pause();
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.resetIdle();
      this.otherDirection = false;
      walking_sound.play();
    } else if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.resetIdle();
      this.otherDirection = true;
      walking_sound.play();
    }
  }

  /**
   * Handles the character's jump action if the appropriate keys are pressed.
   */
  handleJump() {
    if (
      (this.world.keyboard.SPACE || this.world.keyboard.UP) &&
      !this.isAboveGround()
    ) {
      this.jump();
      this.resetIdle();
    }
  }

  /**
   * Updates the camera position to follow the character as it moves.
   */
  updateCamera() {
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Manages the character's animations based on its current state (e.g., walking, jumping, hurt, or dead).
   */
  handleAnimations() {
    setInterval(() => {
      if (this.isDead()) {
        this.deathAnimation();
      } else if (this.isHurt()) {
        this.characterIsHurt();
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING);
        }
      }
    }, 1000 / 10);
  }

  /**
   * Manages the character's idle animations when no movement or action occurs for a period of time.
   */
  handleIdle() {
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

  /**
   * Plays the "hurt" animation and sound for the character, and resets the idle timer.
   */
  characterIsHurt() {
    this.playAnimation(this.IMAGES_HURT);
    hurt_sound.play();
    this.resetIdle();
  }

  /**
   * Plays the death animation and sound for the character, stops other sounds, and triggers the death screen.
   */
  deathAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
    death_sound.play();
    game_music.pause();
    walking_sound.pause();

    setTimeout(() => {
      clearAllIntervals();
      deathScreen();
    }, 1500);
  }

  /**
   * Initiates the character's jump action, setting vertical speed and playing the jump sound.
   * Also resets the idle timer.
   */
  jump() {
    this.speedY = 30;
    jumping_sound.play();
    this.resetIdle();
  }

  /**
   * Resets the idle timer, indicating that the character has moved or performed an action.
   */
  resetIdle() {
    this.lastMovementTime = Date.now();
    snoring_sound.pause();
  }

  /**
   * Checks the duration of inactivity to determine if the character should enter a short or long idle state.
   */
  checkIdleState() {
    const idleTime = Date.now() - this.lastMovementTime;
    if (idleTime > 30000) {
      this.characterLongIdle();
    } else if (idleTime > 15000) {
      this.characterIdleAnimation();
    }
  }

  /**
   * Plays the character's short idle animation and stops the snoring sound.
   */
  characterIdleAnimation() {
    this.playAnimation(this.IMAGES_IDLE);
    snoring_sound.pause();
  }

  /**
   * Plays the character's long idle animation and starts the snoring sound.
   */
  characterLongIdle() {
    this.playAnimation(this.IMAGES_LONG_IDLE);
    snoring_sound.play();
  }
}
