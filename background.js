let idleTime = 0;
let tabId = null;
let timerInterval = null;

// Start idle timer for a tab
function startIdleTimer(tabId, duration) {
  if (timerInterval) clearInterval(timerInterval);

  idleTime = 0;
  console.log("Starting idle timer for tabId", tabId, "with duration", duration);

  timerInterval = setInterval(() => {
    idleTime++;
    console.log("Idle time for tabId", tabId, ":", idleTime);

    if (idleTime >= duration) {
      flashFavicon(tabId);
      showMessage(tabId);
    }
  }, 1000);
}

// Flash the favicon inside the active tab using an SVG blob
function flashFavicon(tabId) {
  console.log("Flashing favicon for tabId", tabId);

  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: toggleFaviconWithBlob
  });
}

// Function to toggle favicon inside the tab using an SVG blob
function toggleFaviconWithBlob() {
  let isRed = true;
  const link = document.querySelector("link[rel~='icon']") || document.createElement("link");
  link.rel = "icon";
  document.head.appendChild(link);

  setInterval(() => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" fill="${isRed ? 'red' : 'transparent'}" />
      </svg>`;
    
    // Convert SVG to a Blob URL
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const blobUrl = URL.createObjectURL(blob);
    
    link.href = blobUrl;
    
    // Release memory from previous blob
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

    isRed = !isRed;
  }, 1000);
}

// Show message on the tab after idle time is reached
function showMessage(tabId) {
  chrome.tabs.sendMessage(tabId, { action: 'showMessage' });
}

// Listen for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  const activeTabId = activeInfo.tabId;
  chrome.storage.sync.get('duration', (data) => {
    const duration = data.duration || 1;
    startIdleTimer(activeTabId, duration);
  });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    chrome.storage.sync.get('duration', (data) => {
      const duration = data.duration || 1;
      startIdleTimer(tabId, duration);
    });
  }
});
