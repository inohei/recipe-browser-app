import { CanonicalUnit, NormalizedIngredient, NormalizedYield } from "./core.js";
export declare function formatQuantity(value?: number, unit?: CanonicalUnit): string;
export declare function formatQuantityRange(min: number, max: number, unit?: CanonicalUnit): string;
export declare function formatIngredientQuantities(ing: NormalizedIngredient): string;
export declare function formatRecipeYield(y: NormalizedYield | undefined): string;
