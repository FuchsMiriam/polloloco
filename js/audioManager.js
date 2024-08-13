chicken_sound = new Audio("../audio/chicken.mp3");
chicklet_sound = new Audio("../audio/baby_chicken.mp3");

bottleSound = new Audio("../audio/bottle.mp3");
glass_sound = new Audio("../audio/glass_breaking.mp3");
coinSound = new Audio("../audio/coin.mp3");

endboss_hit = new Audio("../audio/endboss_hit.mp3");
endboss_fight = new Audio("../audio/endboss_fight.mp3");
endboss_attack = new Audio("../audio/endboss_attack.mp3");

walking_sound = new Audio("../audio/walking.mp3");
snoring_sound = new Audio("../audio/snoring.mp3");
jumping_sound = new Audio("../audio/jump.mp3");
hurt_sound = new Audio("../audio/hurt.mp3");
throwing_sound = new Audio("../audio/throw.mp3");
death_sound = new Audio("../audio/death.mp3");

win_sound = new Audio("../audio/win.mp3");
game_music = new Audio("../audio/game-music.mp3");

const allSounds = [
  chicken_sound,
  chicklet_sound,
  bottleSound,
  glass_sound,
  coinSound,
  endboss_hit,
  endboss_fight,
  endboss_dead,
  walking_sound,
  snoring_sound,
  jumping_sound,
  hurt_sound,
  throwing_sound,
  death_sound,
  win_sound,
  game_music,
];

let isMuted = false;

/**
 * Toggles the mute state for all sounds and updates the mute icon accordingly.
 */
function toggleMute() {
  isMuted = !isMuted;
  allSounds.forEach((sound) => {
    sound.muted = isMuted;
  });

  updateMuteIcon(isMuted);
}

/**
 * Updates the mute icon based on the current mute state.
 * Sets the icon image and alternative text depending on whether sounds are muted or not.
 *
 * @function
 * @param {boolean} isMuted - The current mute state.
 * @returns {void}
 */
function updateMuteIcon(isMuted) {
  let image = document.getElementById("soundIcon");

  if (isMuted) {
    image.src = "../img/mute.png";
    image.alt = "Mute";
  } else {
    image.src = "../img/volume.png";
    image.alt = "Volume";
  }
}
