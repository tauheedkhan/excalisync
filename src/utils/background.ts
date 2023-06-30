chrome.runtime.onInstalled.addListener(async () => {
  // Reload tabs to apply content scripts
  const tabs = await chrome.tabs.query({ url: ["http://localhost/*"] });
  tabs.forEach(({ id }) => chrome.tabs.reload(id));
});
let fileId;
let folderId;
let olderFileId;

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
  if (request.message === "context") {
    olderFileId = fileId;
    fileId = request.fileId;
    folderId = request.folderId;
    console.log("olderfileid ", olderFileId);
    console.log("context changes ", folderId, fileId, request.reload);
    if (olderFileId !== fileId) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.reload(tabs[0].id);
      });
    }
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});
