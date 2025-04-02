const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn", // Fixed missing dot prefix
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: ".modal__input_type_error",
  errorClass: ".modal__error_visible",
};

const showInputError = (formEl, inputEl, errorMessage, config) => {
  const errorMsgId = inputEl.id + "-error";
  const errorMsgEl = formEl.querySelector(`#${errorMsgId}`);

  errorMsgEl.textContent = errorMessage;
  inputEl.classList.add(config.inputErrorClass);
};

const hideInputError = (formEl, inputEl, config) => {
  const errorMsgId = inputEl.id + "-error";
  const errorMsgEl = formEl.querySelector(`#${errorMsgId}`);

  errorMsgEl.textContent = "";
  inputEl.classList.remove(config.inputErrorClass);
};

const checkInputValidity = (formEl, inputEl, config) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage, config);
  } else {
    hideInputError(formEl, inputEl, config);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => !input.validity.valid);
};

const toggleButtonState = (inputList, buttonEl, config) => {
  if (hasInvalidInput(inputList)) {
    disableValidationButton(buttonEl, config);
  } else {
    buttonEl.classList.remove(config.inactiveButtonClass);
    buttonEl.disabled = false;
  }
};

const disableValidationButton = (buttonEl, config) => {
  buttonEl.classList.add(config.inactiveButtonClass);
  buttonEl.disabled = true;
};

const resetValidation = (formEl, config = settings) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(config.submitButtonSelector);

  inputList.forEach((inputEl) => hideInputError(formEl, inputEl, config));
  //toggleButtonState(inputList, buttonElement, config);
  disableValidationButton(buttonElement, config);
};

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

const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });
};

enableValidation(settings);
