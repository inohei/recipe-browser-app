import { roundForUnit } from "./core.js";
import { formatQuantity, formatQuantityRange, formatRecipeYield, } from "./format.js";
import { normalizeRecipe, parseIngredientLine, parseRecipeYield, } from "./parse.js";
// scaling helpers are implemented inline in methods where feasible
export class Ingredient {
    constructor(data) {
        this.data = data;
    }
    static parse(line) {
        return new Ingredient(parseIngredientLine(line));
    }
    // Convenience field getters
    get originalText() {
        return this.data.originalText;
    }
    get name() {
        return this.data.name;
    }
    get quantity() {
        return this.data.quantity;
    }
    get quantityRange() {
        return this.data.quantityRange;
    }
    get unit() {
        return this.data.unit;
    }
    get unitText() {
        return this.data.unitText;
    }
    get prefix() {
        return this.data.prefix;
    }
    get suffix() {
        return this.data.suffix;
    }
    get secondaryQuantity() {
        return this.data.secondaryQuantity;
    }
    get secondaryQuantityRange() {
        return this.data.secondaryQuantityRange;
    }
    get secondaryUnit() {
        return this.data.secondaryUnit;
    }
    get secondaryUnitText() {
        return this.data.secondaryUnitText;
    }
    get secondaryPrefix() {
        return this.data.secondaryPrefix;
    }
    get secondarySuffix() {
        return this.data.secondarySuffix;
    }
    get scalable() {
        return this.data.scalable;
    }
    scale(factor) {
        const ing = this.data;
        if (!ing.scalable)
            return new Ingredient(ing);
        // Primary
        let quantity = ing.quantity;
        let quantityRange = ing.quantityRange;
        if (typeof quantity === "number") {
            quantity = roundForUnit(quantity * factor, ing.unit);
        }
        if (quantityRange) {
            quantityRange = {
                min: roundForUnit(quantityRange.min * factor, ing.unit),
                max: roundForUnit(quantityRange.max * factor, ing.unit),
            };
        }
        // Secondary
        let secondaryQuantity = ing.secondaryQuantity;
        let secondaryQuantityRange = ing.secondaryQuantityRange;
        if (typeof secondaryQuantity === "number") {
            secondaryQuantity = roundForUnit(secondaryQuantity * factor, ing.secondaryUnit);
        }
        if (secondaryQuantityRange) {
            secondaryQuantityRange = {
                min: roundForUnit(secondaryQuantityRange.min * factor, ing.secondaryUnit),
                max: roundForUnit(secondaryQuantityRange.max * factor, ing.secondaryUnit),
            };
        }
        const scaled = {
            ...ing,
            quantity,
            quantityRange,
            secondaryQuantity,
            secondaryQuantityRange,
        };
        return new Ingredient(scaled);
    }
    format() {
        const ing = this.data;
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
    toJSON() {
        return { ...this.data };
    }
}
export class Yield {
    constructor(data) {
        this.data = data;
    }
    static parse(text) {
        return new Yield(parseRecipeYield(text));
    }
    // Accessors mirror NormalizedYield fields
    get originalText() {
        return this.data?.originalText;
    }
    get quantity() {
        return this.data?.quantity;
    }
    get quantityRange() {
        return this.data?.quantityRange;
    }
    get unit() {
        return this.data?.unit;
    }
    get unitText() {
        return this.data?.unitText;
    }
    get prefix() {
        return this.data?.prefix;
    }
    get suffix() {
        return this.data?.suffix;
    }
    get secondaryQuantity() {
        return this.data?.secondaryQuantity;
    }
    get secondaryQuantityRange() {
        return this.data?.secondaryQuantityRange;
    }
    get secondaryUnit() {
        return this.data?.secondaryUnit;
    }
    get secondaryUnitText() {
        return this.data?.secondaryUnitText;
    }
    get secondaryPrefix() {
        return this.data?.secondaryPrefix;
    }
    get secondarySuffix() {
        return this.data?.secondarySuffix;
    }
    get scalable() {
        return this.data?.scalable;
    }
    format() {
        return formatRecipeYield(this.data);
    }
    toJSON() {
        return this.data ? { ...this.data } : undefined;
    }
}
export class Recipe {
    constructor(data) {
        this.data = data;
    }
    static fromJsonLd(raw) {
        return new Recipe(normalizeRecipe(raw));
    }
    get name() {
        return this.data.name;
    }
    get imageUrl() {
        return this.data.imageUrl;
    }
    get author() {
        return this.data.author;
    }
    get baseServings() {
        return this.data.baseServings;
    }
    get ingredients() {
        return this.data.ingredients.map((i) => new Ingredient(i));
    }
    get instructions() {
        return this.data.instructions;
    }
    get times() {
        return this.data.times;
    }
    get nutrition() {
        return this.data.nutrition;
    }
    get yield() {
        return new Yield(parseRecipeYield(this.data.yieldText));
    }
    formatYield() {
        return this.yield.format();
    }
    // Returns new Recipe instance (non-destructive)
    scale(toServings) {
        const base = this.data.baseServings && this.data.baseServings > 0
            ? this.data.baseServings
            : 2;
        const factor = toServings / base;
        const scaledIngredients = this.data.ingredients.map((i) => new Ingredient(i).scale(factor).toJSON());
        const scaled = {
            ...this.data,
            ingredients: scaledIngredients,
            // baseServings は初期値を維持（連続スケール時のドリフト防止）
            baseServings: this.data.baseServings,
        };
        return new Recipe(scaled);
    }
    toJSON() {
        return { ...this.data };
    }
}
