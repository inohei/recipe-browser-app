/*
  Recipe scaling entry points
*/
import { roundForUnit, } from "./core.js";
export function scaleIngredient(ing, factor) {
    if (!ing.scalable)
        return ing;
    // Primary
    let quantity = ing.quantity;
    let quantityRange = ing.quantityRange;
    if (typeof quantity === "number")
        quantity = roundForUnit(quantity * factor, ing.unit);
    if (quantityRange) {
        quantityRange = {
            min: roundForUnit(quantityRange.min * factor, ing.unit),
            max: roundForUnit(quantityRange.max * factor, ing.unit),
        };
    }
    // Secondary
    let secondaryQuantity = ing.secondaryQuantity;
    let secondaryQuantityRange = ing.secondaryQuantityRange;
    if (typeof secondaryQuantity === "number")
        secondaryQuantity = roundForUnit(secondaryQuantity * factor, ing.secondaryUnit);
    if (secondaryQuantityRange) {
        secondaryQuantityRange = {
            min: roundForUnit(secondaryQuantityRange.min * factor, ing.secondaryUnit),
            max: roundForUnit(secondaryQuantityRange.max * factor, ing.secondaryUnit),
        };
    }
    return {
        ...ing,
        quantity,
        quantityRange,
        secondaryQuantity,
        secondaryQuantityRange,
    };
}
export function scaleRecipe(recipe, newServings) {
    const base = recipe.baseServings && recipe.baseServings > 0 ? recipe.baseServings : 2;
    const factor = newServings / base;
    const scaledIngredients = recipe.ingredients.map((ing) => scaleIngredient(ing, factor));
    return {
        ...recipe,
        ingredients: scaledIngredients,
        baseServings: newServings,
    };
}
