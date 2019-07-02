const modals = document.querySelectorAll(".modal"),
  modalLinks = document.querySelectorAll(".show-modal"),
  closeButtons = document.querySelectorAll(".modal .close");

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

for (var i = 0; i < modalLinks.length; i++) {
  modalLinks[i].addEventListener("click", showModal);
}

function hideModalOverlay(event) {
  event.preventDefault();
  document.querySelector("#modal-overlay").classList.remove("show");
}

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
