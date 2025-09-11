import { detectSite } from "./siteDetection";
import { injectOverlay } from "./overlay";

console.log("AppliStash content script loaded!");

// Function to handle the injection of the overlay
function handleOverlayInjection() {
  console.log(
    "AppliStash: Handling overlay injection for URL:",
    window.location.href
  );

  // Detect which job site we're on
  const site = detectSite(window.location.href);

  if (site) {
    console.log(
      `AppliStash: Detected job site: ${site.name}`
    );

    // Get the current user from Chrome storage
    chrome.storage.local.get(["user"], (result) => {
      if (result.user) {
        console.log(
          "AppliStash: Found user in storage",
          result.user
        );
        // User is logged in, inject the overlay
        injectOverlay(site, result.user);
      } else {
        console.log(
          "AppliStash: User not found in storage, using test user"
        );
        // For testing purposes, create a mock user
        const testUser = {
          name: "Test User",
          email: "test@example.com",
        };

        // Save the test user to storage for future use
        chrome.storage.local.set({ user: testUser }, () => {
          console.log(
            "AppliStash: Saved test user to storage"
          );
        });

        // Inject the overlay with the test user
        injectOverlay(site, testUser);
      }
    });
  } else {
    console.log("AppliStash: Not a supported job site");
  }
}

// Run the injection immediately (don't wait for page load)
handleOverlayInjection();

// Also wait for the DOM to be fully loaded
window.addEventListener("load", () => {
  console.log(
    "AppliStash: Page loaded, checking if we should inject overlay again"
  );
  handleOverlayInjection();
});

// LinkedIn has a single-page application architecture, so we need to listen for URL changes
let lastUrl = window.location.href;
const observer = new MutationObserver(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    console.log("AppliStash: URL changed to", currentUrl);

    // Give the page a moment to update its content
    setTimeout(handleOverlayInjection, 1000);
  }
});

// Start observing
observer.observe(document, {
  subtree: true,
  childList: true,
});
