chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "showMessage") {
    displayMessage();
  } else if (message.action === "hideMessage") {
    removeMessage();
  }
});

function displayMessage() {
  // Check if the message is already displayed
  if (document.getElementById("tabmaster-message")) return;

  const message = "You have had this tab open for a while, consider closing it!";
  const messageDiv = document.createElement("div");
  messageDiv.id = "tabmaster-message"; // Unique ID for easy removal
  messageDiv.style.position = "fixed";
  messageDiv.style.top = "20px";
  messageDiv.style.left = "20px";
  messageDiv.style.padding = "10px";
  messageDiv.style.backgroundColor = "red";
  messageDiv.style.color = "white";
  messageDiv.style.fontSize = "16px";
  messageDiv.style.zIndex = "9999";
  messageDiv.innerText = message;

  const closeButton = document.createElement("button");
  closeButton.innerText = "Close";
  closeButton.style.marginLeft = "10px";
  closeButton.style.cursor = "pointer";

  closeButton.onclick = () => {
    removeMessage();
    chrome.runtime.sendMessage({ action: "closeMessage" }); // Notify background.js
  };

  messageDiv.appendChild(closeButton);
  document.body.appendChild(messageDiv);
}

// Function to remove the message
function removeMessage() {
  const messageDiv = document.getElementById("tabmaster-message");
  if (messageDiv) messageDiv.remove();
}

