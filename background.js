let idleTabs = {}; // Store idle time for each tab
let timers = {}; // Store timers for each tab

chrome.storage.sync.get("excludedWebsites", (data) => {
  let excludedWebsites = data.excludedWebsites || [];

  function isExcluded(url) {
    return excludedWebsites.some((excludedUrl) => url.includes(excludedUrl));
  }

  function startIdleTimer(tabId) {
    chrome.storage.sync.get("duration", (data) => {
      const duration = data.duration || 10; // Use user-defined duration

      if (timers[tabId]) clearInterval(timers[tabId]);

      idleTabs[tabId] = 0;
      console.log("Starting idle timer for tabId", tabId, "with duration", duration);

      timers[tabId] = setInterval(() => {
        idleTabs[tabId]++;
        console.log(`Tab ${tabId} idle time: ${idleTabs[tabId]}s`);

        if (idleTabs[tabId] >= duration) {
          chrome.tabs.get(tabId, (tab) => {
            if (isExcluded(tab.url)) {
              clearInterval(timers[tabId]);
              delete timers[tabId];
              return;
            }
            flashFavicon(tabId);
            showMessage(tabId);
          });
          clearInterval(timers[tabId]); // Stop timer once triggered
        }
      }, 1000);
    });
  }

  function resetIdleTimer(tabId) {
    idleTabs[tabId] = 0;
    if (timers[tabId]) {
      clearInterval(timers[tabId]);
      delete timers[tabId];
    }
    stopFlashingFavicon(tabId);
  }

  function flashFavicon(tabId) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: () => {
        if (window.flashInterval) clearInterval(window.flashInterval);

        let isRed = true;
        const link = document.querySelector("link[rel~='icon']") || document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);

        window.flashInterval = setInterval(() => {
          const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="7" fill="${isRed ? 'red' : 'transparent'}" />
            </svg>`;
          const blob = new Blob([svg], { type: "image/svg+xml" });
          const blobUrl = URL.createObjectURL(blob);

          link.href = blobUrl;
          setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
          isRed = !isRed;
        }, 1000);
      },
    });
  }

  function stopFlashingFavicon(tabId) {
    console.log("Stopping favicon flashing for tabId", tabId);
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: () => {
        if (window.flashInterval) {
          clearInterval(window.flashInterval);
          delete window.flashInterval;
        }
        const link = document.querySelector("link[rel~='icon']");
        if (link) link.href = "/favicon.ico"; // Reset favicon
      },
    });
  }

  function showMessage(tabId) {
    chrome.tabs.sendMessage(tabId, { action: "showMessage" });
  }

  chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === "closeMessage") {
      console.log("Message closed. Stopping favicon.");
      resetIdleTimer(sender.tab.id);
    }
  });

  chrome.tabs.onActivated.addListener((activeInfo) => {
    const tabId = activeInfo.tabId;
    if (!timers[tabId]) startIdleTimer(tabId);
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
      if (!timers[tabId]) startIdleTimer(tabId);
    }
  });

  chrome.tabs.onRemoved.addListener((tabId) => {
    resetIdleTimer(tabId);
  });
});
