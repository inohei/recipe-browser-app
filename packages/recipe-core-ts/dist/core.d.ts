export type CanonicalUnit = "g" | "kg" | "mg" | "ml" | "l" | "tsp" | "tbsp" | "cup" | "go" | "cm" | "serving" | "piece" | "slice" | "block" | "stalk" | "leaf" | "pinch" | "clove" | "can" | "pack" | "bag" | "bunch" | "head" | "tail" | "grain" | "unknown";
export type NormalizedIngredient = {
    originalText: string;
    name: string;
    quantity?: number;
    quantityRange?: {
        min: number;
        max: number;
    };
    unit?: CanonicalUnit;
    unitText?: string;
    prefix?: string;
    suffix?: string;
    secondaryQuantity?: number;
    secondaryQuantityRange?: {
        min: number;
        max: number;
    };
    secondaryUnit?: CanonicalUnit;
    secondaryUnitText?: string;
    secondaryPrefix?: string;
    secondarySuffix?: string;
    scalable: boolean;
};
export type NormalizedRecipe = {
    name?: string;
    imageUrl?: string;
    author?: string;
    yieldText?: string;
    baseServings?: number;
    ingredients: NormalizedIngredient[];
    instructions: string[];
    times?: {
        prep?: string;
        cook?: string;
        total?: string;
    };
    nutrition?: Record<string, string>;
};
export type NormalizedYield = {
    originalText: string;
    quantity?: number;
    quantityRange?: {
        min: number;
        max: number;
    };
    unit?: CanonicalUnit;
    unitText?: string;
    prefix?: string;
    suffix?: string;
    secondaryQuantity?: number;
    secondaryQuantityRange?: {
        min: number;
        max: number;
    };
    secondaryUnit?: CanonicalUnit;
    secondaryUnitText?: string;
    secondaryPrefix?: string;
    secondarySuffix?: string;
    scalable: boolean;
};
export declare const unitMap: Record<string, CanonicalUnit>;
export declare const unitDisplayJa: Record<CanonicalUnit, string>;
export declare const nonScalableKeywords: string[];
export declare const escapeRegExp: (s: string) => string;
export declare const NON_SCALABLE_REGEX: RegExp;
export declare const NUMBER_PATTERN: RegExp;
export declare const SORTED_UNIT_ENTRIES: Array<[string, CanonicalUnit]>;
export declare function normalizeNumerals(text: string): string;
export declare function stripAndCollectParentheticals(text: string): {
    stripped: string;
    parens: string[];
    parensInner: string[];
};
export declare function toArray<T>(x: T | T[] | undefined | null): T[];
export declare function equalsIgnoreCase(a: string, b: string): boolean;
export declare function checkNonScalableKeywords(text: string): {
    keyword: string;
    match: string;
} | undefined;
export declare function parseNumber(numStr: string): number | undefined;
export declare function cleanIngredientName(nameWork: string, originalLine: string): string;
export declare function roundForUnit(value: number, unit?: CanonicalUnit): number;
