const IDLE_TIME_IN_MINUTES = 1; // Set how long (in minutes) a tab can stay open

// Monitor when a tab is updated (e.g., loaded or navigated)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    console.log(`Tab ${tabId} loaded, resetting alarm.`);
    resetAlarm(tabId);
  }
});

// Set an alarm for the tab
function resetAlarm(tabId) {
  chrome.alarms.create(`tab-${tabId}`, { delayInMinutes: IDLE_TIME_IN_MINUTES });
  console.log(`Alarm set for tab ${tabId}`);
}

// Handle alarms when they trigger
chrome.alarms.onAlarm.addListener((alarm) => {
  const match = alarm.name.match(/^tab-(\d+)$/);
  if (match) {
    const tabId = parseInt(match[1], 10);
    console.log(`Alarm triggered for tab ${tabId}`);

    // Send a message to the content script in the tab
    chrome.tabs.sendMessage(tabId, { action: "showReminder" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(`Failed to send message to tab ${tabId}: ${chrome.runtime.lastError.message}`);
      } else {
        console.log(`Reminder message sent to tab ${tabId}`, response);
      }
    });
  }
});


