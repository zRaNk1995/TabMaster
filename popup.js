document.addEventListener("DOMContentLoaded", () => {
    const durationInput = document.getElementById("duration");
    const saveButton = document.getElementById("save");
    const addExcludeButton = document.getElementById("add-exclude");
    const removeExcludeButton = document.getElementById("remove-exclude");
    const excludedList = document.getElementById("excluded-list");

    // Load stored settings
    chrome.storage.sync.get(["duration", "excludedWebsites"], (data) => {
        if (data.duration) {
            durationInput.value = data.duration;
        }
        if (data.excludedWebsites) {
            updateExcludedList(data.excludedWebsites);
        }
    });

    // Save duration setting
    saveButton.addEventListener("click", () => {
        const duration = parseInt(durationInput.value, 10);
        if (duration > 0) {
            chrome.storage.sync.set({ duration }, () => {
                alert("Settings saved!");
            });
        }
    });

    // Get current tab URL
    function getCurrentTab(callback) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                callback(tabs[0].url);
            }
        });
    }

    // Add current site to excluded list
    addExcludeButton.addEventListener("click", () => {
        getCurrentTab((url) => {
            chrome.storage.sync.get("excludedWebsites", (data) => {
                let excludedWebsites = data.excludedWebsites || [];
                if (!excludedWebsites.includes(url)) {
                    excludedWebsites.push(url);
                    chrome.storage.sync.set({ excludedWebsites }, () => {
                        updateExcludedList(excludedWebsites);
                        alert("Website excluded!");
                    });
                } else {
                    alert("Website is already excluded.");
                }
            });
        });
    });

    // Remove current site from excluded list
    removeExcludeButton.addEventListener("click", () => {
        getCurrentTab((url) => {
            chrome.storage.sync.get("excludedWebsites", (data) => {
                let excludedWebsites = data.excludedWebsites || [];
                if (excludedWebsites.includes(url)) {
                    excludedWebsites = excludedWebsites.filter((site) => site !== url);
                    chrome.storage.sync.set({ excludedWebsites }, () => {
                        updateExcludedList(excludedWebsites);
                        alert("Website removed from exclusions.");
                    });
                } else {
                    alert("Website is not in the excluded list.");
                }
            });
        });
    });

    // Update displayed list of excluded sites
    function updateExcludedList(excludedWebsites) {
        excludedList.innerHTML = "";
        excludedWebsites.forEach((site) => {
            const li = document.createElement("li");
            li.textContent = site;
            excludedList.appendChild(li);
        });
    }
});
