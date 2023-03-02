const startContainer = document.getElementById("start-div");
const gameContainer = document.querySelector(".game");
const scoreContainer = document.getElementById("score-id");

let carPosition = {
  x: 0,
  y: 0,
  speed: 5,
};

let player = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
  score: 0,
};

function isCollided(car1, car2) {
  car1Rect = car1.getBoundingClientRect();
  car2Rect = car2.getBoundingClientRect();
  return !(
    car1Rect.bottom < car2Rect.top ||
    car1Rect.top > car2Rect.bottom ||
    car1Rect.right < car2Rect.left ||
    car1Rect.left > car2Rect.right
  );
}
function moveLines() {
  const lines = document.querySelectorAll(".line");
  lines.forEach((line) => {
    var top = line.offsetTop;
    const gameContainerDetails = gameContainer.getBoundingClientRect();
    if (line.offsetTop > gameContainerDetails.bottom) {
      top = 0;
    }
    line.style.top = top + carPosition.speed + "px";
  });
}

function endGame() {
  player.start = false;
  startContainer.classList.remove("hide");

  startContainer.innerHTML =
    "Game Over !<br> Your Final Score is : " +
    player.score +
    "<br> Click here to Restart the Game.";
  player.score = 0;
}

function moveEnemycar(car) {
  const enemy = document.querySelectorAll(".enemy-car");
  enemy.forEach(function (enemyCar) {
    if (isCollided(car, enemyCar)) {
      endGame();
    }

    if (enemyCar.y >= 600) {
      enemyCar.y = -350;
      enemyCar.style.left = Math.floor(Math.random() * 330) + "px";
    }
    enemyCar.y += carPosition.speed;
    enemyCar.style.top = enemyCar.y + "px";
  });
}

function renderGame() {
  const car = document.querySelector(".car");

  if (player.start) {
    moveLines();
    moveEnemycar(car);

    const gameContainerDetails = gameContainer.getBoundingClientRect();
    if (player.ArrowUp && carPosition.y > gameContainerDetails.top + 70) {
      carPosition.y -= carPosition.speed;
    }

    if (player.ArrowDown && carPosition.y < gameContainerDetails.bottom - 200) {
      carPosition.y += carPosition.speed;
    }

    if (player.ArrowRight && carPosition.x < gameContainerDetails.width - 70) {
      carPosition.x += carPosition.speed;
    }

    if (player.ArrowLeft && carPosition.x > 0) {
      carPosition.x -= carPosition.speed;
    }
    player.score++;
    let ps = player.score - 1;
    scoreContainer.innerText = ps;

    car.style.top = carPosition.y + "px";
    car.style.left = carPosition.x + "px";
    window.requestAnimationFrame(renderGame);
  }
}

function startGame() {
  startContainer.classList.add("hide");
  gameContainer.innerHTML = "";
  player.start = true;

  const car = document.createElement("div");
  car.classList.add("car");
  gameContainer.appendChild(car);

  const carTop = car.offsetTop;
  const carLeft = car.offsetLeft;
  carPosition.y = carTop;
  carPosition.x = carLeft;
  window.requestAnimationFrame(renderGame);

  for (var i = 0; i < 3; i++) {
    const enemyCar = document.createElement("div");
    enemyCar.classList.add("enemy-car");
    enemyCar.y = (i + 1) * 350 * -1;
    enemyCar.style.top = enemyCar.y + "px";
    enemyCar.style.left = Math.floor(Math.random() * 330) + "px";
    enemyCar.style.backgroundColor = randomColor();
    gameContainer.appendChild(enemyCar);
  }

  var a = 0;
  for (var i = 0; i < 4; i++) {
    const line = document.createElement("div");
    line.classList.add("line");
    line.style.top = a + "px";
    gameContainer.appendChild(line);
    a += 150;
  }
}

function randomColor() {
  function c() {
    let hex = Math.floor(Math.random() * 256).toString(16);
    return ("0" + String(hex)).substr(-2);
  }
  return "#" + c() + c() + c();
}

function handleKeyUp(e) {
  e.preventDefault();
  player[e.key] = false;
}
function handleKeyDown(e) {
  e.preventDefault();
  player[e.key] = true;
}

document.addEventListener("keyup", handleKeyUp);
document.addEventListener("keydown", handleKeyDown);

startContainer.addEventListener("click", startGame);
