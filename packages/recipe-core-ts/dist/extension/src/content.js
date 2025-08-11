import { jsx as _jsx } from "preact/jsx-runtime";
import { render } from "preact";
import { getJsonLdScriptsFromDocument } from "../../src/dom/jsonld";
import { parseJsonLdRecipesFromScripts, Recipe } from "../../src/index";
import { RecipeSidebarApp } from "../../src/ui/RecipeSidebarApp";
function createSidebarHost() {
    const container = document.createElement("div");
    container.id = "recipe-sidebar-container";
    document.documentElement.appendChild(container);
    return container;
}
function main() {
    try {
        const scripts = getJsonLdScriptsFromDocument(document);
        const recipesRaw = parseJsonLdRecipesFromScripts(scripts);
        if (!recipesRaw.length)
            return;
        const normalized = Recipe.fromJsonLd(recipesRaw[0]);
        const host = createSidebarHost();
        const onClose = () => host.remove();
        render(_jsx(RecipeSidebarApp, { initialRecipe: normalized, onClose: onClose }), host);
    }
    catch (e) {
        // silent fail
    }
}
// run once at document end
main();
