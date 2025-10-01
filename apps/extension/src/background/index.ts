// Background script for the extension
console.log('Background script loaded!');

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('Message received:', message);

  if (message.type === 'AUTH_STATUS') {
    // Get user info from storage
    chrome.storage.local.get(['user'], function (result) {
      sendResponse({ isLoggedIn: !!result.user, user: result.user || null });
    });
    // Return true to indicate we will send a response asynchronously
    return true;
  }

  return false;
});
