// extension/src/background.ts
chrome.runtime.onInstalled.addListener(() => {
});
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  try {
    await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_SIDEBAR" });
  } catch (error) {
    console.log("Failed to toggle sidebar:", error);
  }
});
//# sourceMappingURL=background.js.map
