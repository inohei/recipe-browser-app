chrome.runtime.onInstalled.addListener(() => {
  // no-op for now
});

// アイコンクリックでサイドバーの表示/非表示を切り替える
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  try {
    // アクティブなタブにメッセージを送信してサイドバーの表示状態を切り替える
    await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_SIDEBAR" });
  } catch (error) {
    console.log("Failed to toggle sidebar:", error);
  }
});
