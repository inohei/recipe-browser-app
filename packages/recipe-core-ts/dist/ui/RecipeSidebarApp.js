import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
import { useEffect, useMemo, useState } from "preact/hooks";
import { getIframeContainerStyles, getMobileContainerStyles, injectStyles } from "./styles";
function clampToPeople(n) {
    return Math.max(1, Math.round(n));
}
export function RecipeSidebarApp({ initialRecipe, isMobile = false, }) {
    // Inject component (content) styles once mounted
    useEffect(() => {
        const STYLE_ID = "recipe-sidebar-app-styles";
        const styles = isMobile ? getMobileContainerStyles() : getIframeContainerStyles();
        injectStyles(STYLE_ID, styles);
    }, [isMobile]);
    const yieldParsed = useMemo(() => initialRecipe.yield, [initialRecipe]);
    const yieldText = useMemo(() => initialRecipe.formatYield(), [initialRecipe]);
    const isInteractiveRange = Boolean((yieldParsed.quantityRange || yieldParsed.quantity != null) &&
        (yieldParsed.unit === "cup" || yieldParsed.unit === "serving"));
    const isRange = Boolean(yieldParsed.quantityRange);
    const [minVal, setMinVal] = useState(() => {
        if (!isInteractiveRange)
            return 1;
        if (yieldParsed.quantityRange)
            return Math.round(yieldParsed.quantityRange.min);
        if (yieldParsed.quantity != null)
            return Math.round(yieldParsed.quantity);
        return 1;
    });
    const [maxVal, setMaxVal] = useState(() => {
        if (!isInteractiveRange)
            return 1;
        if (yieldParsed.quantityRange)
            return Math.round(yieldParsed.quantityRange.max);
        if (yieldParsed.quantity != null)
            return Math.round(yieldParsed.quantity);
        return 1;
    });
    const displayedRecipe = useMemo(() => {
        if (!isInteractiveRange)
            return initialRecipe;
        const min = clampToPeople(minVal);
        const max = clampToPeople(maxVal);
        const mid = (min + max) / 2;
        const base = Math.round(initialRecipe.baseServings ?? 2);
        const factorServings = Math.max(1, Math.round(base * (mid / base)));
        return initialRecipe.scale(factorServings);
    }, [initialRecipe, isInteractiveRange, minVal, maxVal]);
    return (_jsx(_Fragment, { children: _jsxs("div", { class: "rb-body", children: [displayedRecipe.imageUrl && (_jsxs("div", { class: "rb-header-image", children: [_jsx("img", { class: "rb-image", src: displayedRecipe.imageUrl }), _jsx("div", { class: "rb-title-overlay", children: _jsx("h1", { class: "rb-name", children: displayedRecipe.name || "レシピ" }) })] })), !displayedRecipe.imageUrl && (_jsx("div", { class: "rb-name", children: displayedRecipe.name || "レシピ" })), _jsxs("div", { class: "rb-section-header", children: [_jsx("div", { class: "rb-section-title", children: "\u6750\u6599" }), yieldText && (_jsx("div", { class: "rb-yield", children: !isInteractiveRange ? (_jsx("span", { children: yieldText })) : (_jsxs("span", { class: "rb-yield-inline", children: [_jsx("button", { class: "rb-btn rb-btn-round", onClick: () => {
                                            setMinVal((v) => clampToPeople(v - 1));
                                            setMaxVal((v) => clampToPeople(v - 1));
                                        }, children: "\u2212" }), _jsxs("span", { class: "rb-yield-display", children: [yieldParsed.prefix && _jsx("span", { children: yieldParsed.prefix }), _jsx("input", { class: "rb-num", type: "number", value: String(minVal), onInput: (e) => {
                                                    const v = clampToPeople(parseFloat(e.target.value) || minVal);
                                                    setMinVal(v);
                                                    if (!isRange)
                                                        setMaxVal(v);
                                                } }), isRange && _jsx("span", { children: "\u301C" }), isRange && (_jsx("input", { class: "rb-num", type: "number", value: String(maxVal), onInput: (e) => setMaxVal(clampToPeople(parseFloat(e.target.value) || maxVal)) })), yieldParsed.unitText && _jsx("span", { children: yieldParsed.unitText }), yieldParsed.suffix && _jsx("span", { children: yieldParsed.suffix })] }), _jsx("button", { class: "rb-btn rb-btn-round", onClick: () => {
                                            setMinVal((v) => clampToPeople(v + 1));
                                            setMaxVal((v) => clampToPeople(v + 1));
                                        }, children: "+" })] })) }))] }), _jsx("ul", { class: "rb-list", children: displayedRecipe.ingredients.map((ing) => (_jsxs("li", { children: [_jsx("span", { children: ing.name || ing.originalText }), _jsx("span", { class: "rb-qty", children: ing.format() || "" })] }))) }), _jsx("div", { class: "rb-section-header", children: _jsx("div", { class: "rb-section-title", children: "\u4F5C\u308A\u65B9" }) }), _jsx("ol", { class: "rb-steps", children: displayedRecipe.instructions.map((step, index) => (_jsx("li", { children: _jsxs("div", { class: "rb-step-content", children: [_jsx("div", { class: "rb-step-text", children: step.text }), step.imageUrl && (_jsx("div", { class: "rb-step-image", children: _jsx("img", { src: step.imageUrl, alt: `手順${index + 1}` }) }))] }) }))) })] }) }));
}
