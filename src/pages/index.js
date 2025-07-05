import { enableValidation, resetValidation } from "../scripts/validation.js";
import "./index.css";
import Api from "../utils/Api.js";
import helper from "../utils/helper.js";
import { v4 as uuidv4 } from "uuid";

const profileEditButton = document.querySelector(".profile__edit-btn");
const profileAddButton = document.querySelector(".profile__add-btn");
const editModal = document.querySelector("#edit-modal");
const addCardModal = document.querySelector("#add-card-modal");
const previewModal = document.querySelector("#preview-modal");
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form_type_delete");

const editForm = editModal.querySelector(".modal__form");
const addCardForm = addCardModal.querySelector(".modal__form");

const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const nameInput = document.querySelector("#edit-name-input");
const descriptionInput = document.querySelector("#edit-description-input");
const imageLinkInput = document.querySelector("#add-card-link");
const captionInput = document.querySelector("#add-card-title");

const previewImage = previewModal.querySelector(".modal__img");
const previewCaption = previewModal.querySelector(".modal__caption");

const cardList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template").content;
const modals = document.querySelectorAll(".modal");

const avatarEditButton = document.querySelector(".profile__avatar-btn");
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarForm = editAvatarModal.querySelector(".modal__form");
const avatarInput = document.querySelector("#edit-avatar-input");
const avatarImage = document.querySelector(".profile__avatar-image");

let selectedCard = null;
let selectedCardId = null;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "63215899-2b48-4151-84fe-cf43c6993746",
    "Content-Type": "application/json",
  },
});

api
  .getApiInfo()
  .then(({ cards, userInfo }) => {
    cards.forEach((cardData) => {
      cardData.uuid = uuidv4();
      const card = createCard(cardData);
      cardList.append(card);
    });

    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    avatarImage.src = userInfo.avatar;
    avatarImage.alt = `${userInfo.name}'s avatar`;
  })
  .catch((err) => {
    console.error("Error loading initial data:", err);
  });

editAvatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const avatarUrl = avatarInput.value.trim();
  const submitBtn = editAvatarForm.querySelector(".modal__submit-btn");
  helper.showLoading(submitBtn, "Saving...");

  api
    .updateAvatar({ avatar: avatarUrl })
    .then((updatedUserInfo) => {
      avatarImage.src = updatedUserInfo.avatar;
      avatarImage.alt = `${updatedUserInfo.name}'s avatar`;
      closeModal(editAvatarModal);
    })
    .catch((err) => {
      console.error("Failed to update avatar:", err);
    })
    .finally(() => {
      helper.hideLoading(submitBtn);
    });
});

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeClose);
  modal.addEventListener("mousedown", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeClose);
  modal.removeEventListener("mousedown", handleOverlayClick);
}

function handleEscapeClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) closeModal(openedModal);
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function createCard(data) {
  const card = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = card.querySelector(".card__image");
  const cardTitle = card.querySelector(".card__title");
  const likeButton = card.querySelector(".card__like-button");
  const deleteButton = card.querySelector(".card__delete-button");

  const uuid = data.uuid || uuidv4();
  card.dataset.uuid = uuid;

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  if (data.isLiked) {
    likeButton.classList.add("card__like-button_liked");
  }

  likeButton.addEventListener("click", () => {
    const isLiked = likeButton.classList.contains("card__like-button_liked");
    const method = isLiked ? api.unlikeCard : api.likeCard;

    method
      .call(api, data._id)
      .then((updatedCard) => {
        if (updatedCard.isLiked) {
          likeButton.classList.add("card__like-button_liked");
        } else {
          likeButton.classList.remove("card__like-button_liked");
        }
      })
      .catch((err) => {
        console.error("Failed to update like status:", err);
      });
  });

  deleteButton.addEventListener("click", () => {
    handleDeleteCard(card, data._id);
  });

  cardImage.addEventListener("click", () => {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return card;
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const updatedName = nameInput.value.trim();
  const updatedAbout = descriptionInput.value.trim();
  const submitBtn = editForm.querySelector(".modal__submit-btn");
  helper.showLoading(submitBtn, "Saving...");

  api
    .editUserInfo({ name: updatedName, about: updatedAbout })
    .then((updatedUserInfo) => {
      profileName.textContent = updatedUserInfo.name;
      profileDescription.textContent = updatedUserInfo.about;
      closeModal(editModal);
    })
    .catch((err) => {
      console.error("Failed to update user info:", err);
    })
    .finally(() => {
      helper.hideLoading(submitBtn);
    });
}

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  const name = captionInput.value.trim();
  const link = imageLinkInput.value.trim();
  const uuid = uuidv4();
  const submitBtn = addCardForm.querySelector(".modal__submit-btn");
  helper.showLoading(submitBtn, "Creating...");

  api
    .addCard({ name, link })
    .then((savedCardData) => {
      savedCardData.uuid = uuid;
      const newCard = createCard(savedCardData);
      cardList.prepend(newCard);
      addCardForm.reset();
      closeModal(addCardModal);
    })
    .catch((err) => {
      console.error("Failed to add card:", err);
    })
    .finally(() => {
      helper.hideLoading(submitBtn);
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = deleteForm.querySelector(".modal__submit-btn");
  helper.showLoading(submitBtn, "Deleting...");

  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      selectedCard = null;
      selectedCardId = null;
      closeModal(deleteModal);
    })
    .catch((err) => {
      console.error("Failed to delete card:", err);
    })
    .finally(() => {
      helper.hideLoading(submitBtn);
    });
}

deleteForm.addEventListener("submit", handleDeleteSubmit);

document.querySelector("#cancel-delete-btn")?.addEventListener("click", () => {
  closeModal(deleteModal);
});

profileEditButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  openModal(editModal);
  resetValidation(editForm);
});

profileAddButton.addEventListener("click", () => {
  openModal(addCardModal);
  resetValidation(addCardForm);
});

editForm.addEventListener("submit", handleEditFormSubmit);
addCardForm.addEventListener("submit", handleAddCardFormSubmit);

// modals.forEach((modal) => {
//   const closeBtn = modal.querySelector(".modal__close-btn, .modal__close");
//   if (closeBtn) closeBtn.addEventListener("click", () => closeModal(modal));
// });

modals.forEach((modal) => {
  const closeButtons = modal.querySelectorAll(
    ".modal__close-btn, .modal__close, .modal__close-preview"
  );
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => closeModal(modal));
  });
});

avatarEditButton.addEventListener("click", () => {
  avatarInput.value = "";
  openModal(editAvatarModal);
  resetValidation(editAvatarForm);
});

enableValidation();
