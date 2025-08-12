import { getJsonLdScriptsFromDocument } from "../../src/dom/jsonld";
import { parseJsonLdRecipesFromScripts, Recipe } from "../../src/index";
// グローバルな状態管理
let currentSidebar = null;
let currentRecipeData = null;
const HOST_COMP_STYLE_ID = "recipe-sidebar-host-compensation";
const SIDEBAR_WIDTH_CSS = "min(360px, 40vw)";
function injectHostCompensationStyles() {
    const style = document.createElement("style");
    style.textContent = `
    html { 
      margin-right: ${SIDEBAR_WIDTH_CSS} !important; 
      overflow-y: auto !important;
      height: auto !important;
      min-height: 100% !important;
    }
    body {
      overflow-x: hidden !important; 
      overflow-y: auto !important;
      height: auto !important;
      min-height: 100% !important;
      box-sizing: border-box !important;
    }
  `;
    document.head.appendChild(style);
}
function removeHostCompensationStyles() {
    const style = document.getElementById(HOST_COMP_STYLE_ID);
    if (style && style.parentNode)
        style.parentNode.removeChild(style);
}
function showSidebar() {
    if (currentSidebar) {
        // 既に表示されている場合は何もしない
        return;
    }
    if (!currentRecipeData) {
        // レシピデータがない場合は検索を試行
        const scripts = getJsonLdScriptsFromDocument(document);
        const recipesRaw = parseJsonLdRecipesFromScripts(scripts);
        if (!recipesRaw.length)
            return;
        currentRecipeData = recipesRaw[0];
    }
    const normalizedRecipe = Recipe.fromJsonLd(currentRecipeData);
    currentSidebar = createSidebarWithIframe(normalizedRecipe, currentRecipeData);
    injectHostCompensationStyles();
}
function hideSidebar() {
    if (currentSidebar) {
        currentSidebar.remove();
        currentSidebar = null;
        removeHostCompensationStyles();
    }
}
function toggleSidebar() {
    if (currentSidebar) {
        hideSidebar();
    }
    else {
        showSidebar();
    }
}
function createSidebarWithIframe(recipe, rawRecipeData) {
    // iframeを作成
    const iframe = document.createElement("iframe");
    iframe.id = "recipe-sidebar-iframe";
    iframe.src = chrome.runtime.getURL("./iframe-content.html");
    iframe.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    height: 100vh !important;
    width: ${SIDEBAR_WIDTH_CSS} !important;
    border: none !important;
    box-shadow: 0 0 12px rgba(0,0,0,0.15) !important;
    border-left: 1px solid #eee !important;
    z-index: 2147483647 !important;
    background: white !important;
    overflow: hidden !important;
  `;
    // iframeからのメッセージを受信
    let iframeReady = false;
    window.addEventListener('message', (event) => {
        if (event.source !== iframe.contentWindow)
            return;
        if (event.data.type === 'IFRAME_READY') {
            iframeReady = true;
            // レシピデータを送信
            iframe.contentWindow?.postMessage({
                type: 'RECIPE_DATA',
                recipe: rawRecipeData
            }, '*');
        }
        else if (event.data.type === 'CLOSE_SIDEBAR') {
            hideSidebar();
        }
    });
    // iframe読み込み完了時の処理
    iframe.onload = () => {
        if (!iframeReady) {
            // フォールバック: 少し待ってからレシピデータを送信
            setTimeout(() => {
                iframe.contentWindow?.postMessage({
                    type: 'RECIPE_DATA',
                    recipe: rawRecipeData
                }, '*');
            }, 100);
        }
    };
    const host = (document.body || document.documentElement);
    host.appendChild(iframe);
    try {
        console.log("[recipe-ext] Iframe sidebar created");
    }
    catch { }
    return iframe;
}
function main() {
    try {
        const scripts = getJsonLdScriptsFromDocument(document);
        const recipesRaw = parseJsonLdRecipesFromScripts(scripts);
        if (!recipesRaw.length)
            return;
        // レシピデータを保存
        currentRecipeData = recipesRaw[0];
        // 自動表示
        showSidebar();
    }
    catch (e) {
        // silent fail
    }
}
// backgroundからのメッセージを受信
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'TOGGLE_SIDEBAR') {
        toggleSidebar();
        sendResponse({ success: true });
    }
});
// run once at document end
main();
