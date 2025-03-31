// Declaring a configuration object that contains the necessary classes and selectors.
const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn", // Fixed missing dot prefix
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

// Function to show input error with dynamic settings
const showInputError = (formEl, inputEl, errorMessage, config) => {
  const errorMsgId = inputEl.id + "-error";
  const errorMsgEl = formEl.querySelector(`#${errorMsgId}`);

  errorMsgEl.textContent = errorMessage;
  inputEl.classList.add(config.inputErrorClass);
};

// Function to hide input error with dynamic settings
const hideInputError = (formEl, inputEl, config) => {
  const errorMsgId = inputEl.id + "-error";
  const errorMsgEl = formEl.querySelector(`#${errorMsgId}`);

  errorMsgEl.textContent = "";
  inputEl.classList.remove(config.inputErrorClass);
};

// Function to check input validity
const checkInputValidity = (formEl, inputEl, config) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage, config);
  } else {
    hideInputError(formEl, inputEl, config);
  }
};

// Function to check if any input is invalid
const hasInvalidInput = (inputList) => {
  return inputList.some((input) => !input.validity.valid);
};

// Function to toggle button state based on form validity
const toggleButtonState = (inputList, buttonEl, config) => {
  if (hasInvalidInput(inputList)) {
    buttonEl.classList.add(config.inactiveButtonClass);
    buttonEl.disabled = true;
  } else {
    buttonEl.classList.remove(config.inactiveButtonClass);
    buttonEl.disabled = false;
  }
};

// Function to disable button
const disableButton = (buttonEl, config) => {
  buttonEl.classList.add(config.inactiveButtonClass);
  buttonEl.disabled = true;
};

const resetValidation = (formEl, config = settings) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(config.submitButtonSelector);

  inputList.forEach((inputEl) => hideInputError(formEl, inputEl, config));
  toggleButtonState(inputList, buttonElement, config);
};

// Function to add event listeners to form inputs
const setEventListeners = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", () => {
      checkInputValidity(formEl, inputEl, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

// Main function to enable validation on all forms
const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });
};

// Enable validation with the defined settings
enableValidation(settings);
