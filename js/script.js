"use strict";
let rockButton = document.getElementById("rock"),
  scissorsButton = document.getElementById("scissors"),
  paperButton = document.getElementById("paper"),
  newGameButton = document.getElementById("newGame"),
  outputContainer = document.getElementById("output"),
  resultContainer = document.getElementById("result"),
  nextClick = false,
  score = { player: 0, computer: 0 },
  maxScore = 10;

function callbackRock() {
  playerMove("rock");
}
function callbackScissors() {
  playerMove("scissors");
}
function callbackPaper() {
  playerMove("paper");
}

function resetValue() {
  nextClick = false;
  score = { player: 0, computer: 0 };
}
function addClassEndGame() {
  rockButton.classList.add("end-game");
  scissorsButton.classList.add("end-game");
  paperButton.classList.add("end-game");
}

function removeClassEndGame() {
  rockButton.classList.remove("end-game");
  scissorsButton.classList.remove("end-game");
  paperButton.classList.remove("end-game");
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
    score.player += 1;
  } else if (winner == "computer") {
    output = "COMPUTER WON:";
    score.computer += 1;
  } else {
    output = "DRAW:";
  }

  output += " you played " + playerMove + ", computer played " + computerMove;

  outputContainer.innerHTML = output;
  resultContainer.innerHTML = score.player + " - " + score.computer;

  if (score.player >= maxScore) {
    endGame("player");
    nextClick = true;
  } else if (score.computer >= maxScore) {
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
  removeClassEndGame();
  resetValue();
  let toHowMany = prompt("Enter what result we play", "10");
  if (Number.isInteger(parseInt(toHowMany))) maxScore = parseInt(toHowMany);
  rockButton.addEventListener("click", callbackRock);
  scissorsButton.addEventListener("click", callbackScissors);
  paperButton.addEventListener("click", callbackPaper);
}

function resetGame() {
  rockButton.removeEventListener("click", callbackRock);
  scissorsButton.removeEventListener("click", callbackScissors);
  paperButton.removeEventListener("click", callbackPaper);

  outputContainer.innerHTML = "Go!!";
  resultContainer.innerHTML = "";

  startGame();
}

function endGame(winner) {
  if (winner == "player")
    outputContainer.innerHTML = "YOU WON THE ENTIRE GAME!!!";
  else outputContainer.innerHTML = "YOU LOST THE ENTIRE GAME!!!";
  addClassEndGame();
}

newGameButton.onclick = resetGame;
