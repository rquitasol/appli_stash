import { createOverlayUI } from "./ui";
import { getJobData } from "./sites/dataExtraction";
import {
  ApplicationPriority,
  ApplicationStatus,
} from "@applistash/shared";
import { API_BASE_URL } from "../config/api";

export interface User {
  email: string;
  name: string;
  token?: string;
}

export interface JobData {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  source: string;
}

/**
 * Injects the overlay UI into the job site
 */
export function injectOverlay(user: User): void {
  // Extract job data from the page using our new extraction system
  const jobData = getJobData();

  console.log("AppliStash: Extracted job data:", jobData);

  if (!jobData) {
    console.error(
      "AppliStash: Could not extract job data from page"
    );
    return;
  }

  // Always inject directly into the body for maximum visibility
  console.log("AppliStash: Creating overlay UI");

  // Create the overlay UI
  const overlayElement = createOverlayUI(
    jobData,
    user,
    (applicationData: JobData) => {
      saveApplication(applicationData, user);
    }
  );

  // Force the overlay to be visible by setting these properties
  overlayElement.style.display = "block";
  overlayElement.style.visibility = "visible";
  overlayElement.style.opacity = "1";

  // Remove any existing overlays first to avoid duplicates
  const existingOverlays = document.querySelectorAll(
    ".appli-stash-overlay"
  );
  existingOverlays.forEach((overlay) => {
    if (overlay.parentElement) {
      overlay.parentElement.removeChild(overlay);
    }
  });

  console.log(
    "AppliStash: Injecting overlay into document.body"
  );

  // Always inject directly into the document body for maximum visibility
  document.body.appendChild(overlayElement);

  // Show a console message to confirm injection
  console.log("AppliStash: Overlay injected successfully!");
}

/**
 * Sends the job data to our API to save it as an application
 */
async function saveApplication(
  jobData: JobData,
  user: User
): Promise<void> {
  try {
    // Prepare headers with authentication token if available
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token exists
    if (user.token) {
      headers["Authorization"] = `Bearer ${user.token}`;
      console.log(
        "AppliStash: Adding JWT token to request"
      );
    } else {
      console.warn("AppliStash: No JWT token available");
    }

    const response = await fetch(
      `${API_BASE_URL}/api/application`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          position: jobData.title,
          company_name: jobData.company,
          // location: jobData.location,
          // description: jobData.description,
          url: jobData.url,
          // source: jobData.source,
          status: ApplicationStatus.Saved,
          priority: ApplicationPriority.Medium,
          notes: "", // Add empty notes
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save application");
    }

    const data = await response.json();
    console.log(
      "AppliStash: Successfully saved application",
      data
    );

    // Show a success message
    showNotification(
      "Success",
      "Application saved to AppliStash!"
    );
  } catch (error) {
    console.error(
      "AppliStash: Error saving application",
      error
    );
    showNotification(
      "Error",
      "Failed to save application. Please try again."
    );
  }
}

/**
 * Shows a notification to the user
 */
function showNotification(
  title: string,
  message: string
): void {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = "appli-stash-notification";
  notification.innerHTML = `
    <div class="appli-stash-notification-title">${title}</div>
    <div class="appli-stash-notification-message">${message}</div>
  `;

  // Add styles
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.right = "20px";
  notification.style.backgroundColor =
    title === "Success" ? "#4CAF50" : "#F44336";
  notification.style.color = "white";
  notification.style.padding = "15px";
  notification.style.borderRadius = "5px";
  notification.style.zIndex = "10000";
  notification.style.boxShadow =
    "0 2px 5px rgba(0,0,0,0.3)";

  // Add to page
  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}
