let originalFavicon = document.querySelector("link[rel='icon']")?.href || "";
let favicon = document.querySelector("link[rel='icon']") || document.createElement("link");
favicon.rel = "icon";
document.head.appendChild(favicon);

let flashing = false;
let interval;

function getSVGBlobURL(svgString) {
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    return URL.createObjectURL(blob);
}

function getFlashingRedCircleURL() {
    return getSVGBlobURL(`
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
            <circle cx="32" cy="32" r="30" fill="red" />
        </svg>
    `);
}

function getNullPlaceholderURL() {
    return getSVGBlobURL(`
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
            <circle cx="32" cy="32" r="30" fill="transparent" />
        </svg>
    `);
}

function startFlashingFavicon() {
    if (flashing) return;

    flashing = true;
    let isRedCircle = true;
    let redCircleURL = getFlashingRedCircleURL();
    let nullPlaceholderURL = getNullPlaceholderURL();

    interval = setInterval(() => {
        favicon.href = isRedCircle ? redCircleURL : nullPlaceholderURL;
        isRedCircle = !isRedCircle;
    }, 500);
}

function stopFlashingFavicon() {
    if (!flashing) return;

    clearInterval(interval);
    flashing = false;
    favicon.href = originalFavicon;
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "startFlashing") startFlashingFavicon();
    if (message.action === "stopFlashing") stopFlashingFavicon();
});
