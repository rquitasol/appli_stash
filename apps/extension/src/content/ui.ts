import type { JobData, User } from "./overlay";

/**
 * Creates the UI for the overlay that will be injected into job pages
 */
export function createOverlayUI(
  jobData: JobData,
  user: User,
  onSave: (data: JobData) => void
): HTMLElement {
  // Create the main overlay container
  const overlay = document.createElement("div");
  overlay.className = "appli-stash-overlay";
  overlay.style.position = "fixed";
  overlay.style.bottom = "20px";
  overlay.style.right = "20px";
  overlay.style.backgroundColor = "white";
  overlay.style.borderRadius = "8px";
  overlay.style.boxShadow =
    "0 0 0 4px #6a3cf7, 0 4px 20px rgba(0,0,0,0.4)";
  overlay.style.padding = "16px";
  overlay.style.zIndex = "2147483647"; // Maximum z-index value
  overlay.style.width = "320px";
  overlay.style.maxWidth = "90vw";
  overlay.style.fontFamily = "Arial, sans-serif";
  overlay.style.fontSize = "14px";
  overlay.style.transition = "all 0.3s ease";
  overlay.style.border = "3px solid #6a3cf7";
  overlay.style.animation =
    "appliStashPulse 2s infinite alternate";

  // Add animation to make it more visible
  const style = document.createElement("style");
  style.textContent = `
    @keyframes appliStashPulse {
      0% { box-shadow: 0 0 0 4px #6a3cf7, 0 4px 20px rgba(0,0,0,0.4); }
      100% { box-shadow: 0 0 0 8px #6a3cf7, 0 4px 25px rgba(106, 60, 247, 0.6); }
    }
  `;
  document.head.appendChild(style);

  // Create the header
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.alignItems = "center";
  header.style.marginBottom = "12px";

  // Logo
  const logo = document.createElement("div");
  logo.textContent = "AppliStash";
  logo.style.color = "#6a3cf7";
  logo.style.fontWeight = "bold";
  logo.style.fontSize = "16px";

  // Close button
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "&times;";
  closeButton.style.marginLeft = "auto";
  closeButton.style.background = "none";
  closeButton.style.border = "none";
  closeButton.style.fontSize = "20px";
  closeButton.style.cursor = "pointer";
  closeButton.style.padding = "0 6px";
  closeButton.onclick = () => {
    overlay.remove();
  };

  header.appendChild(logo);
  header.appendChild(closeButton);

  // Create the content
  const content = document.createElement("div");

  // Job title
  const title = document.createElement("div");
  title.textContent = jobData.title;
  title.style.fontWeight = "bold";
  title.style.marginBottom = "8px";

  // Company
  const company = document.createElement("div");
  company.textContent = jobData.company;
  company.style.marginBottom = "4px";

  // Location
  const location = document.createElement("div");
  location.textContent = jobData.location;
  location.style.marginBottom = "12px";
  location.style.color = "#666";

  // Add to AppliStash button
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save to AppliStash";
  saveButton.style.backgroundColor = "#6a3cf7";
  saveButton.style.color = "white";
  saveButton.style.border = "none";
  saveButton.style.padding = "10px 16px";
  saveButton.style.borderRadius = "6px";
  saveButton.style.width = "100%";
  saveButton.style.cursor = "pointer";
  saveButton.style.fontWeight = "bold";
  saveButton.style.marginTop = "10px";
  saveButton.onclick = () => {
    saveButton.disabled = true;
    saveButton.textContent = "Saving...";

    // Call the save function
    onSave(jobData);

    // After a delay, update the button
    setTimeout(() => {
      saveButton.textContent = "Saved!";
      saveButton.style.backgroundColor = "#4CAF50";

      // Reset after 3 seconds
      setTimeout(() => {
        saveButton.disabled = false;
        saveButton.textContent = "Save to AppliStash";
        saveButton.style.backgroundColor = "#6a3cf7";
      }, 3000);
    }, 1000);
  };

  // Logged in as
  const userInfo = document.createElement("div");
  userInfo.textContent = `Logged in as ${user.name}`;
  userInfo.style.fontSize = "12px";
  userInfo.style.color = "#666";
  userInfo.style.textAlign = "center";
  userInfo.style.marginTop = "10px";

  // Assemble the content
  content.appendChild(title);
  content.appendChild(company);
  content.appendChild(location);
  content.appendChild(saveButton);
  content.appendChild(userInfo);

  // Assemble the overlay
  overlay.appendChild(header);
  overlay.appendChild(content);

  // Add a minimize/expand toggle
  let isMinimized = false;

  const toggleButton = document.createElement("button");
  toggleButton.innerHTML = "&#8593;"; // Up arrow
  toggleButton.style.position = "absolute";
  toggleButton.style.top = "16px";
  toggleButton.style.right = "40px";
  toggleButton.style.background = "none";
  toggleButton.style.border = "none";
  toggleButton.style.cursor = "pointer";
  toggleButton.onclick = () => {
    if (isMinimized) {
      content.style.display = "block";
      toggleButton.innerHTML = "&#8593;"; // Up arrow
      isMinimized = false;
    } else {
      content.style.display = "none";
      toggleButton.innerHTML = "&#8595;"; // Down arrow
      isMinimized = true;
    }
  };

  header.appendChild(toggleButton);

  return overlay;
}
