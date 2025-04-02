const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "../images/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const profileEditButton = document.querySelector(".profile__edit-btn");
const profileAddButton = document.querySelector(".profile__add-btn");

const editModal = document.querySelector("#edit-modal");
const addCardModal = document.querySelector("#add-card-modal");

const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const addCardModalCloseBtn = addCardModal.querySelector(".modal__close-btn");

const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const editModalNameInput = document.querySelector("#edit-name-input");
const editModalDescriptionInput = document.querySelector(
  "#edit-description-input"
);

const previewmodal = document.querySelector("#preview-modal");
const previewModalImageEl = previewmodal.querySelector(".modal__img");
const previewModalCaptionEl = previewmodal.querySelector(".modal__caption");
const previewModalCloseBtn = previewmodal.querySelector(".modal__close");

const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");
const addCardForm = addCardModal.querySelector(".modal__form");

const imageLinkInput = document.querySelector("#add-card-link");
const captionInput = document.querySelector("#add-card-description-input");
const addButton = addCardForm.querySelector(".modal__submit-btn");

previewModalCloseBtn.addEventListener("click", () => closeModal(previewmodal));

function openModal(modal) {
  modal.classList.add("modal_opened");

  document.addEventListener("keydown", closeModalOnEscape);
  modal.addEventListener("click", closeModalOnOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");

  // Remove event listeners to prevent memory leaks
  document.removeEventListener("keydown", closeModalOnEscape);
  modal.removeEventListener("click", closeModalOnOverlayClick);
}

function closeModalOnEscape(event) {
  if (event.key === "Escape") {
    const openModals = document.querySelectorAll(".modal_opened");
    openModals.forEach((modal) => closeModal(modal));
  }
}

function closeModalOnOverlayClick(event) {
  if (event.target.classList.contains("modal")) {
    closeModal(event.target);
  }
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikedBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  cardLikedBtn.addEventListener("click", () => {
    cardLikedBtn.classList.toggle("card__like-button_liked");
  });

  cardDeleteBtn.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImage.addEventListener("click", () => {
    openModal(previewmodal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  return cardElement;
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

function handleAddCardFormSubmit(event) {
  event.preventDefault();

  const imageLink = imageLinkInput.value.trim();
  const caption = captionInput.value.trim();

  if (imageLink && caption) {
    const newCardData = { name: caption, link: imageLink };
    const newCard = getCardElement(newCardData);

    cardList.prepend(newCard); // Add new card to the beginning

    closeModal(addCardModal);
    addCardForm.reset(); // Clear form inputs

    disableValidationButton(addButton, settings);
  }
}

initialCards.forEach((item) => {
  const cardEl = getCardElement(item);
  cardList.append(cardEl);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
addCardForm.addEventListener("submit", handleAddCardFormSubmit);

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editModal);
  resetValidation(editFormElement);
});

editModalCloseBtn.addEventListener("click", () => closeModal(editModal));
addCardModalCloseBtn.addEventListener("click", () => closeModal(addCardModal));

profileAddButton.addEventListener("click", () => {
  openModal(addCardModal);
});
