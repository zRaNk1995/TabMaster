// Save original favicon URL
let originalFavicon = document.querySelector("link[rel='icon']")?.href;

let flashing = false;
let isVisible = true;
let interval;
var activeicon = null; 

function getFlashingRedCircleURL() {
  // Define an SVG string representing a red circle
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
      <circle cx="32" cy="32" r="30" fill="red" />
    </svg>
  `;

   const svg2 = `
     <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
      <circle cx="32" cy="32" r="30" fill="transparent" />
    </svg>
  `;
   if( activeicon == svg) {
	activeicon = svg2;
} else {
	activeicon = svg;
	}
	console.log(activeicon);
//  Create a Blob from the SVG string
  const blob = new Blob([activeicon], { type: 'image/svg+xml' });
  // Generate and return an object URL for the Blob
  return URL.createObjectURL(blob);

}
 

// Function to create a favicon element with a given href
function createFavicon(href) {
  let link = document.createElement("link");
  link.rel = "icon";
  link.href = href;
  return link;
}

// Function to show the flashing red circle on the favicon
function startFlashingFavicon() {
 // if (flashing) return;
 // flashing = true;
	interval = setInterval(() => {
  // Create a new favicon element using the dynamically generated SVG URL
  let flashingFaviconURL = getFlashingRedCircleURL();
  let newFavicon = document.createElement("link");
  newFavicon.rel = "icon";
  newFavicon.href = flashingFaviconURL;

  
    // Remove the current favicon if it exists
	console.log("Looking for favicon link");
    const currentFavicon = document.head.querySelector("link[rel='icon']");
    if (currentFavicon) {
      currentFavicon.remove();
    }
    // Toggle between the flashing red circle and the original favicon
   // document.head.appendChild(isVisible ? newFavicon : createFavicon(originalFavicon));
    document.head.appendChild( newFavicon );
    isVisible = !isVisible;
  }, 500);
}

// Function to restore the original favicon and stop flashing
function stopFlashingFavicon() {
  flashing = false;
  clearInterval(interval);
  
  // Remove any favicon currently present
  const currentFavicon = document.head.querySelector("link[rel='icon']");
  if (currentFavicon) {
    currentFavicon.remove();
  }

  // Restore the original favicon
  document.head.appendChild(createFavicon(originalFavicon));
}

// Function to create and display a reminder overlay
function showReminder() {
  if (document.getElementById('tab-reminder-overlay')) return;

  // Create the overlay div
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
  overlay.style.flexDirection = 'column';
  overlay.style.zIndex = '1000';
  overlay.innerText = "You've had this tab open for a while! If you are finished, consider closing it.";

  // Add a close button to dismiss the reminder and stop the flashing
  const closeButton = document.createElement('button');
  closeButton.innerText = 'Dismiss';
  closeButton.style.marginTop = '20px';
  closeButton.style.padding = '10px';
  closeButton.style.cursor = 'pointer';
  closeButton.onclick = () => {
      overlay.remove();
      stopFlashingFavicon();
  };

  overlay.appendChild(closeButton);
  document.body.appendChild(overlay);
}

// Listen for messages from background.js to trigger the reminder and flashing
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "showReminder") {
    showReminder();
    startFlashingFavicon();
  }
});

