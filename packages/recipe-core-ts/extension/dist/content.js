// src/dom/jsonld.ts
function getJsonLdScriptsFromDocument(doc = document) {
  const nodes = Array.from(
    doc.querySelectorAll('script[type="application/ld+json"]')
  );
  return nodes.map((n) => n.textContent || "").filter(Boolean);
}

// src/core.ts
var unitMap = {
  // weight
  g: "g",
  gram: "g",
  grams: "g",
  \u30B0\u30E9\u30E0: "g",
  kg: "kg",
  kilogram: "kg",
  kilograms: "kg",
  \u30AD\u30ED: "kg",
  \u30AD\u30ED\u30B0\u30E9\u30E0: "kg",
  mg: "mg",
  \u30DF\u30EA\u30B0\u30E9\u30E0: "mg",
  // volume
  ml: "ml",
  \u30DF\u30EA\u30EA\u30C3\u30C8\u30EB: "ml",
  l: "l",
  litre: "l",
  liter: "l",
  \u30EA\u30C3\u30C8\u30EB: "l",
  \u2113: "l",
  cc: "ml",
  // spoons & cup
  tsp: "tsp",
  teaspoon: "tsp",
  teaspoons: "tsp",
  Tsp: "tsp",
  TSP: "tsp",
  "tsp.": "tsp",
  \u5C0F\u3055\u3058: "tsp",
  \u5C0F\u5319: "tsp",
  \u5C0F: "tsp",
  tbsp: "tbsp",
  tablespoon: "tbsp",
  tablespoons: "tbsp",
  Tbsp: "tbsp",
  TBSP: "tbsp",
  TBS: "tbsp",
  "tbsp.": "tbsp",
  \u5927\u3055\u3058: "tbsp",
  \u5927\u5319: "tbsp",
  \u5927: "tbsp",
  cup: "cup",
  cups: "cup",
  Cup: "cup",
  Cups: "cup",
  \u30AB\u30C3\u30D7: "cup",
  \u676F: "cup",
  \u5408: "go",
  // counts/shapes
  \u500B: "piece",
  \u500B\u5206: "piece",
  \u500B\u5165\u308A: "piece",
  \u53F0: "piece",
  \u65A4: "piece",
  piece: "piece",
  pieces: "piece",
  \u679A: "slice",
  slice: "slice",
  slices: "slice",
  \u4E01: "block",
  \u584A: "block",
  block: "block",
  \u672C: "stalk",
  stalk: "stalk",
  stalks: "stalk",
  \u8449: "leaf",
  leaf: "leaf",
  leaves: "leaf",
  \u7247: "clove",
  clove: "clove",
  cloves: "clove",
  \u7F36: "can",
  can: "can",
  cans: "can",
  \u30D1\u30C3\u30AF: "pack",
  P: "pack",
  p: "pack",
  \u888B: "bag",
  \u5C0F\u888B: "bag",
  \u675F: "bunch",
  \u623F: "bunch",
  \u682A: "head",
  \u5207\u308C: "slice",
  cm: "cm",
  \u5C3E: "tail",
  \u7C92: "grain",
  \u7F36\u8A70: "can",
  \u304B\u3051: "clove",
  \u304B\u3051\u3089: "clove",
  // size modifiers
  \u5927\u7389: "piece",
  \u4E2D\u7389: "piece",
  \u5C0F\u7389: "piece",
  // micro
  \u5C11\u3005: "pinch",
  \u3072\u3068\u3064\u307E\u307F: "pinch",
  \u3064\u307E\u307F: "pinch",
  pinch: "pinch"
};
var unitDisplayJa = {
  g: "g",
  kg: "kg",
  mg: "mg",
  ml: "ml",
  l: "l",
  tsp: "\u5C0F\u3055\u3058",
  tbsp: "\u5927\u3055\u3058",
  cup: "\u30AB\u30C3\u30D7",
  go: "\u5408",
  cm: "cm",
  serving: "\u4EBA",
  piece: "\u500B",
  slice: "\u679A",
  block: "\u4E01",
  stalk: "\u672C",
  leaf: "\u679A",
  clove: "\u7247",
  can: "\u7F36",
  pinch: "\u5C11\u3005",
  pack: "\u30D1\u30C3\u30AF",
  bag: "\u888B",
  bunch: "\u675F",
  head: "\u682A",
  tail: "\u5C3E",
  grain: "\u7C92",
  unknown: ""
};
var nonScalableKeywords = [
  "\u9069\u91CF",
  "\u5C11\u3005",
  "\u304A\u597D\u307F\u3067",
  "\u597D\u307F\u3067",
  "\u304A\u597D\u307F\u306E\u91CF",
  "\u4F5C\u308A\u3084\u3059\u3044\u91CF",
  "\u4F5C\u308A\u3084\u3059\u3044\u5206\u91CF",
  "\u5FC5\u8981\u91CF",
  "\u5C11\u91CF",
  "\u3072\u3068\u3064\u304B\u307F",
  "\u3075\u305F\u3064\u304B\u307F",
  "\u5473\u3092\u898B\u3066",
  "to taste",
  "as needed",
  "as necessary",
  "\u9069\u5B9C",
  "\u5C71\u76DB\u308A",
  "\u305F\u3063\u3077\u308A",
  "\u3072\u305F\u3072\u305F"
];
var escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var NON_SCALABLE_REGEX = new RegExp(
  `(?:${nonScalableKeywords.map(escapeRegExp).join("|")})`
);
var NUMBER_PATTERN = /(\d+(?:\.\d+)?(?:[\/／]\d+)?(?:\s*[〜～~-]\s*\d+(?:\.\d+)?(?:[\/／]\d+)?)?)/g;
var SORTED_UNIT_ENTRIES = Object.entries(unitMap).map(([k, v]) => [k.toLowerCase(), v]).sort(([a], [b]) => b.length - a.length);
function normalizeNumerals(text) {
  let s = text.replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 65248)).replace(
    /[Ａ-Ｚａ-ｚ]/g,
    (ch) => String.fromCharCode(ch.charCodeAt(0) - 65248)
  ).replace(/一/g, "1").replace(/二/g, "2").replace(/三/g, "3").replace(/四/g, "4").replace(/五/g, "5").replace(/六/g, "6").replace(/七/g, "7").replace(/八/g, "8").replace(/九/g, "9").replace(/十/g, "10");
  s = s.replace(/半分?/g, "1/2");
  s = s.replace(/ひとつまみ/g, "1\u3064\u307E\u307F").replace(/ふたつまみ/g, "2\u3064\u307E\u307F").replace(/一つまみ/g, "1\u3064\u307E\u307F").replace(/二つまみ/g, "2\u3064\u307E\u307F");
  s = s.replace(/ひとつ/g, "1").replace(/ふたつ/g, "2").replace(/みっつ/g, "3").replace(/よっつ/g, "4").replace(/いつつ/g, "5").replace(/むっつ/g, "6").replace(/ななつ/g, "7").replace(/やっつ/g, "8").replace(/ここのつ/g, "9").replace(/とお/g, "10");
  s = s.replace(/(\d+)\s*と\s*(\d+\s*\/\s*\d+)/g, "$1 $2");
  s = s.replace(/(\d+)\s*[・・]\s*(\d+\s*\/\s*\d+)/g, "$1 $2");
  s = s.replace(/㎝/g, "cm");
  s = s.replace(/㎖/g, "ml");
  return s;
}
function stripAndCollectParentheticals(text) {
  const parens = [];
  const parensInner = [];
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
function toArray(x) {
  if (!x) return [];
  return Array.isArray(x) ? x : [x];
}
function equalsIgnoreCase(a, b) {
  return a?.toLowerCase?.() === b?.toLowerCase?.();
}
function checkNonScalableKeywords(text) {
  const m = text.match(NON_SCALABLE_REGEX);
  if (!m) return void 0;
  const matched = m[0];
  return { keyword: matched, match: matched };
}
function parseNumber(numStr) {
  if (numStr.includes("/") || numStr.includes("\uFF0F")) {
    const parts = numStr.split(/[\/／]/);
    if (parts.length === 2) {
      const num2 = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num2) && !isNaN(den) && den !== 0) {
        return num2 / den;
      }
    }
  }
  const num = parseFloat(numStr);
  return isNaN(num) ? void 0 : num;
}
function cleanIngredientName(nameWork, originalLine) {
  let cleaned = nameWork.replace(/\s+/g, " ").trim();
  cleaned = cleaned.replace(/^[・•\-\*\+★☆]\s*/, "");
  cleaned = cleaned.replace(/：$/, "");
  if (!cleaned || cleaned.length < 2) {
    const words = originalLine.split(/\s+/);
    cleaned = words.find((w) => w.length >= 2 && !/\d/.test(w)) || originalLine;
    cleaned = cleaned.replace(/^[・•\-\*\+★☆]\s*/, "").replace(/：$/, "");
  }
  return cleaned;
}
function roundForUnit(value, unit) {
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
      return Math.round(value * 10) / 10;
    }
    case "pinch":
      return value;
    default:
      return Math.round(value * 10) / 10;
  }
}

// src/parse.ts
function parseJsonLdRecipesFromScripts(scripts) {
  const recipes = [];
  for (const text of scripts) {
    try {
      const data = JSON.parse(text);
      const nodes = Array.isArray(data) ? data : [data];
      for (const node of nodes) {
        collectRecipes(node, recipes);
      }
    } catch {
    }
  }
  return recipes;
}
function collectRecipes(node, acc) {
  if (!node || typeof node !== "object") return;
  const types = toArray(node["@type"]).map(String);
  if (types.some((t) => equalsIgnoreCase(t, "Recipe"))) {
    acc.push(node);
  }
  if (Array.isArray(node["@graph"])) {
    for (const n of node["@graph"]) collectRecipes(n, acc);
  }
  for (const key of Object.keys(node)) {
    const val = node[key];
    if (val && typeof val === "object") collectRecipes(val, acc);
  }
}
function normalizeRecipe(raw) {
  const name = raw.name || raw.headline || void 0;
  const imageUrl = extractImageUrl(raw.image);
  const author = typeof raw.author === "string" ? raw.author : raw.author?.name;
  const yieldText = raw.recipeYield ? Array.isArray(raw.recipeYield) ? raw.recipeYield.join(", ") : String(raw.recipeYield) : void 0;
  const baseServings = (() => {
    const y = parseRecipeYield(yieldText);
    if (!y) return 2;
    if (y.unit === "serving") {
      if (y.quantity != null) return y.quantity;
      if (y.quantityRange)
        return Math.round((y.quantityRange.min + y.quantityRange.max) / 2);
    }
    return 2;
  })();
  const ingredientsRaw = toArray(raw.recipeIngredient).map(String).filter(Boolean);
  const ingredients = ingredientsRaw.map(parseIngredientLine);
  const instructions = normalizeInstructions(raw.recipeInstructions);
  const times = {
    prep: raw.prepTime,
    cook: raw.cookTime,
    total: raw.totalTime
  };
  const nutrition = normalizeNutrition(raw.nutrition);
  return {
    name,
    imageUrl,
    author,
    yieldText,
    baseServings,
    ingredients,
    instructions,
    times,
    nutrition
  };
}
function extractImageUrl(imageField) {
  if (!imageField) return void 0;
  if (typeof imageField === "string") return imageField;
  if (Array.isArray(imageField)) {
    const s = imageField.find((v) => typeof v === "string");
    if (s) return s;
    const o = imageField.find((v) => typeof v === "object" && v.url);
    return o?.url;
  }
  if (typeof imageField === "object")
    return imageField.url || imageField["@id"];
  return void 0;
}
function stripDecorations(text) {
  return text.replace(/[《》「」『』【】]/g, "");
}
function parseRangeOrNumber(numStr) {
  if (/[〜～-]/.test(numStr)) {
    const parts = numStr.split(/[〜～-]/);
    if (parts.length === 2) {
      const a = parseNumber(parts[0].trim());
      const b = parseNumber(parts[1].trim());
      if (a != null && b != null) {
        return {
          r: { min: Math.min(a, b), max: Math.max(a, b) },
          q: (a + b) / 2
        };
      }
    }
  }
  const q = parseNumber(numStr);
  return { q };
}
function parseRecipeYield(text) {
  if (!text) return void 0;
  const original = String(text).trim();
  if (!original) return void 0;
  const normalized = normalizeNumerals(stripDecorations(original));
  const non = checkNonScalableKeywords(normalized);
  if (non) {
    return {
      originalText: original,
      scalable: false
    };
  }
  const { stripped, parensInner, parens } = stripAndCollectParentheticals(normalized);
  const work = stripped.trim();
  const personMatch = work.match(
    /(\d+(?:\.\d+)?(?:\s*[〜～-]\s*\d+(?:\.\d+)?)?)\s*人(分|前)?/i
  );
  if (personMatch) {
    const numStr = personMatch[1];
    const { q, r } = parseRangeOrNumber(numStr);
    const beforeIdx = normalized.indexOf(numStr);
    const prefix = beforeIdx > 0 ? normalized.slice(0, beforeIdx).trim() || void 0 : void 0;
    const out = {
      originalText: original,
      quantity: r ? void 0 : q,
      quantityRange: r,
      unit: "serving",
      unitText: unitDisplayJa["serving"],
      prefix,
      suffix: personMatch[2] || void 0,
      scalable: true
    };
    const keptParens = [];
    for (let i = 0; i < parensInner.length; i++) {
      const inner = parensInner[i];
      const full = parens[i];
      const alt = parseQuantityExpression(inner);
      const allowedSecondaryUnits = ["piece", "slice", "cup"];
      if (alt.hasNumber && alt.unit && allowedSecondaryUnits.includes(alt.unit)) {
        out.secondaryQuantity = alt.quantity;
        out.secondaryQuantityRange = alt.quantityRange;
        out.secondaryUnit = alt.unit;
        out.secondaryUnitText = alt.unitText;
        out.secondaryPrefix = alt.prefix;
        out.secondarySuffix = alt.suffix;
        continue;
      }
      keptParens.push(full);
    }
    if (keptParens.length) {
      out.prefix = [out.prefix, keptParens.join(" ")].filter(Boolean).join("").trim() || void 0;
    }
    return out;
  }
  const matches = Array.from(work.matchAll(NUMBER_PATTERN));
  if (matches.length > 0) {
    const candidates = matches.map((m) => {
      const idx = m.index || 0;
      const before = work.slice(0, idx).trim().toLowerCase();
      const after = work.slice(idx + m[0].length).trim().toLowerCase();
      const unitMatch = extractUnitAdjacent(before, after);
      return { m, idx, beforeLower: before, afterLower: after, unitMatch };
    });
    const withUnit = candidates.filter((c) => c.unitMatch);
    const chosen = (withUnit.length ? withUnit : candidates).slice(-1)[0];
    const numStr = chosen.m[1];
    const { q, r } = parseRangeOrNumber(numStr);
    let unit = chosen.unitMatch?.unit;
    let unitText = chosen.unitMatch?.matched;
    let suffix;
    if (chosen.unitMatch && chosen.unitMatch.side === "after") {
      const rest = work.slice(chosen.idx + chosen.m[0].length).trim().slice(chosen.unitMatch.matched.length);
      const sm = rest.match(/^([一-龯ぁ-ゔァ-ヴーa-zA-Z]+)/);
      if (sm && sm[1]) suffix = sm[1];
    }
    const beforeWork = work.slice(0, chosen.idx).trim();
    let prefix = beforeWork ? beforeWork : void 0;
    if (chosen.unitMatch && chosen.unitMatch.side === "before" && prefix) {
      const rawTrim = prefix;
      if (rawTrim.toLowerCase().endsWith(chosen.unitMatch.matched)) {
        prefix = rawTrim.slice(0, rawTrim.length - chosen.unitMatch.matched.length).trim() || void 0;
      }
    }
    const out = {
      originalText: original,
      quantity: r ? void 0 : q,
      quantityRange: r,
      unit,
      unitText,
      prefix,
      suffix,
      scalable: q != null || !!r
    };
    if ((out.quantity != null || out.quantityRange) && !out.unit) {
      out.unit = "serving";
      out.unitText = unitDisplayJa["serving"];
      out.suffix = out.suffix ?? "\u5206";
      out.scalable = true;
    }
    const keptParens = [];
    for (let i = 0; i < parensInner.length; i++) {
      const inner = parensInner[i];
      const full = parens[i];
      const alt = parseQuantityExpression(inner);
      const allowedSecondaryUnits = ["piece", "slice", "cup"];
      if (alt.hasNumber && alt.unit && allowedSecondaryUnits.includes(alt.unit)) {
        out.secondaryQuantity = alt.quantity;
        out.secondaryQuantityRange = alt.quantityRange;
        out.secondaryUnit = alt.unit;
        out.secondaryUnitText = alt.unitText;
        out.secondaryPrefix = alt.prefix;
        out.secondarySuffix = alt.suffix;
        continue;
      }
      keptParens.push(full);
    }
    if (keptParens.length) {
      out.prefix = [out.prefix, keptParens.join(" ")].filter(Boolean).join("").trim() || void 0;
    }
    return out;
  }
  const t = work.toLowerCase();
  const m2 = t.match(/serv(e|ing)s?\s*(\d+(?:\.\d+)?)/);
  if (m2) {
    return {
      originalText: original,
      quantity: Number(m2[2]),
      unit: "serving",
      unitText: unitDisplayJa["serving"],
      scalable: true
    };
  }
  const m3 = t.match(/for\s*(\d+(?:\.\d+)?)\s*(people|persons|servings?)/);
  if (m3) {
    return {
      originalText: original,
      quantity: Number(m3[1]),
      unit: "serving",
      unitText: unitDisplayJa["serving"],
      scalable: true
    };
  }
  return {
    originalText: original,
    scalable: false
  };
}
function normalizeInstructions(instr) {
  if (!instr) return [];
  if (typeof instr === "string") {
    return [{ text: instr.trim() }].filter((i) => i.text);
  }
  if (Array.isArray(instr)) {
    const res = [];
    for (const step of instr) {
      if (!step) continue;
      if (typeof step === "string") {
        res.push({ text: step.trim() });
      } else if (typeof step === "object") {
        const instruction = {
          text: ""
        };
        if (typeof step.text === "string") {
          instruction.text = step.text.trim();
        } else if (typeof step.name === "string") {
          instruction.text = step.name.trim();
        }
        if (step.image) {
          instruction.imageUrl = extractImageUrl(step.image);
        }
        if (typeof step.name === "string" && step.name !== instruction.text) {
          instruction.name = step.name.trim();
        }
        if (typeof step.url === "string") {
          instruction.url = step.url;
        }
        if (instruction.text) {
          res.push(instruction);
        }
      }
    }
    return res.filter((i) => i.text);
  }
  if (typeof instr === "object") {
    if (typeof instr.text === "string") {
      const instruction = { text: instr.text.trim() };
      if (instr.image) {
        instruction.imageUrl = extractImageUrl(instr.image);
      }
      if (typeof instr.name === "string") {
        instruction.name = instr.name.trim();
      }
      if (typeof instr.url === "string") {
        instruction.url = instr.url;
      }
      return [instruction];
    }
    if (Array.isArray(instr.itemListElement)) {
      return normalizeInstructions(instr.itemListElement);
    }
  }
  return [];
}
function normalizeNutrition(n) {
  if (!n || typeof n !== "object") return void 0;
  const out = {};
  for (const k of Object.keys(n)) {
    const v = n[k];
    if (v == null) continue;
    const s = typeof v === "string" ? v : String(v);
    out[k] = s;
  }
  return Object.keys(out).length ? out : void 0;
}
function extractSecondaryFromParens(parensInner, allowedUnits) {
  for (const inner of parensInner) {
    const alt = parseQuantityExpression(inner);
    if (alt.hasNumber) {
      if (allowedUnits && alt.unit && !allowedUnits.includes(alt.unit)) {
        continue;
      }
      return {
        quantity: alt.quantity,
        quantityRange: alt.quantityRange,
        unit: alt.unit,
        unitText: alt.unitText,
        prefix: alt.prefix,
        suffix: alt.suffix
      };
    }
  }
  return void 0;
}
function parseIngredientLine(line) {
  const original = line.trim();
  const spaceSplit = original.split(/[\s　]+/);
  if (spaceSplit.length === 2) {
    const result = tryParseIngredientQuantity(
      spaceSplit[0],
      spaceSplit[1],
      original
    );
    if (result) return result;
  }
  return parseComplexIngredientLine(original);
}
function tryParseIngredientQuantity(ingredient, quantityStr, originalLine) {
  const normRaw = normalizeNumerals(quantityStr);
  const { stripped, parensInner, parens } = (() => {
    const r = stripAndCollectParentheticals(normRaw);
    return r;
  })();
  const quantityInfo = parseQuantityExpression(stripped);
  let primaryFromParens;
  let secondary = extractSecondaryFromParens(parensInner);
  if (!quantityInfo.hasNumber && secondary) {
    primaryFromParens = secondary;
    secondary = void 0;
  }
  let parenNoteSuffix;
  if (!secondary && parens && parens.length) {
    const note = parens.join(" ").trim();
    if (note) parenNoteSuffix = note;
  }
  if (!quantityInfo.hasNumber && !quantityInfo.isNonScalable) {
    return null;
  }
  return {
    originalText: originalLine,
    name: ingredient,
    quantity: primaryFromParens?.quantity ?? quantityInfo.quantity,
    quantityRange: primaryFromParens?.quantityRange ?? quantityInfo.quantityRange,
    unit: primaryFromParens?.unit ?? quantityInfo.unit,
    unitText: primaryFromParens?.unitText ?? quantityInfo.unitText,
    prefix: primaryFromParens?.prefix ?? quantityInfo.prefix,
    suffix: [quantityInfo.suffix, parenNoteSuffix].filter(Boolean).join("") || void 0,
    secondaryQuantity: secondary?.quantity,
    secondaryQuantityRange: secondary?.quantityRange,
    secondaryUnit: secondary?.unit,
    secondaryUnitText: secondary?.unitText,
    secondaryPrefix: secondary?.prefix,
    secondarySuffix: secondary?.suffix,
    scalable: primaryFromParens != null || !quantityInfo.isNonScalable
  };
}
function parseComplexIngredientLine(line) {
  const original = line.trim();
  let work = normalizeNumerals(original);
  const { stripped: workNoParens, parensInner } = stripAndCollectParentheticals(work);
  work = workNoParens;
  const quantityInfo = parseQuantityExpression(work);
  let nameWork = work;
  if (quantityInfo.originalExpression) {
    nameWork = nameWork.replace(quantityInfo.originalExpression, " ");
  }
  if (quantityInfo.unit) {
    for (const [unitStr, canonicalUnit] of Object.entries(unitMap)) {
      if (canonicalUnit === quantityInfo.unit) {
        nameWork = nameWork.replace(new RegExp(`\\b${unitStr}\\b`, "g"), " ");
      }
    }
  }
  const name = cleanIngredientName(nameWork, original);
  let primaryFromParens;
  let secondary = extractSecondaryFromParens(parensInner);
  if (!quantityInfo.hasNumber && secondary) {
    primaryFromParens = secondary;
    secondary = void 0;
  }
  let parenNoteSuffix;
  if (!secondary) {
    const removed = stripAndCollectParentheticals(line);
    if (removed.parens && removed.parens.length) {
      parenNoteSuffix = removed.parens.join(" ");
    }
  }
  return {
    originalText: original,
    name,
    quantity: primaryFromParens?.quantity ?? quantityInfo.quantity,
    quantityRange: primaryFromParens?.quantityRange ?? quantityInfo.quantityRange,
    unit: primaryFromParens?.unit ?? quantityInfo.unit,
    unitText: primaryFromParens?.unitText ?? quantityInfo.unitText,
    prefix: primaryFromParens?.prefix ?? quantityInfo.prefix,
    suffix: [quantityInfo.suffix, parenNoteSuffix].filter(Boolean).join("") || void 0,
    secondaryQuantity: secondary?.quantity,
    secondaryQuantityRange: secondary?.quantityRange,
    secondaryUnit: secondary?.unit,
    secondaryUnitText: secondary?.unitText,
    secondaryPrefix: secondary?.prefix,
    secondarySuffix: secondary?.suffix,
    scalable: primaryFromParens != null || !quantityInfo.isNonScalable
  };
}
function parseQuantityExpression(text) {
  const nonScalableMatch = checkNonScalableKeywords(text);
  if (nonScalableMatch) {
    return {
      hasNumber: false,
      isNonScalable: true,
      prefix: void 0,
      // 非スケール語自体を表示に残す
      suffix: nonScalableMatch.match,
      originalExpression: nonScalableMatch.match
    };
  }
  const preNormalized = text.replace(
    /(\d+)\s*(?:と)?\s*(\d+[\/／]\d+)/g,
    (_m, a, frac) => {
      const fv = parseNumber(frac);
      if (fv == null) return `${a} ${frac}`;
      return String(Number(a) + fv);
    }
  );
  let quantity;
  let quantityRange;
  let unit;
  let unitText;
  let prefix;
  let suffix;
  let originalExpression;
  const numberMatches = Array.from(preNormalized.matchAll(NUMBER_PATTERN));
  if (numberMatches.length > 0) {
    const numberMatch = numberMatches[0];
    originalExpression = numberMatch[0];
    const numberStr = numberMatch[1];
    const cleanNum = numberStr.replace(/[\/／〜～~-].*/, "");
    if (cleanNum.length >= 5) {
      return {
        hasNumber: false,
        isNonScalable: true
      };
    }
    if (/[〜～~-]/.test(numberStr)) {
      const rangeParts = numberStr.split(/[〜～~-]/);
      if (rangeParts.length === 2) {
        const min = parseNumber(rangeParts[0].trim());
        const max = parseNumber(rangeParts[1].trim());
        if (min !== void 0 && max !== void 0) {
          quantityRange = { min: Math.min(min, max), max: Math.max(min, max) };
          quantity = (min + max) / 2;
        }
      }
    } else {
      quantity = parseNumber(numberStr);
    }
    const beforeNumber = preNormalized.substring(0, numberMatch.index || 0);
    const afterNumber = preNormalized.substring(
      (numberMatch.index || 0) + numberMatch[0].length
    );
    const beforeLower = beforeNumber.trim().toLowerCase();
    const afterLower = afterNumber.trim().toLowerCase();
    let unitMatch = extractUnitAdjacent(beforeLower, afterLower);
    if (!unitMatch) {
      const fallback = extractUnit(beforeNumber + " " + afterNumber) || extractUnit(preNormalized);
      if (fallback) {
        unitMatch = { ...fallback, matched: fallback.unitText, side: "after" };
      }
    }
    if (unitMatch) {
      unit = unitMatch.unit;
      unitText = unitMatch.unitText;
      if (unitMatch.side === "after") {
        const afterTrim = afterNumber.trim();
        const rest = afterTrim.slice(unitMatch.matched.length).trim();
        const m = rest.match(/^([〜～-]?[一-龯ぁ-ゔァ-ヴーa-zA-Z]+(?:で)?)?/);
        if (m && m[0]) suffix = m[0].trim() || void 0;
      }
    }
    if (quantity !== void 0 && !quantityRange && /[〜～~-]/.test(afterNumber)) {
      const m = afterNumber.match(/[〜～~-]\s*(\d+(?:\.\d+)?(?:[\/／]\d+)?)/);
      if (m) {
        const nextVal = parseNumber(m[1]);
        if (nextVal !== void 0) {
          const minV = Math.min(quantity, nextVal);
          const maxV = Math.max(quantity, nextVal);
          quantityRange = { min: minV, max: maxV };
          quantity = (minV + maxV) / 2;
        }
      }
    }
    const beforeRaw = beforeNumber;
    if (beforeRaw && /\S$/.test(beforeRaw)) {
      let beforeForPrefix = beforeRaw;
      if (unitMatch && unitMatch.side === "before") {
        const rawTrim = beforeRaw.trimEnd();
        if (rawTrim.toLowerCase().endsWith(unitMatch.matched)) {
          beforeForPrefix = rawTrim.slice(
            0,
            rawTrim.length - unitMatch.matched.length
          );
        }
      }
      const m = beforeForPrefix.match(/([一-龯ぁ-ゔァ-ヴーa-zA-Z]+)$/);
      if (m && m[1]) prefix = m[1];
    }
  }
  return {
    quantity,
    quantityRange,
    unit,
    unitText,
    prefix,
    suffix,
    hasNumber: quantity !== void 0 || quantityRange !== void 0,
    isNonScalable: quantity === void 0 && quantityRange === void 0,
    originalExpression
  };
}
function extractUnit(text) {
  const haystack = text.toLowerCase();
  for (const [unitStrLower, canonicalUnit] of SORTED_UNIT_ENTRIES) {
    if (haystack.includes(unitStrLower)) {
      return {
        unit: canonicalUnit,
        unitText: unitDisplayJa[canonicalUnit] || unitStrLower
      };
    }
  }
  return void 0;
}
function extractUnitAdjacent(beforeLowerTrim, afterLowerTrim) {
  const countStarts = [
    ["\u500B", "piece"],
    ["\u672C", "stalk"],
    ["\u679A", "slice"],
    ["\u4E01", "block"],
    ["\u7247", "clove"],
    ["\u7F36", "can"],
    ["\u30D1\u30C3\u30AF", "pack"],
    ["\u888B", "bag"],
    ["\u675F", "bunch"],
    ["\u682A", "head"],
    ["\u5C3E", "tail"],
    ["\u7C92", "grain"]
  ];
  for (const [jp, cu] of countStarts) {
    if (afterLowerTrim.startsWith(jp)) {
      return {
        unit: cu,
        unitText: unitDisplayJa[cu] || jp,
        matched: jp,
        side: "after"
      };
    }
  }
  for (const [unitStrLower, canonicalUnit] of SORTED_UNIT_ENTRIES) {
    if (afterLowerTrim.startsWith(unitStrLower) || beforeLowerTrim.endsWith(unitStrLower)) {
      return {
        unit: canonicalUnit,
        unitText: unitDisplayJa[canonicalUnit] || unitStrLower,
        matched: unitStrLower,
        side: afterLowerTrim.startsWith(unitStrLower) ? "after" : "before"
      };
    }
  }
  if (afterLowerTrim.startsWith("\u3053") || beforeLowerTrim.endsWith("\u3053")) {
    return {
      unit: "piece",
      unitText: unitDisplayJa["piece"],
      matched: "\u3053",
      side: afterLowerTrim.startsWith("\u3053") ? "after" : "before"
    };
  }
  return void 0;
}

// src/format.ts
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
  const isSpoonOrCup = unit === "tsp" || unit === "tbsp" || unit === "cup";
  const clampForLarge = (v2) => v2 >= 10 ? Math.floor(v2) : v2;
  if (isSpoonOrCup) {
    const rounded2 = Math.round(value * 4) / 4;
    const v2 = clampForLarge(rounded2);
    return Number.isInteger(v2) ? `${Math.trunc(v2)}` : `${v2}`;
  }
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
function formatQuantity(value, unit) {
  if (value == null) return "";
  const { value: dispValue, unit: dispUnit } = convertForDisplay(value, unit);
  const frac = toNaturalJapaneseFraction(dispValue, dispUnit);
  const unitStr = dispUnit ? unitDisplayJa[dispUnit] ?? "" : "";
  if (dispUnit === "pinch") {
    const intLike = Math.abs(dispValue - Math.round(dispValue)) < 1e-6;
    if (Math.abs(value - 1) < 1e-6) return "\u3072\u3068\u3064\u307E\u307F";
    if (intLike) return `${Math.round(dispValue)}\u3064\u307E\u307F`;
    return `${frac} ${unitStr}`.trim();
  }
  if (dispUnit === "tbsp" || dispUnit === "tsp") {
    return `${unitStr}${frac}`;
  }
  return `${frac}${unitStr ? " " + unitStr : ""}`.trim();
}
function formatQuantityRange(min, max, unit) {
  const maxDisp = convertForDisplay(max, unit);
  let displayUnit = maxDisp.unit;
  let minValue;
  let maxValue;
  if (displayUnit === "ml") {
    const toMl = (v) => {
      if (unit === "ml") return v;
      if (unit === "tbsp") return v * 15;
      if (unit === "tsp") return v / 3 * 15;
      return v;
    };
    minValue = toMl(min);
    maxValue = toMl(max);
  } else if (displayUnit === "tbsp") {
    const toTbsp = (v) => {
      if (unit === "tbsp") return v;
      if (unit === "tsp") return v / 3;
      return v;
    };
    minValue = toTbsp(min);
    maxValue = toTbsp(max);
  } else if (displayUnit === "tsp") {
    minValue = min;
    maxValue = max;
  } else {
    const minStr2 = toNaturalJapaneseFraction(min, unit);
    const maxStr2 = toNaturalJapaneseFraction(max, unit);
    const unitStr2 = unit ? unitDisplayJa[unit] ?? "" : "";
    return `${minStr2}\u301C${maxStr2}${unitStr2 ? " " + unitStr2 : ""}`.trim();
  }
  const minStr = toNaturalJapaneseFraction(minValue, displayUnit);
  const maxStr = toNaturalJapaneseFraction(maxValue, displayUnit);
  const unitStr = displayUnit ? unitDisplayJa[displayUnit] ?? "" : "";
  if (displayUnit === "tbsp" || displayUnit === "tsp") {
    return `${unitStr}${minStr}\u301C${maxStr}`;
  }
  return `${minStr}\u301C${maxStr}${unitStr ? " " + unitStr : ""}`.trim();
}
function formatRecipeYield(y) {
  if (!y) return "";
  const parts = [];
  if (y.prefix) parts.push(y.prefix.trim());
  let core = "";
  if (y.quantityRange) {
    if (y.unitText) {
      const minStr = toNaturalJapaneseFraction(y.quantityRange.min, y.unit);
      const maxStr = toNaturalJapaneseFraction(y.quantityRange.max, y.unit);
      core = `${minStr}\u301C${maxStr}${y.unitText}`;
    } else {
      core = formatQuantityRange(
        y.quantityRange.min,
        y.quantityRange.max,
        y.unit
      );
    }
  } else if (y.quantity != null) {
    if (y.unitText) {
      const v = toNaturalJapaneseFraction(y.quantity, y.unit);
      core = `${v}${y.unitText}`;
    } else {
      core = formatQuantity(y.quantity, y.unit);
    }
  }
  if (core) parts.push(core);
  if (y.suffix) parts.push(y.suffix.trim());
  let txt = parts.join("").trim();
  let secondary = "";
  if (y.secondaryQuantityRange) {
    secondary = formatQuantityRange(
      y.secondaryQuantityRange.min,
      y.secondaryQuantityRange.max,
      y.secondaryUnit
    );
  } else if (y.secondaryQuantity != null) {
    secondary = formatQuantity(y.secondaryQuantity, y.secondaryUnit);
  }
  if (secondary) {
    const secTxt = `${y.secondaryPrefix ?? ""}${secondary}${y.secondarySuffix ?? ""}`;
    txt = `${txt}\uFF08${secTxt}\uFF09`;
  }
  return txt;
}

// src/domain.ts
var Ingredient = class _Ingredient {
  constructor(data) {
    this.data = data;
  }
  static parse(line) {
    return new _Ingredient(parseIngredientLine(line));
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
    if (!ing.scalable) return new _Ingredient(ing);
    let quantity = ing.quantity;
    let quantityRange = ing.quantityRange;
    if (typeof quantity === "number") {
      quantity = roundForUnit(quantity * factor, ing.unit);
    }
    if (quantityRange) {
      quantityRange = {
        min: roundForUnit(quantityRange.min * factor, ing.unit),
        max: roundForUnit(quantityRange.max * factor, ing.unit)
      };
    }
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
        )
      };
    }
    const scaled = {
      ...ing,
      quantity,
      quantityRange,
      secondaryQuantity,
      secondaryQuantityRange
    };
    return new _Ingredient(scaled);
  }
  format() {
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
    const primary = `${ing.prefix ?? ""}${primaryCore}${ing.suffix ?? ""}`.trim();
    let secondary = "";
    if (ing.secondaryQuantityRange) {
      const secondaryCore = formatQuantityRange(
        ing.secondaryQuantityRange.min,
        ing.secondaryQuantityRange.max,
        ing.secondaryUnit
      );
      secondary = `${ing.secondaryPrefix ?? ""}${secondaryCore}${ing.secondarySuffix ?? ""}`;
    } else if (ing.secondaryQuantity != null) {
      const secondaryCore = formatQuantity(
        ing.secondaryQuantity,
        ing.secondaryUnit
      );
      secondary = `${ing.secondaryPrefix ?? ""}${secondaryCore}${ing.secondarySuffix ?? ""}`;
    }
    if (secondary) return `${primary}\uFF08${secondary}\uFF09`.trim();
    return primary.trim();
  }
  toJSON() {
    return { ...this.data };
  }
};
var Instruction = class {
  constructor(data) {
    this.data = data;
  }
  get text() {
    return this.data.text;
  }
  get imageUrl() {
    return this.data.imageUrl;
  }
  get name() {
    return this.data.name;
  }
  get url() {
    return this.data.url;
  }
  toJSON() {
    return { ...this.data };
  }
};
var Yield = class _Yield {
  constructor(data) {
    this.data = data;
  }
  static parse(text) {
    return new _Yield(parseRecipeYield(text));
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
    return this.data ? { ...this.data } : void 0;
  }
};
var Recipe = class _Recipe {
  constructor(data) {
    this.data = data;
  }
  static fromJsonLd(raw) {
    return new _Recipe(normalizeRecipe(raw));
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
    return this.data.instructions.map((i) => new Instruction(i));
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
    const base = this.data.baseServings && this.data.baseServings > 0 ? this.data.baseServings : 2;
    const factor = toServings / base;
    const scaledIngredients = this.data.ingredients.map(
      (i) => new Ingredient(i).scale(factor).toJSON()
    );
    const scaled = {
      ...this.data,
      ingredients: scaledIngredients,
      // baseServings は初期値を維持（連続スケール時のドリフト防止）
      baseServings: this.data.baseServings
    };
    return new _Recipe(scaled);
  }
  toJSON() {
    return { ...this.data };
  }
};

// extension/src/content.tsx
var currentSidebar = null;
var currentRecipeData = null;
var HOST_COMP_STYLE_ID = "recipe-sidebar-host-compensation";
var SIDEBAR_WIDTH_CSS = "min(360px, 40vw)";
function injectHostCompensationStyles() {
  const style = document.createElement("style");
  style.textContent = `
    html { 
      margin-right: ${SIDEBAR_WIDTH_CSS} !important; 
      overflow-y: auto !important;
      height: auto !important;
      min-height: 100% !important;
    }
    body {
      overflow-x: hidden !important; 
      overflow-y: auto !important;
      height: auto !important;
      min-height: 100% !important;
      box-sizing: border-box !important;
    }
  `;
  document.head.appendChild(style);
}
function removeHostCompensationStyles() {
  const style = document.getElementById(HOST_COMP_STYLE_ID);
  if (style && style.parentNode) style.parentNode.removeChild(style);
}
function showSidebar() {
  if (currentSidebar) {
    return;
  }
  if (!currentRecipeData) {
    const scripts = getJsonLdScriptsFromDocument(document);
    const recipesRaw = parseJsonLdRecipesFromScripts(scripts);
    if (!recipesRaw.length) return;
    currentRecipeData = recipesRaw[0];
  }
  const normalizedRecipe = Recipe.fromJsonLd(currentRecipeData);
  currentSidebar = createSidebarWithIframe(normalizedRecipe, currentRecipeData);
  injectHostCompensationStyles();
}
function hideSidebar() {
  if (currentSidebar) {
    currentSidebar.remove();
    currentSidebar = null;
    removeHostCompensationStyles();
  }
}
function toggleSidebar() {
  if (currentSidebar) {
    hideSidebar();
  } else {
    showSidebar();
  }
}
function createSidebarWithIframe(recipe, rawRecipeData) {
  const iframe = document.createElement("iframe");
  iframe.id = "recipe-sidebar-iframe";
  iframe.src = chrome.runtime.getURL("./iframe-content.html");
  iframe.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    height: 100vh !important;
    width: ${SIDEBAR_WIDTH_CSS} !important;
    border: none !important;
    box-shadow: 0 0 12px rgba(0,0,0,0.15) !important;
    border-left: 1px solid #eee !important;
    z-index: 2147483647 !important;
    background: white !important;
    overflow: hidden !important;
  `;
  let iframeReady = false;
  window.addEventListener("message", (event) => {
    if (event.source !== iframe.contentWindow) return;
    if (event.data.type === "IFRAME_READY") {
      iframeReady = true;
      iframe.contentWindow?.postMessage({
        type: "RECIPE_DATA",
        recipe: rawRecipeData
      }, "*");
    } else if (event.data.type === "CLOSE_SIDEBAR") {
      hideSidebar();
    }
  });
  iframe.onload = () => {
    if (!iframeReady) {
      setTimeout(() => {
        iframe.contentWindow?.postMessage({
          type: "RECIPE_DATA",
          recipe: rawRecipeData
        }, "*");
      }, 100);
    }
  };
  const host = document.body || document.documentElement;
  host.appendChild(iframe);
  try {
    console.log("[recipe-ext] Iframe sidebar created");
  } catch {
  }
  return iframe;
}
function main() {
  try {
    const scripts = getJsonLdScriptsFromDocument(document);
    const recipesRaw = parseJsonLdRecipesFromScripts(scripts);
    if (!recipesRaw.length) return;
    currentRecipeData = recipesRaw[0];
    showSidebar();
  } catch (e) {
  }
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "TOGGLE_SIDEBAR") {
    toggleSidebar();
    sendResponse({ success: true });
  }
});
main();
//# sourceMappingURL=content.js.map
