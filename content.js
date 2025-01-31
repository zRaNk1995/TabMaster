// Check if a visual reminder is needed every 5 minutes (optional).
const idleThreshold = 30 * 60 * 1000; // 30 minutes in milliseconds

// Function to create and display a reminder overlay on the page.
function showReminder() {
  // Avoid creating multiple overlays.
  if (document.getElementById('tab-reminder-overlay')) return;

  // Create overlay div.
  const overlay = document.createElement('div');
  overlay.id = 'tab-reminder-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.color = 'white';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '1000';
  overlay.innerText = "You've had this tab open for a while! Consider taking a break or closing it.";

  // Add a close button.
  const closeButton = document.createElement('button');
  closeButton.innerText = 'Dismiss';
  closeButton.style.marginTop = '20px';
  closeButton.style.padding = '10px';
  closeButton.onclick = () => overlay.remove();
  overlay.appendChild(closeButton);

  document.body.appendChild(overlay);
}

// Start the timer and check idle time.
setTimeout(showReminder, idleThreshold);

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "showReminder") {
    showReminder();
  }
});
