"use strict";

const buttons = document.querySelectorAll(".player-move"),
  modalEndGame = document.getElementById("modal-end-game"),
  newGameButton = document.getElementById("newGame"),
  outputContainer = document.getElementById("output"),
  resultContainer = document.getElementById("result"),
  modals = document.querySelectorAll(".modal");
let defaultParams = {
    rounds: 0,
    score: { player: 0, computer: 0 },
    maxScore: 10,
    gameEnd: false,
    progress: []
  },
  params = { ...defaultParams };

var hideModals = function() {
  let allModal = document.querySelectorAll(".modal");
  allModal.forEach(function(modal) {
    modal.classList.remove("show");
  });
};

var addClassShow = function(hash) {
  document.querySelector(hash).classList.add("show");
};

var showModal = function(event, modalHash) {
  hideModals();
  if (!modalHash) modalHash = event.target.hash;
  addClassShow(modalHash);
  if (event) event.preventDefault();
  addClassShow("#modal-overlay");
};

// Mimo, że obecnie mamy tylko jeden link, stosujemy kod dla wielu linków. W ten sposób nie będzie trzeba go zmieniać, kiedy zechcemy mieć więcej linków lub guzików otwierających modale

var modalLinks = document.querySelectorAll(".show-modal");

for (var i = 0; i < modalLinks.length; i++) {
  modalLinks[i].addEventListener("click", showModal);
}

// Dodajemy też funkcję zamykającą modal, oraz przywiązujemy ją do kliknięć na elemencie z klasą "close".

var hideModalOverlay = function(event) {
  event.preventDefault();
  document.querySelector("#modal-overlay").classList.remove("show");
};

var closeButtons = document.querySelectorAll(".modal .close");

for (var i = 0; i < closeButtons.length; i++) {
  closeButtons[i].addEventListener("click", hideModalOverlay);
}

// Dobrą praktyką jest również umożliwianie zamykania modala poprzez kliknięcie w overlay.

document
  .querySelector("#modal-overlay")
  .addEventListener("click", hideModalOverlay);

// Musimy jednak pamiętać, aby zablokować propagację kliknięć z samego modala - inaczej każde kliknięcie wewnątrz modala również zamykałoby go.

for (var i = 0; i < modals.length; i++) {
  modals[i].addEventListener("click", function(event) {
    event.stopPropagation();
  });
}

function createTableWithScore() {
  var tbody = document.querySelector(".table tbody");

  let progress = params.progress,
    length = progress.length;
  console.log(progress);
  for (var i = 0; i <= length; i++) {
    let trow = document.createElement("tr");
    // console.log(progress[i]);
    let progressObj = progress[i];

    for (var round in progressObj) {
      // console.log(round);

      let td = document.createElement("td");

      td.innerHTML = progressObj[round];

      trow.appendChild(td);
    }
    tbody.appendChild(trow);
  }
  // var td = document.createElement("td");
  // tbl.style.width = "100%";
  // tbl.setAttribute("border", "1");
  // var tbdy = document.createElement("tbody");
  // for (var i = 0; i < params.progress.length; i++) {
  //   var tr = document.createElement("tr");
  //   for (var j = 0; j < 2; j++) {
  //     if (i == 2 && j == 1) {
  //       break;
  //     } else {
  //       var td = document.createElement("td");
  //       td.appendChild(document.createTextNode("asdasdas \u0020"));
  //       i == 1 && j == 1 ? td.setAttribute("rowSpan", "2") : null;
  //       tr.appendChild(td);
  //     }
  //   }
  //   tbdy.appendChild(tr);
  // }
  // tbl.appendChild(tbdy);
  return tbody;
}
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
  let defaultScore = defaultParams.score;
  let score = { ...defaultScore };
  params = { ...defaultParams, score, progress: [] };
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
  if (params.gameEnd) {
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
  console.log(result);
  params.progress.push({
    round: params.rounds,
    playerMove: Pick,
    computerMove,
    winner,
    result
  });
  console.log(params.progress);
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
  const header = document.querySelector("#modal-end-game header");
  const content = document.querySelector("#modal-end-game .content");

  if (winner == "player") {
    outputContainer.innerHTML = "YOU WON THE ENTIRE GAME!!!";
    header.innerHTML = "YOU WON THE ENTIRE GAME!!!";
  } else {
    outputContainer.innerHTML = "YOU LOST THE ENTIRE GAME!!!";
    header.innerHTML = "YOU WON THE ENTIRE GAME!!!";
  }

  toggleClassDisable();
  params.gameEnd = true;

  let tableBody = createTableWithScore();
  var table = document.querySelector(".table table");
  // table.innerHTML = "";
  table.appendChild(tableBody);
  showModal(null, "#modal-end-game");
}

newGameButton.onclick = resetGame;
