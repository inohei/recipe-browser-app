import { render } from "preact";
import { getJsonLdScriptsFromDocument } from "../../src/dom/jsonld";
import { parseJsonLdRecipesFromScripts, Recipe } from "../../src/index";
import { RecipeSidebarApp } from "../../src/ui/RecipeSidebarApp";
import { getShadowDOMContainerStyles } from "../../src/ui/styles";

const HOST_COMP_STYLE_ID = "recipe-sidebar-host-compensation";
const SIDEBAR_WIDTH_CSS = "min(360px, 40vw)";

function injectHostCompensationStyles() {
  if (document.getElementById(HOST_COMP_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = HOST_COMP_STYLE_ID;
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
    }
  `;
  document.head.appendChild(style);
}

function removeHostCompensationStyles() {
  const style = document.getElementById(HOST_COMP_STYLE_ID);
  if (style && style.parentNode) style.parentNode.removeChild(style);
}

function createSidebarWithShadowDOM(recipe: Recipe): { container: HTMLElement; shadowRoot: ShadowRoot } {
  // サイドバーコンテナ要素を作成
  const container = document.createElement("div");
  container.id = "recipe-sidebar-container";
  container.style.cssText = `
    position: absolute !important;
    top: 0 !important;
    right: 0 !important;
    height: auto !important;
    min-height: 100vh !important;
    width: ${SIDEBAR_WIDTH_CSS} !important;
    border: none !important;
    box-shadow: 0 0 12px rgba(0,0,0,0.15) !important;
    border-left: 1px solid #eee !important;
    z-index: 2147483647 !important;
    background: white !important;
    overflow: visible !important;
  `;

  // Shadow DOMを作成
  const shadowRoot = container.attachShadow({ mode: 'closed' });

  // Shadow DOM内にスタイルを注入
  const style = document.createElement("style");
  style.textContent = getShadowDOMContainerStyles();
  shadowRoot.appendChild(style);

  // レシピアプリのコンテナを作成
  const appContainer = document.createElement("div");
  appContainer.id = "recipe-sidebar-root";
  appContainer.style.cssText = `
    min-height: 100%;
    overflow: visible;
    display: block;
  `;
  shadowRoot.appendChild(appContainer);

  // レシピアプリをレンダリング
  render(
    <RecipeSidebarApp
      initialRecipe={recipe}
      isMobile={false}
    />,
    appContainer
  );

  const host = (document.body || document.documentElement);
  if (host.firstChild) {
    host.insertBefore(container, host.firstChild);
  } else {
    host.appendChild(container);
  }

  try {
    console.log("[recipe-ext] Shadow DOM sidebar created");
  } catch { }

  return { container, shadowRoot };
}

function main() {
  try {
    const scripts = getJsonLdScriptsFromDocument(document);
    const recipesRaw = parseJsonLdRecipesFromScripts(scripts);
    if (!recipesRaw.length) return;

    injectHostCompensationStyles();

    // レシピデータを正規化
    const normalizedRecipe = Recipe.fromJsonLd(recipesRaw[0]);

    // Shadow DOMでサイドバーを作成
    const { container } = createSidebarWithShadowDOM(normalizedRecipe);

    // カスタムイベントで閉じる処理を実装
    container.addEventListener("closeSidebar", () => {
      container.remove();
      removeHostCompensationStyles();
    });

  } catch (e) {
    // silent fail
  }
}

// run once at document end
main();


