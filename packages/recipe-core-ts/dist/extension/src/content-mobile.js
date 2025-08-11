import { jsx as _jsx } from "preact/jsx-runtime";
import { render } from "preact";
import { Recipe } from "../../src/index";
import { RecipeSidebarApp } from "../../src/ui/RecipeSidebarApp";
function renderRecipeFromJsonLd(jsonLd) {
    try {
        const normalized = Recipe.fromJsonLd(jsonLd);
        const container = document.getElementById("recipe-mobile-container");
        if (!container) {
            console.error("recipe-mobile-container not found");
            return;
        }
        console.log("render RecipeSidebarApp");
        render(_jsx(RecipeSidebarApp, { initialRecipe: normalized, onClose: () => {
                try {
                    // Flutter 側へ閉じる要求
                    window.flutter_inappwebview?.callHandler?.("closeRecipe");
                }
                catch (_) { }
            }, isMobile: true }), container);
    }
    catch (_) {
        // no-op
    }
}
// レシピをレンダリングする関数をグローバルに公開
window.renderRecipeData = function (recipeJson) {
    try {
        console.log("renderRecipeData called with:", recipeJson);
        renderRecipeFromJsonLd(recipeJson);
    }
    catch (e) {
        console.error("renderRecipeData error:", e);
    }
};
console.log("renderRecipeData");
console.log(window.renderRecipeData);
