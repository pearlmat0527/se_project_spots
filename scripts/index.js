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
const editModalNameInput = document.querySelector("#profile-name-input");
const editModalDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const previewmodal = document.querySelector("#preview-modal");
const previewModalImageEl = previewmodal.querySelector(".modal__img");
const previewModalCaptionEl = previewmodal.querySelector(".modal__caption");
const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

const previewModalCloseBtn = previewmodal.querySelector(".modal__close");
// Get the values from the form inputs
const imageLink = document.querySelector("#add-card-link").value;
const caption = document.querySelector("#add-card-description-input").value;
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");

  const cardLikedBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  // Set image and caption
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  // Add like functionality
  cardLikedBtn.addEventListener("click", () => {
    cardLikedBtn.classList.toggle("card__like-button_liked");
  });

  // Add delete functionality
  cardDeleteBtn.addEventListener("click", () => {
    cardElement.remove(); // Remove the card from the DOM
  });
  previewModalCloseBtn.addEventListener("click", () => {
    closeModal(previewmodal); // Close the preview modal
  });

  // Add image click functionality to show preview
  cardImage.addEventListener("click", () => {
    openModal(previewmodal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");

  // Close modal when clicking outside of modal content
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

editFormElement.addEventListener("submit", handleEditFormSubmit);

// Event Listeners for Profile Edit
profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editModal);
});
editModalCloseBtn.addEventListener("click", () => closeModal(editModal));
addCardModalCloseBtn.addEventListener("click", () => closeModal(addCardModal));

// Open the "New Post" modal
profileAddButton.addEventListener("click", () => {
  openModal(addCardModal);
});

// Render Initial Cards
initialCards.forEach((item) => {
  const cardEl = getCardElement(item);
  cardList.append(cardEl);
});

// Handle adding new card from modal
const addCardForm = document.querySelector(".add-card-modal__form");

addCardForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Create a new card object
  const newCardData = {
    name: caption,
    link: imageLink,
  };

  // Create a new card element using the template
  const newCard = getCardElement(newCardData);

  // Prepend the new card to the left side of the card list
  cardList.prepend(newCard);

  closeModal(addCardModal);
  // Reset the form fields
  addCardForm.reset();
});
