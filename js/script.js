"use strict";

// referencje do html-a
const buttonsMove = document.querySelectorAll(".player-move"),
  modalEndGame = document.getElementById("modal-end-game"),
  newGameButton = document.getElementById("newGame"),
  startGameButton = document.getElementById("startGame"),
  outputContainer = document.getElementById("output"),
  resultContainer = document.getElementById("result"),
  inputName = document.getElementById("playerName"),
  inputMaxScore = document.getElementById("maxScore"),
  headerEndGame = document.querySelector("#modal-end-game header");

// nasłuchiwacze
startGameButton.addEventListener("click", startGame);
newGameButton.addEventListener("click", newGame);

// zmienne globalne
const defaultParams = {
  rounds: 0,
  player: {
    name: "",
    score: 0
  },
  computer: { score: 0 },
  maxScore: 10,
  game: {
    end: false,
    start: false
  },
  progress: [],
  errors: []
};
let params;

startGameButton.addEventListener("click", startGame);
newGameButton.addEventListener("click", newGame);

function printOutput(text, outputContainer) {
  outputContainer.innerHTML = text;
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
  const theadText = ["Round", "Player", "Computer", "Winner", "Result"];

  let table = document.createElement("table"),
    thead = document.createElement("thead"),
    tbody = document.createElement("tbody"),
    trow = document.createElement("tr");

  theadText.forEach(text => {
    let td = document.createElement("td");
    td.innerHTML = text;
    trow.appendChild(td);
  });
  thead.appendChild(trow);

  let progress = params.progress;

  for (var i = 0; i <= progress.length; i++) {
    let trow = document.createElement("tr");
    let progressObj = progress[i];

    for (var round in progressObj) {
      let td = document.createElement("td");
      td.innerHTML = progressObj[round];
      trow.appendChild(td);
    }

    tbody.appendChild(trow);
  }
  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
}

function callbackMove(event) {
  let playerMove = event.target.getAttribute("data-move");
  gameRound(playerMove);
}

function EventToButtonsMove(remove) {
  for (var i = 0; i < buttonsMove.length; i++) {
    let self = buttonsMove[i];
    if (remove) {
      self.removeEventListener("click", callbackMove);
    } else {
      self.addEventListener("click", callbackMove);
    }
  }
}

function resetValue() {
  params = JSON.parse(JSON.stringify(defaultParams));
}

function toggleClassDisable() {
  for (var i = 0; i < buttonsMove.length; i++) {
    let self = buttonsMove[i];
    if (params.game.start === true) {
      self.classList.remove("disable");
    } else {
      self.classList.add("disable");
    }
  }
}

function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function runModalWithTable() {
  const table = createTableWithScore();
  const tableContainer = document.querySelector(".tableContainer");
  tableContainer.innerHTML = "";

  tableContainer.appendChild(table);

  showModal(null, "#modal-end-game");
}
function getResult(winner) {
  let { player, computer, maxScore } = params;

  switch (winner) {
    case "player":
      player.score += 1;
      break;
    case "computer":
      computer.score += 1;
      break;
    default:
      console.log("Draw");
  }

  if (player.score >= maxScore) endGame("player");

  if (computer.score >= maxScore) endGame("computer");

  return player.score + " - " + computer.score;
}

function printResult(winner, playerMove, computerMove) {
  let output;
  let { game, player, computer, rounds } = params;

  if (game.end) {
    output = "Game over, please press the new game button!";
    printOutput(output, outputContainer);
    const table = createTableWithScore();
    resultContainer.innerHTML = "Rounds: " + rounds;
    resultContainer.appendChild(table);
    return;
  }

  if (winner == "player") {
    output = player.name + " WON: ";
  } else if (winner == "computer") {
    output = "COMPUTER WON: ";
  } else {
    output = "DRAW: ";
  }

  output +=
    player.name + " played " + playerMove + ", computer played " + computerMove;

  result = player.score + " - " + computer.score + "<br> Rounds: " + rounds;

  printOutput(output, outputContainer);
  printOutput(result, resultContainer);
}

function getComputerMove() {
  let movements = ["rock", "paper", "scissors"];
  return movements[getRandomNumber(0, 3)];
}

function checkRoundWinner(playerMove, computerMove) {
  let winner;

  if (
    (playerMove == "rock" && computerMove == "scissors") ||
    (playerMove == "paper" && computerMove == "rock") ||
    (playerMove == "scissors" && computerMove == "paper")
  ) {
    winner = "player";
  } else if (playerMove == computerMove) {
    winner = "draw";
  } else {
    winner = "computer";
  }

  return winner;
}
function addRound(playerMove, computerMove, winner, result) {
  params.rounds++;
  let roundObj = {
    round: params.rounds,
    playerMove,
    computerMove,
    winner,
    result
  };

  params.progress.push(roundObj);
}

function gameRound(playerMove) {
  let computerMove = getComputerMove(),
    winner = checkRoundWinner(playerMove, computerMove),
    result = getResult(winner);

  addRound(playerMove, computerMove, winner, result);
  printResult(winner, playerMove, computerMove);

  if (params.game.end) {
    runModalWithTable();
    EventToButtonsMove(true);
  }
  // console.log(result);
}

function startGame() {
  resetValue();
  const toHowMany = inputMaxScore.value;

  params.player.name = inputName.value;
  params.game.start = true;
  if (Number.isInteger(parseInt(toHowMany)) && toHowMany > 0) {
    params.maxScore = parseInt(toHowMany);
  } else {
    params.errors.push("You gave the wrong value");
    addErrorToModal();
    showModal(null, "#modal-error");
    return;
  }
  toggleClassDisable();
  EventToButtonsMove();
  hideModals();
}

function newGame() {
  showModal(null, "#modal-new-game");
  EventToButtonsMove(true);
  printOutput("Go!!", outputContainer);
  printOutput("", resultContainer);
}

function endGame(winner) {
  let name = params.player.name.toUpperCase(),
    message;
  if (winner == "player") {
    message = name + " WON THE ENTIRE GAME!!!";
    printOutput(message, outputContainer);
    printOutput(message, headerEndGame);
  } else {
    message = name + " LOST THE ENTIRE GAME!!!";
    printOutput(message, outputContainer);
    printOutput(message, headerEndGame);
  }
  params.game.end = true;
  params.game.start = false;
  toggleClassDisable();
}
