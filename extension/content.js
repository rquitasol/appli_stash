// Inject overlay button
(function () {
  if (window.__appliStashOverlayInjected) return;
  window.__appliStashOverlayInjected = true;

  const overlay = document.createElement("div");
  overlay.id = "appli-stash-overlay";
  overlay.style.position = "fixed";
  overlay.style.bottom = "32px";
  overlay.style.right = "32px";
  overlay.style.zIndex = "99999";
  overlay.style.background = "#8B5CF6";
  overlay.style.color = "#fff";
  overlay.style.padding = "12px 20px";
  overlay.style.borderRadius = "8px";
  overlay.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
  overlay.style.fontWeight = "bold";
  overlay.style.cursor = "pointer";
  overlay.style.width = "200px";
  overlay.innerText = "Save to AppliStash";

  overlay.onclick = function () {
    chrome.runtime.sendMessage({ type: "OPEN_POPUP" });
  };

  document.body.appendChild(overlay);
})();
