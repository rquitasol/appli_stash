import { isJobSite } from "./siteDetection";
import { injectOverlay, User } from "./overlay";

console.log("AppliStash content script loaded!");

// Check auth status first
let isAuthenticated = false;
let currentUser: User | null = null;

// Function to check if user is authenticated
function checkAuth(): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.storage.local.get(["user"], (result) => {
      if (result.user) {
        console.log(
          "AppliStash: User is authenticated",
          result.user
        );
        isAuthenticated = true;
        currentUser = result.user;
        resolve(true);
      } else {
        console.log(
          "AppliStash: User is NOT authenticated"
        );
        isAuthenticated = false;
        currentUser = null;
        resolve(false);
      }
    });
  });
}

// Function to handle the injection of the overlay
async function handleOverlayInjection() {
  console.log(
    "AppliStash: Handling overlay injection for URL:",
    window.location.href
  );

  // First check if user is authenticated
  const authenticated = await checkAuth();
  if (!authenticated) {
    console.log(
      "AppliStash: Authentication required. Not loading overlay."
    );
    return; // Exit early if not authenticated
  }

  // Check if this is a job site using our detection method
  if (isJobSite()) {
    console.log("AppliStash: Detected job site");
    // User is logged in and on a job site, inject the overlay
    if (currentUser) {
      injectOverlay(currentUser);
    }
  } else {
    console.log("AppliStash: Not a supported job site");
  }
}

// Run the injection after checking authentication
checkAuth().then(() => {
  if (isAuthenticated) {
    handleOverlayInjection();

    // Also setup click listeners for LinkedIn job cards
    setupJobCardClickListeners();
  } else {
    console.log(
      "AppliStash: Not authenticated, skipping initial injection"
    );
  }
});

// Function to set up click listeners on job cards
function setupJobCardClickListeners() {
  if (window.location.href.includes("linkedin.com/jobs")) {
    console.log(
      "AppliStash: Setting up job card click listeners"
    );

    // Use event delegation to catch all clicks on job cards
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      // Check if the click is on a job card or its child elements
      const jobCard = target.closest(
        ".job-card-container, .jobs-search-results__list-item"
      );

      if (jobCard) {
        console.log("AppliStash: Job card clicked");

        // Wait a bit for LinkedIn to update the UI
        setTimeout(() => {
          if (currentUser) {
            // Remove existing overlay
            const existingOverlays =
              document.querySelectorAll(
                ".appli-stash-overlay"
              );
            existingOverlays.forEach((overlay) => {
              if (overlay.parentElement) {
                overlay.parentElement.removeChild(overlay);
              }
            });

            // Re-inject the overlay with fresh data
            injectOverlay(currentUser);
          }
        }, 750); // Give LinkedIn time to update the job details panel
      }
    });

    console.log(
      "AppliStash: Job card click listeners setup complete"
    );
  }
}

// Also wait for the DOM to be fully loaded
window.addEventListener("load", () => {
  console.log(
    "AppliStash: Page loaded, checking if we should inject overlay again"
  );
  if (isAuthenticated) {
    handleOverlayInjection();

    // Re-setup click listeners to ensure they're attached after page load
    setupJobCardClickListeners();
  } else {
    console.log(
      "AppliStash: Not authenticated, skipping load injection"
    );
  }
});

// Add message listener for the popup to request overlay injection
chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    console.log("AppliStash: Received message", message);

    if (message.action === "checkAuth") {
      checkAuth().then((isAuth) => {
        sendResponse({ authenticated: isAuth });
      });
      return true; // Indicate we'll respond asynchronously
    }

    if (message.action === "showOverlay") {
      if (!isAuthenticated) {
        console.log(
          "AppliStash: Cannot show overlay - not authenticated"
        );
        sendResponse({
          success: false,
          error: "Not authenticated",
        });
        return;
      }

      console.log("AppliStash: Manually showing overlay");
      if (currentUser) {
        injectOverlay(currentUser);
        sendResponse({ success: true });
      } else {
        sendResponse({
          success: false,
          error: "User data not available",
        });
      }
      return;
    }
  }
);

// LinkedIn has a single-page application architecture, so we need to listen for URL changes
let lastUrl = window.location.href;
let lastJobTitle = "";
let lastCompanyName = "";

// Observer for URL changes
const urlObserver = new MutationObserver(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    console.log("AppliStash: URL changed to", currentUrl);

    // Give the page a moment to update its content
    if (isAuthenticated) {
      setTimeout(handleOverlayInjection, 1000);
    } else {
      console.log(
        "AppliStash: Not authenticated, skipping URL change injection"
      );
    }
  }
});

// Function to handle job selection changes (for LinkedIn job search)
function setupJobSelectionObserver() {
  if (!isAuthenticated || !currentUser) return;

  console.log(
    "AppliStash: Setting up job selection observer"
  );

  // Create a new observer specifically for the job container
  const jobSelectionObserver = new MutationObserver(() => {
    // Only run this on LinkedIn jobs pages
    if (!window.location.href.includes("linkedin.com/jobs"))
      return;

    // Look for job details container which holds the currently selected job
    const container =
      document.querySelector(
        ".jobs-search__job-details--container"
      ) ||
      document.querySelector(
        ".jobs-search__job-details--wrapper"
      );

    if (!container) return;

    // Get current job title and company
    const titleElement = container.querySelector(
      ".jobs-unified-top-card__job-title, .job-details-jobs-unified-top-card__job-title"
    );
    const companyElement = container.querySelector(
      ".jobs-unified-top-card__company-name, .job-details-jobs-unified-top-card__company-name"
    );

    const currentJobTitle =
      titleElement?.textContent?.trim() || "";
    const currentCompanyName =
      companyElement?.textContent?.trim() || "";

    // Check if the job has changed
    if (
      (currentJobTitle &&
        currentJobTitle !== lastJobTitle) ||
      (currentCompanyName &&
        currentCompanyName !== lastCompanyName)
    ) {
      console.log("AppliStash: Job selection changed", {
        from: {
          title: lastJobTitle,
          company: lastCompanyName,
        },
        to: {
          title: currentJobTitle,
          company: currentCompanyName,
        },
      });

      // Update tracking variables
      lastJobTitle = currentJobTitle;
      lastCompanyName = currentCompanyName;

      // Only re-inject if we have valid job data
      if (currentJobTitle && currentCompanyName) {
        // Remove existing overlay first
        const existingOverlays = document.querySelectorAll(
          ".appli-stash-overlay"
        );
        existingOverlays.forEach((overlay) => {
          if (overlay.parentElement) {
            overlay.parentElement.removeChild(overlay);
          }
        });

        // Re-inject with a slight delay to ensure the page has updated
        setTimeout(() => {
          if (currentUser) {
            injectOverlay(currentUser);
          }
        }, 500);
      }
    }
  });

  // Start observing for job selection changes
  jobSelectionObserver.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["aria-selected"],
  });

  console.log("AppliStash: Job selection observer started");
}

// Start observing only if authenticated
if (isAuthenticated) {
  // Observe URL changes
  urlObserver.observe(document, {
    subtree: true,
    childList: true,
  });
  console.log(
    "AppliStash: Started mutation observer for URL changes"
  );

  // Also set up the job selection observer
  setupJobSelectionObserver();
} else {
  console.log(
    "AppliStash: Not starting observers - not authenticated"
  );
}
