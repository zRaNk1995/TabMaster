document.getElementById('savePreferences').addEventListener('click', () => {
  const duration = document.getElementById('duration').value;
  const excludedSites = document.getElementById('excludedSites').value.split(',');

  const userPreferences = {
    duration: parseInt(duration),
    excludedSites: excludedSites
  };

  chrome.storage.sync.set(userPreferences, () => {
    alert("Preferences saved!");
  });
});

// Load saved preferences on popup open
chrome.storage.sync.get(["duration", "excludedSites"], (data) => {
  if (data.duration) document.getElementById('duration').value = data.duration;
  if (data.excludedSites) document.getElementById('excludedSites').value = data.excludedSites.join(',');
});
