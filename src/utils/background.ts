chrome.runtime.onInstalled.addListener(async () => {
  // Reload tabs to apply content scripts
  const tabs = await chrome.tabs.query({ url: ["http://localhost/*"] });
  tabs.forEach(({ id }) => chrome.tabs.reload(id));
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("called token ");
  if (request.message === "authenticate") {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      console.log("old token ", token);
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        chrome.identity.removeCachedAuthToken({ token: token }, function () {
          chrome.identity.getAuthToken(
            { interactive: false },
            function (newToken) {
              sendResponse({ token: newToken });
            }
          );
        });
      }
    });
    return true; // Indicate that we will call sendResponse asynchronously
  }
});
