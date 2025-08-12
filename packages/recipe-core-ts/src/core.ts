/*
  Core types, units, constants, and shared utilities
*/

export type CanonicalUnit =
  | "g"
  | "kg"
  | "mg"
  | "ml"
  | "l"
  | "tsp"
  | "tbsp"
  | "cup"
  | "go"
  | "cm"
  | "serving"
  | "piece"
  | "slice"
  | "block"
  | "stalk"
  | "leaf"
  | "pinch"
  | "clove"
  | "can"
  | "pack"
  | "bag"
  | "bunch"
  | "head"
  | "tail"
  | "grain"
  | "unknown";

export type NormalizedIngredient = {
  originalText: string;
  name: string;
  quantity?: number;
  quantityRange?: { min: number; max: number };
  unit?: CanonicalUnit;
  unitText?: string;
  prefix?: string;
  suffix?: string;
  // 補助（第2）数量・単位
  secondaryQuantity?: number;
  secondaryQuantityRange?: { min: number; max: number };
  secondaryUnit?: CanonicalUnit;
  secondaryUnitText?: string;
  secondaryPrefix?: string;
  secondarySuffix?: string;
  scalable: boolean;
};

export type NormalizedInstruction = {
  text: string;
  imageUrl?: string;
  name?: string;
  url?: string;
};

export type NormalizedRecipe = {
  name?: string;
  imageUrl?: string;
  author?: string;
  yieldText?: string;
  baseServings?: number;
  ingredients: NormalizedIngredient[];
  instructions: NormalizedInstruction[];
  times?: { prep?: string; cook?: string; total?: string };
  nutrition?: Record<string, string>;
};

// Yield normalization (servings / counts)
export type NormalizedYield = {
  originalText: string;
  // 数量・単位（人数も含む: unit は 'serving' を使用）
  quantity?: number;
  quantityRange?: { min: number; max: number };
  unit?: CanonicalUnit;
  unitText?: string;
  prefix?: string;
  suffix?: string;
  // 括弧内などの第2数量・単位
  secondaryQuantity?: number;
  secondaryQuantityRange?: { min: number; max: number };
  secondaryUnit?: CanonicalUnit;
  secondaryUnitText?: string;
  secondaryPrefix?: string;
  secondarySuffix?: string;
  scalable: boolean;
};

// Unit dictionaries
export const unitMap: Record<string, CanonicalUnit> = {
  // weight
  g: "g",
  gram: "g",
  grams: "g",
  グラム: "g",
  kg: "kg",
  kilogram: "kg",
  kilograms: "kg",
  キロ: "kg",
  キログラム: "kg",
  mg: "mg",
  ミリグラム: "mg",
  // volume
  ml: "ml",
  ミリリットル: "ml",
  l: "l",
  litre: "l",
  liter: "l",
  リットル: "l",
  ℓ: "l",
  cc: "ml",
  // spoons & cup
  tsp: "tsp",
  teaspoon: "tsp",
  teaspoons: "tsp",
  Tsp: "tsp",
  TSP: "tsp",
  "tsp.": "tsp",
  小さじ: "tsp",
  小匙: "tsp",
  小: "tsp",
  tbsp: "tbsp",
  tablespoon: "tbsp",
  tablespoons: "tbsp",
  Tbsp: "tbsp",
  TBSP: "tbsp",
  TBS: "tbsp",
  "tbsp.": "tbsp",
  大さじ: "tbsp",
  大匙: "tbsp",
  大: "tbsp",
  cup: "cup",
  cups: "cup",
  Cup: "cup",
  Cups: "cup",
  カップ: "cup",
  杯: "cup",
  合: "go",
  // counts/shapes
  個: "piece",
  個分: "piece",
  個入り: "piece",
  台: "piece",
  斤: "piece",
  piece: "piece",
  pieces: "piece",
  枚: "slice",
  slice: "slice",
  slices: "slice",
  丁: "block",
  塊: "block",
  block: "block",
  本: "stalk",
  stalk: "stalk",
  stalks: "stalk",
  葉: "leaf",
  leaf: "leaf",
  leaves: "leaf",
  片: "clove",
  clove: "clove",
  cloves: "clove",
  缶: "can",
  can: "can",
  cans: "can",
  パック: "pack",
  P: "pack",
  p: "pack",
  袋: "bag",
  小袋: "bag",
  束: "bunch",
  房: "bunch",
  株: "head",
  切れ: "slice",
  cm: "cm",
  尾: "tail",
  粒: "grain",
  缶詰: "can",
  かけ: "clove",
  かけら: "clove",
  // size modifiers
  大玉: "piece",
  中玉: "piece",
  小玉: "piece",
  // micro
  少々: "pinch",
  ひとつまみ: "pinch",
  つまみ: "pinch",
  pinch: "pinch",
};

export const unitDisplayJa: Record<CanonicalUnit, string> = {
  g: "g",
  kg: "kg",
  mg: "mg",
  ml: "ml",
  l: "l",
  tsp: "小さじ",
  tbsp: "大さじ",
  cup: "カップ",
  go: "合",
  cm: "cm",
  serving: "人",
  piece: "個",
  slice: "枚",
  block: "丁",
  stalk: "本",
  leaf: "枚",
  clove: "片",
  can: "缶",
  pinch: "少々",
  pack: "パック",
  bag: "袋",
  bunch: "束",
  head: "株",
  tail: "尾",
  grain: "粒",
  unknown: "",
};

export const nonScalableKeywords = [
  "適量",
  "少々",
  "お好みで",
  "好みで",
  "お好みの量",
  "作りやすい量",
  "作りやすい分量",
  "必要量",
  "少量",
  "ひとつかみ",
  "ふたつかみ",
  "味を見て",
  "to taste",
  "as needed",
  "as necessary",
  "適宜",
  "山盛り",
  "たっぷり",
  "ひたひた",
];

// ========= 事前コンパイル・事前計算 =========
export const escapeRegExp = (s: string) =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const NON_SCALABLE_REGEX = new RegExp(
  `(?:${nonScalableKeywords.map(escapeRegExp).join("|")})`
);

// 数値表現（分数・範囲を含む）
export const NUMBER_PATTERN =
  /(\d+(?:\.\d+)?(?:[\/／]\d+)?(?:\s*[〜～~-]\s*\d+(?:\.\d+)?(?:[\/／]\d+)?)?)/g;

// 単位抽出の高速化: 長いキー順
export const SORTED_UNIT_ENTRIES: Array<[string, CanonicalUnit]> =
  Object.entries(unitMap)
    .map(([k, v]) => [k.toLowerCase(), v] as [string, CanonicalUnit])
    .sort(([a], [b]) => b.length - a.length);

// ========= Utilities =========
export function normalizeNumerals(text: string): string {
  let s = text
    .replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xfee0))
    .replace(/[Ａ-Ｚａ-ｚ]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
    )
    .replace(/一/g, "1")
    .replace(/二/g, "2")
    .replace(/三/g, "3")
    .replace(/四/g, "4")
    .replace(/五/g, "5")
    .replace(/六/g, "6")
    .replace(/七/g, "7")
    .replace(/八/g, "8")
    .replace(/九/g, "9")
    .replace(/十/g, "10");
  s = s.replace(/半分?/g, "1/2");
  // まず「つまみ」系を優先的に数値化（他の置換で壊さないように順序を早める）
  s = s
    .replace(/ひとつまみ/g, "1つまみ")
    .replace(/ふたつまみ/g, "2つまみ")
    .replace(/一つまみ/g, "1つまみ")
    .replace(/二つまみ/g, "2つまみ");
  // 一般的な和数 -> アラビア数字
  s = s
    .replace(/ひとつ/g, "1")
    .replace(/ふたつ/g, "2")
    .replace(/みっつ/g, "3")
    .replace(/よっつ/g, "4")
    .replace(/いつつ/g, "5")
    .replace(/むっつ/g, "6")
    .replace(/ななつ/g, "7")
    .replace(/やっつ/g, "8")
    .replace(/ここのつ/g, "9")
    .replace(/とお/g, "10");
  s = s.replace(/(\d+)\s*と\s*(\d+\s*\/\s*\d+)/g, "$1 $2");
  s = s.replace(/(\d+)\s*[・・]\s*(\d+\s*\/\s*\d+)/g, "$1 $2");
  // 記号・単位の正規化
  s = s.replace(/㎝/g, "cm");
  s = s.replace(/㎖/g, "ml");
  // 「大1」→「1 大」への並べ替えは行わない（「大1個」を誤って大さじに解釈しないため）
  return s;
}

export function stripAndCollectParentheticals(text: string): {
  stripped: string;
  parens: string[];
  parensInner: string[];
} {
  const parens: string[] = [];
  const parensInner: string[] = [];
  let work = text;
  work = work.replace(/（[^）]*）/g, (m) => {
    parens.push(m);
    parensInner.push(m.slice(1, -1));
    return " ";
  });
  work = work.replace(/\([^)]*\)/g, (m) => {
    parens.push(m);
    parensInner.push(m.slice(1, -1));
    return " ";
  });
  return { stripped: work, parens, parensInner };
}

export function toArray<T>(x: T | T[] | undefined | null): T[] {
  if (!x) return [];
  return Array.isArray(x) ? x : [x];
}

export function equalsIgnoreCase(a: string, b: string): boolean {
  return a?.toLowerCase?.() === b?.toLowerCase?.();
}

export function checkNonScalableKeywords(
  text: string
): { keyword: string; match: string } | undefined {
  const m = text.match(NON_SCALABLE_REGEX);
  if (!m) return undefined;
  const matched = m[0];
  return { keyword: matched, match: matched };
}

export function parseNumber(numStr: string): number | undefined {
  if (numStr.includes("/") || numStr.includes("／")) {
    const parts = numStr.split(/[\/／]/);
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        return num / den;
      }
    }
  }
  const num = parseFloat(numStr);
  return isNaN(num) ? undefined : num;
}

export function cleanIngredientName(
  nameWork: string,
  originalLine: string
): string {
  let cleaned = nameWork.replace(/\s+/g, " ").trim();

  // ブレットポイント記号を除去
  cleaned = cleaned.replace(/^[・•\-\*\+★☆]\s*/, "");

  // 末尾の「：」も除去（材料名に含まれてしまった場合）
  cleaned = cleaned.replace(/：$/, "");

  if (!cleaned || cleaned.length < 2) {
    const words = originalLine.split(/\s+/);
    cleaned = words.find((w) => w.length >= 2 && !/\d/.test(w)) || originalLine;
    // 見つけた単語からもブレットポイント記号を除去
    cleaned = cleaned.replace(/^[・•\-\*\+★☆]\s*/, "").replace(/：$/, "");
  }
  return cleaned;
}

// 共通スケーリング用の丸め
export function roundForUnit(value: number, unit?: CanonicalUnit): number {
  if (!unit || unit === "unknown") return Math.round(value * 100) / 100;
  switch (unit) {
    case "tsp":
    case "tbsp":
    case "cup": {
      return Math.round(value * 4) / 4;
    }
    case "piece":
    case "slice":
    case "block":
    case "stalk":
    case "leaf":
    case "clove":
    case "can": {
      // 分数表示をしないポリシーに合わせ、0.1刻みで丸め
      return Math.round(value * 10) / 10;
    }
    case "pinch":
      return value;
    default:
      return Math.round(value * 10) / 10;
  }
}
