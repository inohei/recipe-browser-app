/*
  Quantity formatting and rounding helpers
*/
import { unitDisplayJa, } from "./core.js";
function convertForDisplay(value, unit) {
    if (unit === "tsp") {
        const tbspEq = value / 3;
        if (tbspEq >= 4) {
            return { value: tbspEq * 15, unit: "ml" };
        }
        if (value >= 3) {
            return { value: tbspEq, unit: "tbsp" };
        }
        return { value, unit };
    }
    if (unit === "tbsp") {
        if (value >= 4) {
            return { value: value * 15, unit: "ml" };
        }
        return { value, unit };
    }
    return { value, unit };
}
function toNaturalJapaneseFraction(value, unit) {
    // 表示ポリシー:
    // - 大さじ/小さじ/カップ以外は常に小数表示（分数は使わない）
    // - 10以上の数は小数点以下切り捨て
    // - スプーン/カップは1/4刻みで丸めた小数表示
    const isSpoonOrCup = unit === "tsp" || unit === "tbsp" || unit === "cup";
    const clampForLarge = (v) => (v >= 10 ? Math.floor(v) : v);
    if (isSpoonOrCup) {
        const rounded = Math.round(value * 4) / 4;
        const v = clampForLarge(rounded);
        // 1.0 → 1 のように末尾の .0 は落とす
        return Number.isInteger(v) ? `${Math.trunc(v)}` : `${v}`;
    }
    // 質量・体積・人・個など すべて小数表示（単位別丸め）
    let rounded;
    switch (unit) {
        case "g":
        case "ml":
        case "mg":
        case "l":
        case "kg":
            rounded = Math.round(value * 10) / 10;
            break;
        default:
            rounded = Math.round(value * 10) / 10;
            break;
    }
    const v = clampForLarge(rounded);
    return Number.isInteger(v) ? `${Math.trunc(v)}` : `${v}`;
}
export function formatQuantity(value, unit) {
    if (value == null)
        return "";
    const { value: dispValue, unit: dispUnit } = convertForDisplay(value, unit);
    const frac = toNaturalJapaneseFraction(dispValue, dispUnit);
    const unitStr = dispUnit ? unitDisplayJa[dispUnit] ?? "" : "";
    if (dispUnit === "pinch") {
        const intLike = Math.abs(dispValue - Math.round(dispValue)) < 1e-6;
        if (Math.abs(value - 1) < 1e-6)
            return "ひとつまみ";
        if (intLike)
            return `${Math.round(dispValue)}つまみ`;
        return `${frac} ${unitStr}`.trim();
    }
    if (dispUnit === "tbsp" || dispUnit === "tsp") {
        return `${unitStr}${frac}`;
    }
    return `${frac}${unitStr ? " " + unitStr : ""}`.trim();
}
export function formatQuantityRange(min, max, unit) {
    const maxDisp = convertForDisplay(max, unit);
    let displayUnit = maxDisp.unit;
    let minValue;
    let maxValue;
    if (displayUnit === "ml") {
        const toMl = (v) => {
            if (unit === "ml")
                return v;
            if (unit === "tbsp")
                return v * 15;
            if (unit === "tsp")
                return (v / 3) * 15;
            return v;
        };
        minValue = toMl(min);
        maxValue = toMl(max);
    }
    else if (displayUnit === "tbsp") {
        const toTbsp = (v) => {
            if (unit === "tbsp")
                return v;
            if (unit === "tsp")
                return v / 3;
            return v;
        };
        minValue = toTbsp(min);
        maxValue = toTbsp(max);
    }
    else if (displayUnit === "tsp") {
        minValue = min;
        maxValue = max;
    }
    else {
        const minStr = toNaturalJapaneseFraction(min, unit);
        const maxStr = toNaturalJapaneseFraction(max, unit);
        const unitStr = unit ? unitDisplayJa[unit] ?? "" : "";
        return `${minStr}〜${maxStr}${unitStr ? " " + unitStr : ""}`.trim();
    }
    const minStr = toNaturalJapaneseFraction(minValue, displayUnit);
    const maxStr = toNaturalJapaneseFraction(maxValue, displayUnit);
    const unitStr = displayUnit ? unitDisplayJa[displayUnit] ?? "" : "";
    if (displayUnit === "tbsp" || displayUnit === "tsp") {
        return `${unitStr}${minStr}〜${maxStr}`;
    }
    return `${minStr}〜${maxStr}${unitStr ? " " + unitStr : ""}`.trim();
}
export function formatIngredientQuantities(ing) {
    let primaryCore = "";
    if (ing.quantityRange) {
        primaryCore = formatQuantityRange(ing.quantityRange.min, ing.quantityRange.max, ing.unit);
    }
    else {
        primaryCore = formatQuantity(ing.quantity, ing.unit);
    }
    const primary = `${ing.prefix ?? ""}${primaryCore}${ing.suffix ?? ""}`.trim();
    let secondary = "";
    if (ing.secondaryQuantityRange) {
        const secondaryCore = formatQuantityRange(ing.secondaryQuantityRange.min, ing.secondaryQuantityRange.max, ing.secondaryUnit);
        secondary = `${ing.secondaryPrefix ?? ""}${secondaryCore}${ing.secondarySuffix ?? ""}`;
    }
    else if (ing.secondaryQuantity != null) {
        const secondaryCore = formatQuantity(ing.secondaryQuantity, ing.secondaryUnit);
        secondary = `${ing.secondaryPrefix ?? ""}${secondaryCore}${ing.secondarySuffix ?? ""}`;
    }
    if (secondary)
        return `${primary}（${secondary}）`.trim();
    return primary.trim();
}
export function formatRecipeYield(y) {
    if (!y)
        return "";
    const parts = [];
    if (y.prefix)
        parts.push(y.prefix.trim());
    let core = "";
    if (y.quantityRange) {
        // Yield 表示では、可能なら元の単位表記（unitText）を優先
        // Yield 表示では、可能なら元の単位表記（unitText）を優先
        if (y.unitText) {
            const minStr = toNaturalJapaneseFraction(y.quantityRange.min, y.unit);
            const maxStr = toNaturalJapaneseFraction(y.quantityRange.max, y.unit);
            core = `${minStr}〜${maxStr}${y.unitText}`;
        }
        else {
            core = formatQuantityRange(y.quantityRange.min, y.quantityRange.max, y.unit);
        }
    }
    else if (y.quantity != null) {
        if (y.unitText) {
            const v = toNaturalJapaneseFraction(y.quantity, y.unit);
            core = `${v}${y.unitText}`;
        }
        else {
            core = formatQuantity(y.quantity, y.unit);
        }
    }
    if (core)
        parts.push(core);
    if (y.suffix)
        parts.push(y.suffix.trim());
    let txt = parts.join("").trim();
    // secondary 表示
    let secondary = "";
    if (y.secondaryQuantityRange) {
        secondary = formatQuantityRange(y.secondaryQuantityRange.min, y.secondaryQuantityRange.max, y.secondaryUnit);
    }
    else if (y.secondaryQuantity != null) {
        secondary = formatQuantity(y.secondaryQuantity, y.secondaryUnit);
    }
    if (secondary) {
        const secTxt = `${y.secondaryPrefix ?? ""}${secondary}${y.secondarySuffix ?? ""}`;
        txt = `${txt}（${secTxt}）`;
    }
    return txt;
}
