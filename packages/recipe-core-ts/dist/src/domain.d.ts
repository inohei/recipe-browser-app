import type { CanonicalUnit, NormalizedIngredient, NormalizedInstruction, NormalizedRecipe, NormalizedYield } from "./core.js";
export declare class Ingredient {
    readonly data: NormalizedIngredient;
    constructor(data: NormalizedIngredient);
    static parse(line: string): Ingredient;
    get originalText(): string;
    get name(): string;
    get quantity(): number | undefined;
    get quantityRange(): {
        min: number;
        max: number;
    } | undefined;
    get unit(): CanonicalUnit | undefined;
    get unitText(): string | undefined;
    get prefix(): string | undefined;
    get suffix(): string | undefined;
    get secondaryQuantity(): number | undefined;
    get secondaryQuantityRange(): {
        min: number;
        max: number;
    } | undefined;
    get secondaryUnit(): CanonicalUnit | undefined;
    get secondaryUnitText(): string | undefined;
    get secondaryPrefix(): string | undefined;
    get secondarySuffix(): string | undefined;
    get scalable(): boolean;
    scale(factor: number): Ingredient;
    format(): string;
    toJSON(): NormalizedIngredient;
}
export declare class Instruction {
    readonly data: NormalizedInstruction;
    constructor(data: NormalizedInstruction);
    get text(): string;
    get imageUrl(): string | undefined;
    get name(): string | undefined;
    get url(): string | undefined;
    toJSON(): NormalizedInstruction;
}
export declare class Yield {
    readonly data: NormalizedYield | undefined;
    constructor(data: NormalizedYield | undefined);
    static parse(text?: string): Yield;
    get originalText(): string | undefined;
    get quantity(): number | undefined;
    get quantityRange(): {
        min: number;
        max: number;
    } | undefined;
    get unit(): CanonicalUnit | undefined;
    get unitText(): string | undefined;
    get prefix(): string | undefined;
    get suffix(): string | undefined;
    get secondaryQuantity(): number | undefined;
    get secondaryQuantityRange(): {
        min: number;
        max: number;
    } | undefined;
    get secondaryUnit(): CanonicalUnit | undefined;
    get secondaryUnitText(): string | undefined;
    get secondaryPrefix(): string | undefined;
    get secondarySuffix(): string | undefined;
    get scalable(): boolean | undefined;
    format(): string;
    toJSON(): NormalizedYield | undefined;
}
export declare class Recipe {
    readonly data: NormalizedRecipe;
    constructor(data: NormalizedRecipe);
    static fromJsonLd(raw: any): Recipe;
    get name(): string | undefined;
    get imageUrl(): string | undefined;
    get author(): string | undefined;
    get baseServings(): number | undefined;
    get ingredients(): Ingredient[];
    get instructions(): Instruction[];
    get times(): {
        prep?: string;
        cook?: string;
        total?: string;
    } | undefined;
    get nutrition(): Record<string, string> | undefined;
    get yield(): Yield;
    formatYield(): string;
    scale(toServings: number): Recipe;
    toJSON(): NormalizedRecipe;
}
