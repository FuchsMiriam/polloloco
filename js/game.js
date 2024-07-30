let canvas;
let world;
let keyboard = new Keyboard();
let intervalIds = [];


function startGame() {
  let startScreen = document.querySelector(".startscreen");
  startScreen.style.zIndex = "-1";
  startScreen.classList.add("d-none");
  initGame();
  world = new World(canvas, keyboard);
}

function init() {
  canvas = document.getElementById("canvas");
  //world = new World(canvas, keyboard);
}

function showControls() {
  document.querySelector(".startscreen").classList.add("d-none");
  document.querySelector(".game-controls-container").classList.remove("d-none");
}

function showStory() {
  document.querySelector(".startscreen").classList.add("d-none");
  document.querySelector(".story-container").classList.remove("d-none");
}

function showStartScreen() {
  document.querySelector(".story-container").classList.add("d-none");
  document.querySelector(".game-controls-container").classList.add("d-none");
  document.querySelector("canvas").classList.add("d-none");
  document.querySelector(".close-btn").classList.add("d-none");
  document.querySelector(".fullscreen-icon").classList.add("d-none");
  document.querySelector(".startscreen").classList.remove("d-none");
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".startscreen").classList.remove("d-none");
  document.querySelector(".story-container").classList.add("d-none");
  document.querySelector(".game-controls-container").classList.add("d-none");
});

//Set Interval

function addStoppableInterval(fn, time) {
  let intervalId = setInterval(fn, time);
  intervalIds.push(intervalId);
}

//Exit game

function exitGame() {
  intervalIds.forEach(clearInterval);
  intervalIds = [];
  clearAllIntervals();
  showStartScreen();

}

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

/*function fullscreen(){
  let fullscreen = document.getElementById('fullscreen');
  enterFullscreen(fullscreen);
}*/

function showFullscreenMessage() {
  const message = document.getElementById("fullscreen-message");
  message.classList.add("visible");
  setTimeout(() => {
    message.classList.remove("visible");
  }, 3000);
}

function fullscreen() {
  let fullscreenElement = document.getElementById("fullscreen");

  if (window.innerWidth > window.innerHeight) {
    enterFullscreen(fullscreenElement);
  } else {
    showFullscreenMessage();
  }
}

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

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
  adjustCanvasSize(false);
}

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
