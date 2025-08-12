import { render } from "preact";
import { Recipe } from "../../src/index";
import { RecipeSidebarApp } from "../../src/ui/RecipeSidebarApp";

interface RecipeMessage {
  type: 'RECIPE_DATA';
  recipe: any;
}

interface CloseMessage {
  type: 'CLOSE_IFRAME';
}

type MessageData = RecipeMessage | CloseMessage;

function main() {
  const container = document.getElementById("recipe-iframe-root");

  if (!container) {
    console.error("recipe-iframe-root not found");
    return;
  }

  // 親ウィンドウからのメッセージを受信
  window.addEventListener('message', (event) => {
    try {
      const data: MessageData = event.data;

      if (data.type === 'RECIPE_DATA' && data.recipe) {
        // レシピデータを正規化してレンダリング
        console.log("[recipe-ext] Received recipe data:", data.recipe);
        console.log("[recipe-ext] Recipe instructions:", data.recipe.recipeInstructions);

        const normalizedRecipe = Recipe.fromJsonLd(data.recipe);

        console.log("[recipe-ext] Normalized recipe:", normalizedRecipe);
        console.log("[recipe-ext] Instructions after normalization:", normalizedRecipe.instructions);

        render(
          <RecipeSidebarApp
            initialRecipe={normalizedRecipe}
            isMobile={false}
          />,
          container
        );

        console.log("[recipe-ext] Recipe rendered in iframe");
      }
    } catch (e) {
      console.error("[recipe-ext] Error processing message:", e);
    }
  });

  // 親ウィンドウにiframeの準備完了を通知
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
  }

  // グローバルにclose機能を提供（RecipeSidebarAppから呼ばれる）
  (window as any).closeSidebar = () => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'CLOSE_SIDEBAR' }, '*');
    }
  };
}

// DOMContentLoadedまたは即座に実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
