import type {
  CanonicalUnit,
  NormalizedIngredient,
  NormalizedRecipe,
  NormalizedYield,
} from "./core.js";
import { roundForUnit } from "./core.js";
import {
  formatQuantity,
  formatQuantityRange,
  formatRecipeYield,
} from "./format.js";
import {
  normalizeRecipe,
  parseIngredientLine,
  parseRecipeYield,
} from "./parse.js";
// scaling helpers are implemented inline in methods where feasible

export class Ingredient {
  constructor(public readonly data: NormalizedIngredient) {}

  static parse(line: string): Ingredient {
    return new Ingredient(parseIngredientLine(line));
  }

  // Convenience field getters
  get originalText(): string {
    return this.data.originalText;
  }
  get name(): string {
    return this.data.name;
  }
  get quantity(): number | undefined {
    return this.data.quantity;
  }
  get quantityRange(): { min: number; max: number } | undefined {
    return this.data.quantityRange;
  }
  get unit(): CanonicalUnit | undefined {
    return this.data.unit;
  }
  get unitText(): string | undefined {
    return this.data.unitText;
  }
  get prefix(): string | undefined {
    return this.data.prefix;
  }
  get suffix(): string | undefined {
    return this.data.suffix;
  }
  get secondaryQuantity(): number | undefined {
    return this.data.secondaryQuantity;
  }
  get secondaryQuantityRange(): { min: number; max: number } | undefined {
    return this.data.secondaryQuantityRange;
  }
  get secondaryUnit(): CanonicalUnit | undefined {
    return this.data.secondaryUnit;
  }
  get secondaryUnitText(): string | undefined {
    return this.data.secondaryUnitText;
  }
  get secondaryPrefix(): string | undefined {
    return this.data.secondaryPrefix;
  }
  get secondarySuffix(): string | undefined {
    return this.data.secondarySuffix;
  }
  get scalable(): boolean {
    return this.data.scalable;
  }

  scale(factor: number): Ingredient {
    const ing = this.data;
    if (!ing.scalable) return new Ingredient(ing);

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
      secondaryQuantity = roundForUnit(
        secondaryQuantity * factor,
        ing.secondaryUnit
      );
    }
    if (secondaryQuantityRange) {
      secondaryQuantityRange = {
        min: roundForUnit(
          secondaryQuantityRange.min * factor,
          ing.secondaryUnit
        ),
        max: roundForUnit(
          secondaryQuantityRange.max * factor,
          ing.secondaryUnit
        ),
      };
    }

    const scaled: NormalizedIngredient = {
      ...ing,
      quantity,
      quantityRange,
      secondaryQuantity,
      secondaryQuantityRange,
    };
    return new Ingredient(scaled);
  }

  format(): string {
    const ing = this.data;

    let primaryCore = "";
    if (ing.quantityRange) {
      primaryCore = formatQuantityRange(
        ing.quantityRange.min,
        ing.quantityRange.max,
        ing.unit
      );
    } else {
      primaryCore = formatQuantity(ing.quantity, ing.unit);
    }
    const primary = `${ing.prefix ?? ""}${primaryCore}${
      ing.suffix ?? ""
    }`.trim();

    let secondary = "";
    if (ing.secondaryQuantityRange) {
      const secondaryCore = formatQuantityRange(
        ing.secondaryQuantityRange.min,
        ing.secondaryQuantityRange.max,
        ing.secondaryUnit
      );
      secondary = `${ing.secondaryPrefix ?? ""}${secondaryCore}${
        ing.secondarySuffix ?? ""
      }`;
    } else if (ing.secondaryQuantity != null) {
      const secondaryCore = formatQuantity(
        ing.secondaryQuantity,
        ing.secondaryUnit
      );
      secondary = `${ing.secondaryPrefix ?? ""}${secondaryCore}${
        ing.secondarySuffix ?? ""
      }`;
    }

    if (secondary) return `${primary}（${secondary}）`.trim();
    return primary.trim();
  }

  toJSON(): NormalizedIngredient {
    return { ...this.data };
  }
}

export class Yield {
  constructor(public readonly data: NormalizedYield | undefined) {}

  static parse(text?: string): Yield {
    return new Yield(parseRecipeYield(text));
  }

  // Accessors mirror NormalizedYield fields
  get originalText(): string | undefined {
    return this.data?.originalText;
  }
  get quantity(): number | undefined {
    return this.data?.quantity;
  }
  get quantityRange(): { min: number; max: number } | undefined {
    return this.data?.quantityRange;
  }
  get unit(): CanonicalUnit | undefined {
    return this.data?.unit;
  }
  get unitText(): string | undefined {
    return this.data?.unitText;
  }
  get prefix(): string | undefined {
    return this.data?.prefix;
  }
  get suffix(): string | undefined {
    return this.data?.suffix;
  }
  get secondaryQuantity(): number | undefined {
    return this.data?.secondaryQuantity;
  }
  get secondaryQuantityRange(): { min: number; max: number } | undefined {
    return this.data?.secondaryQuantityRange;
  }
  get secondaryUnit(): CanonicalUnit | undefined {
    return this.data?.secondaryUnit;
  }
  get secondaryUnitText(): string | undefined {
    return this.data?.secondaryUnitText;
  }
  get secondaryPrefix(): string | undefined {
    return this.data?.secondaryPrefix;
  }
  get secondarySuffix(): string | undefined {
    return this.data?.secondarySuffix;
  }
  get scalable(): boolean | undefined {
    return this.data?.scalable;
  }

  format(): string {
    return formatRecipeYield(this.data);
  }

  toJSON(): NormalizedYield | undefined {
    return this.data ? { ...this.data } : undefined;
  }
}

export class Recipe {
  constructor(public readonly data: NormalizedRecipe) {}

  static fromJsonLd(raw: any): Recipe {
    return new Recipe(normalizeRecipe(raw));
  }

  get name(): string | undefined {
    return this.data.name;
  }
  get imageUrl(): string | undefined {
    return this.data.imageUrl;
  }
  get author(): string | undefined {
    return this.data.author;
  }
  get baseServings(): number | undefined {
    return this.data.baseServings;
  }
  get ingredients(): Ingredient[] {
    return this.data.ingredients.map((i) => new Ingredient(i));
  }
  get instructions(): string[] {
    return this.data.instructions;
  }
  get times(): { prep?: string; cook?: string; total?: string } | undefined {
    return this.data.times;
  }
  get nutrition(): Record<string, string> | undefined {
    return this.data.nutrition;
  }
  get yield(): Yield {
    return new Yield(parseRecipeYield(this.data.yieldText));
  }

  formatYield(): string {
    return this.yield.format();
  }

  // Returns new Recipe instance (non-destructive)
  scale(toServings: number): Recipe {
    const base =
      this.data.baseServings && this.data.baseServings > 0
        ? this.data.baseServings
        : 2;
    const factor = toServings / base;
    const scaledIngredients: NormalizedIngredient[] = this.data.ingredients.map(
      (i) => new Ingredient(i).scale(factor).toJSON()
    );
    const scaled: NormalizedRecipe = {
      ...this.data,
      ingredients: scaledIngredients,
      // baseServings は初期値を維持（連続スケール時のドリフト防止）
      baseServings: this.data.baseServings,
    };
    return new Recipe(scaled);
  }

  toJSON(): NormalizedRecipe {
    return { ...this.data };
  }
}
