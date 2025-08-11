import { CanonicalUnit, NormalizedIngredient, NormalizedRecipe, NormalizedYield } from "./core.js";
export declare function parseJsonLdRecipesFromScripts(scripts: string[]): any[];
export declare function normalizeRecipe(raw: any): NormalizedRecipe;
export declare function parseRecipeYield(text?: string): NormalizedYield | undefined;
export declare function parseIngredientLine(line: string): NormalizedIngredient;
interface QuantityInfo {
    quantity?: number;
    quantityRange?: {
        min: number;
        max: number;
    };
    unit?: CanonicalUnit;
    unitText?: string;
    prefix?: string;
    suffix?: string;
    hasNumber: boolean;
    isNonScalable: boolean;
    originalExpression?: string;
}
export declare function parseQuantityExpression(text: string): QuantityInfo;
export declare function extractUnit(text: string): {
    unit: CanonicalUnit;
    unitText: string;
} | undefined;
export declare function extractUnitAdjacent(beforeLowerTrim: string, afterLowerTrim: string): {
    unit: CanonicalUnit;
    unitText: string;
    matched: string;
    side: "before" | "after";
} | undefined;
export {};
