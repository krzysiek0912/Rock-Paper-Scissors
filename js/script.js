"use strict";
let buttons = document.querySelectorAll(".player-move"),
  newGameButton = document.getElementById("newGame"),
  outputContainer = document.getElementById("output"),
  resultContainer = document.getElementById("result"),
  nextClick = false,
  params = {
    rounds: 0,
    score: { player: 0, computer: 0 },
    maxScore: 10,
    gameEnd: false
  };

function callbackMove(event) {
  event.preventDefault();
  let move = event.target.getAttribute("data-move");

  playerMove(move);
}

function EventToButtons(remove) {
  for (var i = 0; i < buttons.length; i++) {
    var self = buttons[i];
    if (remove) {
      self.removeEventListener("click", callbackMove);
    } else {
      self.addEventListener("click", callbackMove);
    }
  }
}
function removeEventFromButtons() {
  for (var i = 0; i < buttons.length; i++) {
    var self = buttons[i];

    self.removeEventListener("click", callbackMove);
  }
}
function resetValue() {
  nextClick = false;
  params.score = { player: 0, computer: 0 };
}
function toggleClassDisable() {
  for (var i = 0; i < buttons.length; i++) {
    var self = buttons[i];

    self.classList.toggle("disable");
  }
}

function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getResult(winner, playerMove, computerMove) {
  let output;

  if (nextClick) {
    outputContainer.innerHTML = "Game over, please press the new game button!";
    return;
  }

  if (winner == "player") {
    output = "YOU WON:";
    params.score.player += 1;
  } else if (winner == "computer") {
    output = "COMPUTER WON:";
    params.score.computer += 1;
  } else {
    output = "DRAW:";
  }

  output += " you played " + playerMove + ", computer played " + computerMove;

  outputContainer.innerHTML = output;
  resultContainer.innerHTML =
    params.score.player + " - " + params.score.computer;

  if (params.score.player >= params.maxScore) {
    endGame("player");
    nextClick = true;
  } else if (params.score.computer >= params.maxScore) {
    endGame("computer");
    nextClick = true;
  }
}

function getComputerPick() {
  let Picks = ["rock", "paper", "scissors"];
  return Picks[getRandomNumber(0, 3)];
}

function checkRoundWinner(playerPick, computerPick) {
  let winner;

  if (
    (playerPick == "rock" && computerPick == "scissors") ||
    (playerPick == "paper" && computerPick == "rock") ||
    (playerPick == "scissors" && computerPick == "paper")
  ) {
    winner = "player";
  } else if (playerPick == computerPick) {
    winner = "draw";
  } else {
    winner = "computer";
  }

  return winner;
}

function playerMove(Pick) {
  let outputContainer = document.getElementById("output"),
    resultContainer = document.getElementById("result"),
    computerMove = getComputerPick(),
    winner = checkRoundWinner(Pick, computerMove),
    result = getResult(winner, Pick, computerMove);
}

function startGame() {
  toggleClassDisable();
  resetValue();
  let toHowMany = prompt("Enter what result we play", "10");
  if (Number.isInteger(parseInt(toHowMany)))
    params.maxScore = parseInt(toHowMany);
  EventToButtons();
}

function resetGame() {
  EventToButtons(true);

  outputContainer.innerHTML = "Go!!";
  resultContainer.innerHTML = "";

  startGame();
}

function endGame(winner) {
  if (winner == "player")
    outputContainer.innerHTML = "YOU WON THE ENTIRE GAME!!!";
  else outputContainer.innerHTML = "YOU LOST THE ENTIRE GAME!!!";
  toggleClassDisable();
}

newGameButton.onclick = resetGame;