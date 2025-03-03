// Listen for the message from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'showMessage') {
    displayMessage();
  }
});

function displayMessage() {
  const message = "You have had this tab open for a while, consider closing the tab if you are finished!";
  const messageDiv = document.createElement('div');
  messageDiv.style.position = 'fixed';
  messageDiv.style.top = '20px';
  messageDiv.style.left = '20px';
  messageDiv.style.padding = '10px';
  messageDiv.style.backgroundColor = 'red';
  messageDiv.style.color = 'white';
  messageDiv.style.fontSize = '16px';
  messageDiv.style.zIndex = '9999';
  messageDiv.innerText = message;
  document.body.appendChild(messageDiv);
  setTimeout(() => messageDiv.remove(), 5000); // Remove after 5 seconds
}
