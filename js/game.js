/**
 * The canvas element where the game is rendered.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * The main game world object.
 * @type {World}
 */
let world;

/**
 * The keyboard input handler.
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * Stores the interval IDs for stoppable intervals.
 * @type {number[]}
 */
let intervalIds = [];

let inGame_sound = new Audio("../audio/game-music.mp3");
let enemy_sounds = [
  new Audio("../audio/chicken.mp3"),
  new Audio("../audio/baby_chicken.mp3"),
];

/**
 * Starts the game by initializing the game world and displaying the game canvas.
 */
function startGame() {
  let startScreen = document.querySelector(".startscreen");
  startScreen.style.zIndex = "-1";
  startScreen.classList.add("d-none");

  showCanvas();
  showCloseButton();
  showFullscreenIcon();

  inGame_sound.play().catch((error) => {
    console.error("Failed to play audio:", error);
  });

  initGame();
  world = new World(canvas, keyboard);

  canvas.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}

/**
 * Displays the game canvas by removing the 'd-none' class.
 */
function showCanvas() {
  let canvas = document.getElementById("canvas");
  canvas.classList.remove("d-none");
}

/**
 * Displays the close button by removing the 'd-none' class.
 */
function showCloseButton() {
  let closeButton = document.querySelector(".close-btn");
  if (closeButton) {
    closeButton.classList.remove("d-none");
  }
}

/**
 * Displays the fullscreen icon by removing the 'd-none' class.
 */
function showFullscreenIcon() {
  let fullscreenIcon = document.querySelector(".fullscreen-icon");
  if (fullscreenIcon) {
    fullscreenIcon.classList.remove("d-none");
  }
}

/**
 * Initializes the canvas element and sets up the initial game state.
 */
function init() {
  canvas = document.getElementById("canvas");
  // world = new World(canvas, keyboard);
}

/**
 * Displays the game controls screen.
 */
function showControls() {
  document.querySelector(".startscreen").classList.add("d-none");
  document.querySelector(".game-controls-container").classList.remove("d-none");
}

/**
 * Displays the game story screen.
 */
function showStory() {
  document.querySelector(".startscreen").classList.add("d-none");
  document.querySelector(".story-container").classList.remove("d-none");
}

/**
 * Displays the start screen and hides other UI elements.
 */
function showStartScreen() {
  document.querySelector(".story-container").classList.add("d-none");
  document.querySelector(".game-controls-container").classList.add("d-none");
  document.querySelector("canvas").classList.add("d-none");
  document.querySelector(".close-btn").classList.add("d-none");
  document.querySelector(".fullscreen-icon").classList.add("d-none");
  document.querySelector(".game-over-container").classList.add("d-none");
  document.querySelector(".startscreen").classList.remove("d-none");
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".startscreen").classList.remove("d-none");
  document.querySelector(".story-container").classList.add("d-none");
  document.querySelector(".game-controls-container").classList.add("d-none");
});

function restartGame() {
  exitGame();
  init();
  startGame();
}

/**
 * Closes Controls window when clicked outside dialogue window
 */

document.addEventListener("DOMContentLoaded", () => {
  const controlsContainer = document.getElementById("controlsContainer");
  const startscreen = document.getElementById("startscreen");

  document.addEventListener("click", (event) => {
    if (
      !controlsContainer.contains(event.target) &&
      !startscreen.contains(event.target)
    ) {
      controlsContainer.classList.add("d-none");
      startscreen.classList.remove("d-none");
    }
  });

  controlsContainer.addEventListener("click", (event) => {
    event.stopPropagation();
  });
});

/**
 * Closes Story window when clicked outside dialogue window
 */

document.addEventListener("DOMContentLoaded", () => {
  const storyContainer = document.getElementById("storyContainer");
  const startscreen = document.getElementById("startscreen");

  document.addEventListener("click", (event) => {
    if (
      !storyContainer.contains(event.target) &&
      !startscreen.contains(event.target)
    ) {
      storyContainer.classList.add("d-none");
      startscreen.classList.remove("d-none");
    }
  });

  storyContainer.addEventListener("click", (event) => {
    event.stopPropagation();
  });
});

/**
 * Adds a stoppable interval and stores its ID.
 * @param {Function} fn - The function to execute repeatedly.
 * @param {number} time - The interval time in milliseconds.
 */
function addStoppableInterval(fn, time) {
  let intervalId = setInterval(fn, time);
  intervalIds.push(intervalId);
}

/**
 * Exits the game by clearing all intervals and resetting the UI.
 */
function exitGame() {
  stopAllSounds();

  intervalIds.forEach(clearInterval);
  intervalIds = [];
  clearAllIntervals();

  let startScreen = document.querySelector(".startscreen");
  startScreen.style.zIndex = "";
  showStartScreen();
}

function stopAllSounds() {
  if (inGame_sound) {
    inGame_sound.pause();
  }

  enemy_sounds.forEach((audio) => {
    audio.volume = 0;
  });
}

/**
 * Clears all intervals on the page.
 */
function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) window.clearInterval(i);
}

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }

  if (e.keyCode == 38) {
    keyboard.UP = true;
  }

  if (e.keyCode == 66) {
    keyboard.THROW = true;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }

  if (e.keyCode == 38) {
    keyboard.UP = false;
  }

  if (e.keyCode == 66) {
    keyboard.THROW = false;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }
});

/**
 * Displays a message indicating that the device is not in landscape mode when attempting to enter fullscreen.
 */
function showFullscreenMessage() {
  const message = document.getElementById("fullscreen-message");
  message.classList.add("visible");
  setTimeout(() => {
    message.classList.remove("visible");
  }, 3000);
}

/**
 * Enters fullscreen mode if the device is in landscape orientation, otherwise shows a warning message.
 */
function fullscreen() {
  let fullscreenElement = document.getElementById("fullscreen");

  if (window.innerWidth > window.innerHeight) {
    enterFullscreen(fullscreenElement);
  } else {
    showFullscreenMessage();
  }
}

/**
 * Requests fullscreen mode for a given element.
 * @param {Element} element - The element to enter fullscreen.
 */
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
  adjustCanvasSize(true);
}

/**
 * Exits fullscreen mode.
 */
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
  adjustCanvasSize(false);
}

/**
 * Adjusts the size of the game canvas based on whether the game is in fullscreen mode.
 * @param {boolean} fullscreen - Whether the game is in fullscreen mode.
 */
function adjustCanvasSize(fullscreen) {
  let canvas = document.getElementById("canvas");
  if (fullscreen) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  } else {
    canvas.width = 720;
    canvas.height = 480;
  }
}

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    adjustCanvasSize(false);
  }
});
