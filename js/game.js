let canvas;
let world;
let keyboard = new Keyboard();
let intervalIds = [];

/**
 * Starts the game by setting up the initial UI, playing music, and initializing the game world.
 */
function startGame() {
  showLoadingScreen();

  setTimeout(() => {
    setupUI();
    playMusic();
    initGame();
    world = new World(canvas, keyboard);
    buttonsPressEvents();
    preventBodyClick();

    showGame();

  }, 3000);
}

/**
 * Sets up the user interface for the game by hiding or showing specific elements.
 * 
 * This function performs the following tasks:
 * - Hides the start screen.
 * - Hides the game over container.
 * - Shows the game canvas.
 * - Displays the close button.
 * - Displays the fullscreen icon.
 * - Displays the volume icon.
 * - Hides the privacy sidebar.
 * 
 */
function setupUI() {
  hideStartScreen();
  hideGameOverContainer();
  showCanvas();
  showCloseButton();
  showFullscreenIcon();
  showVolumeIcon();
  document.querySelector(".privacy-sidebar").classList.add("d-none");
}

/**
 * Hides the startscreen and shows the loading screen.
 */
function showLoadingScreen() {
  document.getElementById("startscreen").classList.add("d-none");
  document.getElementById("loadingscreen").classList.remove("d-none");
}

/**
 * Hides the loading screen and shows the game.
 */
function showGame() {
  document.getElementById("startscreen").classList.add("d-none");
  document.getElementById("loadingscreen").classList.add("d-none");
  document.getElementById("fullscreen").classList.remove("d-none");
}

/**
 * Hides the start screen by adding the `d-none` class.
 */
function hideStartScreen() {
  const startScreen = document.querySelector(".startscreen");
  if (startScreen) startScreen.classList.add("d-none");
}

/**
 * Hides the game over container by adding the `d-none` class.
 */
function hideGameOverContainer() {
  const gameOverContainer = document.getElementById("gameOver");
  if (gameOverContainer) gameOverContainer.classList.add("d-none");
}

/**
 * Plays the background music and logs an error if it fails.
 */
function playMusic() {
  game_music.play().catch((error) => {
    console.error("Failed to play audio:", error);
  });
}

/**
 * Prevents clicks on the body element from propagating.
 */
function preventBodyClick() {
  document.body.addEventListener("click", (event) => event.stopPropagation());
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
 * Displays the volume icon by removing the `d-none` class.
 */
function showVolumeIcon() {
  let volumeIcon = document.querySelector(".mute");
  if (volumeIcon) {
    volumeIcon.classList.remove("d-none");
  }
}

/**
 * Initializes the canvas element and sets up the initial game state.
 */
function init() {
  canvas = document.getElementById("canvas");
  //world = new World(canvas, keyboard);
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
 * Displays the death screen after a short delay.
 */

function deathScreen() {
  setTimeout(() => {
    document.getElementById("canvas").classList.add("d-none");
    document.querySelector(".close-btn").classList.add("d-none");
    document.querySelector(".fullscreen-icon").classList.add("d-none");
    document.querySelector(".mute").classList.add("d-none");
    document.getElementById("gameOver").classList.remove("d-none");
  }, 500);
  stopAllSounds();
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
  document.querySelector(".mute").classList.add("d-none");
  document.querySelector(".game-over-container").classList.add("d-none");
  document.querySelector(".game-won-container").classList.add("d-none");
  document.querySelector(".startscreen").classList.remove("d-none");
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".startscreen").classList.remove("d-none");
  document.querySelector(".story-container").classList.add("d-none");
  document.querySelector(".game-controls-container").classList.add("d-none");
});

/**
 * Restarts the game
 */
function restartGame() {
  exitGame();
  init();
  startGame();
}

/**
 * Closes Story and Controls window when clicked outside dialogue window
 */
document.addEventListener("DOMContentLoaded", () => {
  const containers = [
    { id: "controlsContainer", hide: "startscreen" },
    { id: "storyContainer", hide: "startscreen" },
  ];

  containers.forEach(({ id, hide }) => {
    const container = document.getElementById(id);
    const hideElement = document.getElementById(hide);

    document.addEventListener("click", (event) => {
      if (
        !container.contains(event.target) &&
        !hideElement.contains(event.target)
      ) {
        container.classList.add("d-none");
        hideElement.classList.remove("d-none");
      }
    });

    container.addEventListener("click", (event) => event.stopPropagation());
  });
});

/**
 * Closes Game over window when clicked outside dialogue window
 */
document.addEventListener("DOMContentLoaded", () => {
  const gameOverContainer = document.getElementById("gameOver");

  document.addEventListener("click", (event) => {
    if (!gameOverContainer.contains(event.target)) {
      gameOverContainer.classList.add("d-none");
    }
  });

  gameOverContainer.addEventListener("click", (event) => {
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
  startScreen.classList.remove("d-none");
  startScreen.style.display = "";
  showStartScreen();
}

/**
 * Pauses all currently playing sounds and resets their playback position to the beginning.
 */
function stopAllSounds() {
  const sounds = [
    game_music,
    chicken_sound,
    endboss_fight,
    death_sound,
    snoring_sound,
  ];
  sounds.forEach((sound) => {
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  });
}

/**
 * Displays the game won message and hides UI elements.
 *
 * Hides the canvas, certain UI controls, and shows the game won message.
 * Calls `stopAllSounds()` to stop all audio playback.
 *
 * @function
 * @returns {void}
 */
function gameWon() {
  document.getElementById("canvas").classList.add("d-none");
  document.querySelector(".close-btn").classList.add("d-none");
  document.querySelector(".fullscreen-icon").classList.add("d-none");
  document.querySelector(".mute").classList.add("d-none");
  document.querySelector(".game-won-container").classList.remove("d-none");
  stopAllSounds();
}

/**
 * Clears all intervals on the page.
 */
function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) window.clearInterval(i);
}

/**
 * Listens for keydown and keyup events to update the `keyboard` object.
 */
window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = true;
  if (e.keyCode == 37) keyboard.LEFT = true;
  if (e.keyCode == 38) keyboard.UP = true;
  if (e.keyCode == 66) keyboard.THROW = true;
  if (e.keyCode == 32) keyboard.SPACE = true;
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 66) keyboard.THROW = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
});

/**
 * Initializes touch event listeners for mobile control buttons.
 *
 * Also prevents default touch behavior on the canvas element.
 */
function buttonsPressEvents() {
  document.getElementById("canvas").addEventListener("touchstart", (e) => {
    e.preventDefault();
  });

  document.getElementById("button-left").addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.LEFT = true;
  });

  document.getElementById("button-left").addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.LEFT = false;
  });

  document
    .getElementById("button-right")
    .addEventListener("touchstart", (e) => {
      e.preventDefault();
      keyboard.RIGHT = true;
    });

  document.getElementById("button-right").addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.RIGHT = false;
  });

  document.getElementById("button-up").addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.UP = true;
  });

  document.getElementById("button-up").addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.UP = false;
  });

  document
    .getElementById("button-throw")
    .addEventListener("touchstart", (e) => {
      e.preventDefault();
      keyboard.THROW = true;
    });

  document.getElementById("button-throw").addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.THROW = false;
  });

  document
    .getElementById("mobile-buttons-container")
    .classList.remove("d-none");
}

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

/**
 * Event listener for fullscreen change events.
 */
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    adjustCanvasSize(false);
  }
});
