function showLoading(button, loadingText = "Saving...") {
  button.dataset.originalText = button.textContent;
  button.textContent = loadingText;
  button.disabled = true;
}

function hideLoading(button) {
  button.textContent = button.dataset.originalText;
  button.disabled = false;
}

export default {
  showLoading,
  hideLoading,
};
