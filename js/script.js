"use strict";

const buttons = document.querySelectorAll(".player-move"),
  modalEndGame = document.getElementById("modal-end-game"),
  newGameButton = document.getElementById("newGame"),
  startGameButton = document.getElementById("startGame"),
  outputContainer = document.getElementById("output"),
  resultContainer = document.getElementById("result"),
  inputName = document.getElementById("playerName"),
  inputMaxScore = document.getElementById("maxScore"),
  modals = document.querySelectorAll(".modal"),
  defaultParams = {
    playerName: "",
    rounds: 0,
    score: { player: 0, computer: 0 },
    maxScore: 10,
    gameEnd: false,
    progress: [],
    errors: []
  };

let params = { ...defaultParams };

function hideModals() {
  const allModal = document.querySelectorAll(".modal");
  allModal.forEach(function(modal) {
    modal.classList.remove("show");
  });
  document.querySelector("#modal-overlay").classList.remove("show");
}

function addClassShow(hash) {
  document.querySelector(hash).classList.add("show");
}

function showModal(event, modalHash) {
  hideModals();

  if (!modalHash) modalHash = event.target.hash;
  addClassShow(modalHash);
  if (event) event.preventDefault();
  addClassShow("#modal-overlay");
}

const modalLinks = document.querySelectorAll(".show-modal");

for (var i = 0; i < modalLinks.length; i++) {
  modalLinks[i].addEventListener("click", showModal);
}

function hideModalOverlay(event) {
  event.preventDefault();
  document.querySelector("#modal-overlay").classList.remove("show");
}

const closeButtons = document.querySelectorAll(".modal .close");

for (var i = 0; i < closeButtons.length; i++) {
  closeButtons[i].addEventListener("click", hideModalOverlay);
}

document
  .querySelector("#modal-overlay")
  .addEventListener("click", hideModalOverlay);

for (var i = 0; i < modals.length; i++) {
  modals[i].addEventListener("click", function(event) {
    event.stopPropagation();
  });
}

function addErrorToModal() {
  const errorContent = document.querySelector("#modal-error .content");
  let errors = params.errors;
  errorContent.innerHTML = "";

  for (var i = 0; i < errors.length; i++) {
    let para = document.createElement("p");
    para.innerHTML = errors[i];
    errorContent.appendChild(para);
  }
}

function createTableWithScore() {
  const tbody = document.querySelector(".table tbody");
  tbody.innerHTML = "";
  let progress = params.progress,
    length = progress.length;

  for (var i = 0; i <= length; i++) {
    let trow = document.createElement("tr");
    let progressObj = progress[i];

    for (var round in progressObj) {
      let td = document.createElement("td");
      td.innerHTML = progressObj[round];
      trow.appendChild(td);
    }

    tbody.appendChild(trow);
  }

  return tbody;
}

function callbackMove(event) {
  event.preventDefault();
  let move = event.target.getAttribute("data-move");

  playerMove(move);
}

function EventToButtons(remove) {
  for (var i = 0; i < buttons.length; i++) {
    let self = buttons[i];
    if (remove) {
      self.removeEventListener("click", callbackMove);
    } else {
      self.addEventListener("click", callbackMove);
    }
  }
}

function resetValue() {
  let defaultScore = defaultParams.score;
  let score = { ...defaultScore };
  params = { ...defaultParams, score, progress: [], errors: [] };
}

function toggleClassDisable() {
  for (var i = 0; i < buttons.length; i++) {
    let self = buttons[i];
    self.classList.toggle("disable");
  }
}

function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function runModalWithTable() {
  const tableBody = createTableWithScore();
  const table = document.querySelector(".table table");
  table.appendChild(tableBody);
  showModal(null, "#modal-end-game");
}

function getResult(winner, playerMove, computerMove) {
  let output;
  if (params.gameEnd) {
    outputContainer.innerHTML = "Game over, please press the new game button!";
    return;
  }

  if (winner == "player") {
    output = params.playerName + " WON: ";
    params.score.player += 1;
  } else if (winner == "computer") {
    output = "COMPUTER WON: ";
    params.score.computer += 1;
  } else {
    output = "DRAW: ";
  }

  output +=
    params.playerName +
    " played " +
    playerMove +
    ", computer played " +
    computerMove;

  outputContainer.innerHTML = output;
  resultContainer.innerHTML =
    params.score.player +
    " - " +
    params.score.computer +
    "<br> Liczba rund: " +
    params.rounds;

  if (params.score.player >= params.maxScore) {
    endGame("player");
  } else if (params.score.computer >= params.maxScore) {
    endGame("computer");
  }
  return params.score.player + " - " + params.score.computer;
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
  let computerMove = getComputerPick();

  params.rounds++;

  let winner = checkRoundWinner(Pick, computerMove),
    result = getResult(winner, Pick, computerMove);
  // console.log(result);
  let roundObj = {
    round: params.rounds,
    playerMove: Pick,
    computerMove,
    winner,
    result
  };

  params.progress.push(roundObj);
  if (params.gameEnd) runModalWithTable();
}

function startGame() {
  resetValue();
  const toHowMany = inputMaxScore.value,
    playerName = inputName.value;

  params.playerName = playerName;

  if (Number.isInteger(parseInt(toHowMany)) && toHowMany > 0) {
    params.maxScore = parseInt(toHowMany);
  } else {
    params.errors.push("You gave the wrong value");
    addErrorToModal();
    showModal(null, "#modal-error");
    return;
  }

  toggleClassDisable();
  EventToButtons();
  hideModals();
}

function resetGame() {
  showModal(null, "#modal-new-game");
  EventToButtons(true);

  outputContainer.innerHTML = "Go!!";
  resultContainer.innerHTML = "";
}

function endGame(winner) {
  const header = document.querySelector("#modal-end-game header");

  if (winner == "player") {
    outputContainer.innerHTML = params.playerName + " WON THE ENTIRE GAME!!!";
    header.innerHTML = params.playerName + " WON THE ENTIRE GAME!!!";
  } else {
    outputContainer.innerHTML = params.playerName + " LOST THE ENTIRE GAME!!!";
    header.innerHTML = params.playerName + " LOST THE ENTIRE GAME!!!";
  }

  toggleClassDisable();
  params.gameEnd = true;
}

startGameButton.addEventListener("click", startGame);
newGameButton.addEventListener("click", resetGame);
