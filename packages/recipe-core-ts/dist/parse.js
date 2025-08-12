/*
  Parsing of JSON-LD recipes and ingredient lines
*/
import { checkNonScalableKeywords, cleanIngredientName, equalsIgnoreCase, normalizeNumerals, NUMBER_PATTERN, parseNumber, SORTED_UNIT_ENTRIES, stripAndCollectParentheticals, toArray, unitDisplayJa, unitMap, } from "./core.js";
export function parseJsonLdRecipesFromScripts(scripts) {
    const recipes = [];
    for (const text of scripts) {
        try {
            const data = JSON.parse(text);
            const nodes = Array.isArray(data) ? data : [data];
            for (const node of nodes) {
                collectRecipes(node, recipes);
            }
        }
        catch {
            // ignore malformed JSON-LD
        }
    }
    return recipes;
}
function collectRecipes(node, acc) {
    if (!node || typeof node !== "object")
        return;
    const types = toArray(node["@type"]).map(String);
    if (types.some((t) => equalsIgnoreCase(t, "Recipe"))) {
        acc.push(node);
    }
    if (Array.isArray(node["@graph"])) {
        for (const n of node["@graph"])
            collectRecipes(n, acc);
    }
    for (const key of Object.keys(node)) {
        const val = node[key];
        if (val && typeof val === "object")
            collectRecipes(val, acc);
    }
}
export function normalizeRecipe(raw) {
    const name = raw.name || raw.headline || undefined;
    const imageUrl = extractImageUrl(raw.image);
    const author = typeof raw.author === "string" ? raw.author : raw.author?.name;
    const yieldText = raw.recipeYield
        ? Array.isArray(raw.recipeYield)
            ? raw.recipeYield.join(", ")
            : String(raw.recipeYield)
        : undefined;
    const baseServings = (() => {
        const y = parseRecipeYield(yieldText);
        if (!y)
            return 2;
        if (y.unit === "serving") {
            if (y.quantity != null)
                return y.quantity;
            if (y.quantityRange)
                return Math.round((y.quantityRange.min + y.quantityRange.max) / 2);
        }
        return 2;
    })();
    const ingredientsRaw = toArray(raw.recipeIngredient)
        .map(String)
        .filter(Boolean);
    const ingredients = ingredientsRaw.map(parseIngredientLine);
    const instructions = normalizeInstructions(raw.recipeInstructions);
    const times = {
        prep: raw.prepTime,
        cook: raw.cookTime,
        total: raw.totalTime,
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
        nutrition,
    };
}
function extractImageUrl(imageField) {
    if (!imageField)
        return undefined;
    if (typeof imageField === "string")
        return imageField;
    if (Array.isArray(imageField)) {
        const s = imageField.find((v) => typeof v === "string");
        if (s)
            return s;
        const o = imageField.find((v) => typeof v === "object" && v.url);
        return o?.url;
    }
    if (typeof imageField === "object")
        return imageField.url || imageField["@id"];
    return undefined;
}
// ========= Yield parsing =========
function stripDecorations(text) {
    // 《 》 「 」 『 』 【 】 を除去
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
                    q: (a + b) / 2,
                };
            }
        }
    }
    const q = parseNumber(numStr);
    return { q };
}
export function parseRecipeYield(text) {
    if (!text)
        return undefined;
    const original = String(text).trim();
    if (!original)
        return undefined;
    // Normalize numerals and basic symbols
    const normalized = normalizeNumerals(stripDecorations(original));
    // Check unscalable words first
    const non = checkNonScalableKeywords(normalized);
    if (non) {
        return {
            originalText: original,
            scalable: false,
        };
    }
    // Remove parentheticals but keep inner for secondary
    const { stripped, parensInner, parens } = stripAndCollectParentheticals(normalized);
    const work = stripped.trim();
    // 1) Prefer explicit "人" expressions
    const personMatch = work.match(/(\d+(?:\.\d+)?(?:\s*[〜～-]\s*\d+(?:\.\d+)?)?)\s*人(分|前)?/i);
    if (personMatch) {
        const numStr = personMatch[1];
        const { q, r } = parseRangeOrNumber(numStr);
        // Derive prefix from original (before first digit occurrence of this match)
        const beforeIdx = normalized.indexOf(numStr);
        const prefix = beforeIdx > 0
            ? normalized.slice(0, beforeIdx).trim() || undefined
            : undefined;
        const out = {
            originalText: original,
            quantity: r ? undefined : q,
            quantityRange: r,
            unit: "serving",
            unitText: unitDisplayJa["serving"],
            prefix,
            suffix: personMatch[2] || undefined,
            scalable: true,
        };
        // Secondary from parentheses (e.g., 2人分(4個)).
        // ただし、サイズ指定など (cm など) は prefix 側に戻す。
        const keptParens = [];
        for (let i = 0; i < parensInner.length; i++) {
            const inner = parensInner[i];
            const full = parens[i];
            const alt = parseQuantityExpression(inner);
            const allowedSecondaryUnits = ["piece", "slice", "cup"];
            if (alt.hasNumber &&
                alt.unit &&
                allowedSecondaryUnits.includes(alt.unit)) {
                out.secondaryQuantity = alt.quantity;
                out.secondaryQuantityRange = alt.quantityRange;
                out.secondaryUnit = alt.unit;
                out.secondaryUnitText = alt.unitText;
                out.secondaryPrefix = alt.prefix;
                out.secondarySuffix = alt.suffix;
                // 1つ見つけたら十分
                continue;
            }
            keptParens.push(full);
        }
        if (keptParens.length) {
            out.prefix =
                [out.prefix, keptParens.join(" ")].filter(Boolean).join("").trim() ||
                    undefined;
        }
        return out;
    }
    // 2) 数値トークンのうち、最後のものを優先し、前後の単位検出（Ingredient と同じ抽出器）
    const matches = Array.from(work.matchAll(NUMBER_PATTERN));
    if (matches.length > 0) {
        const candidates = matches.map((m) => {
            const idx = m.index || 0;
            const before = work.slice(0, idx).trim().toLowerCase();
            const after = work
                .slice(idx + m[0].length)
                .trim()
                .toLowerCase();
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
            const rest = work
                .slice(chosen.idx + chosen.m[0].length)
                .trim()
                .slice(chosen.unitMatch.matched.length);
            const sm = rest.match(/^([一-龯ぁ-ゔァ-ヴーa-zA-Z]+)/);
            if (sm && sm[1])
                suffix = sm[1];
        }
        const beforeWork = work.slice(0, chosen.idx).trim();
        let prefix = beforeWork ? beforeWork : undefined;
        // 単位が前側に来ている場合、prefix から単位文字列を剥がす
        if (chosen.unitMatch && chosen.unitMatch.side === "before" && prefix) {
            const rawTrim = prefix;
            if (rawTrim.toLowerCase().endsWith(chosen.unitMatch.matched)) {
                prefix =
                    rawTrim
                        .slice(0, rawTrim.length - chosen.unitMatch.matched.length)
                        .trim() || undefined;
            }
        }
        const out = {
            originalText: original,
            quantity: r ? undefined : q,
            quantityRange: r,
            unit,
            unitText,
            prefix,
            suffix,
            scalable: q != null || !!r,
        };
        // ルール: 数字しかない場合は 人分 とする
        if ((out.quantity != null || out.quantityRange) && !out.unit) {
            out.unit = "serving";
            out.unitText = unitDisplayJa["serving"];
            out.suffix = out.suffix ?? "分";
            out.scalable = true;
        }
        // Secondary from parentheses（サイズ指定などは prefix 側へ戻す）
        const keptParens = [];
        for (let i = 0; i < parensInner.length; i++) {
            const inner = parensInner[i];
            const full = parens[i];
            const alt = parseQuantityExpression(inner);
            const allowedSecondaryUnits = ["piece", "slice", "cup"];
            if (alt.hasNumber &&
                alt.unit &&
                allowedSecondaryUnits.includes(alt.unit)) {
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
            out.prefix =
                [out.prefix, keptParens.join(" ")].filter(Boolean).join("").trim() ||
                    undefined;
        }
        return out;
    }
    // 3) English fallbacks (servings)
    const t = work.toLowerCase();
    const m2 = t.match(/serv(e|ing)s?\s*(\d+(?:\.\d+)?)/);
    if (m2) {
        return {
            originalText: original,
            quantity: Number(m2[2]),
            unit: "serving",
            unitText: unitDisplayJa["serving"],
            scalable: true,
        };
    }
    const m3 = t.match(/for\s*(\d+(?:\.\d+)?)\s*(people|persons|servings?)/);
    if (m3) {
        return {
            originalText: original,
            quantity: Number(m3[1]),
            unit: "serving",
            unitText: unitDisplayJa["serving"],
            scalable: true,
        };
    }
    // Nothing parseable
    return {
        originalText: original,
        scalable: false,
    };
}
function normalizeInstructions(instr) {
    if (!instr)
        return [];
    if (typeof instr === "string") {
        return [{ text: instr.trim() }].filter((i) => i.text);
    }
    if (Array.isArray(instr)) {
        const res = [];
        for (const step of instr) {
            if (!step)
                continue;
            if (typeof step === "string") {
                res.push({ text: step.trim() });
            }
            else if (typeof step === "object") {
                const instruction = {
                    text: "",
                };
                // textフィールドを優先
                if (typeof step.text === "string") {
                    instruction.text = step.text.trim();
                }
                else if (typeof step.name === "string") {
                    instruction.text = step.name.trim();
                }
                // 画像URLを抽出
                if (step.image) {
                    instruction.imageUrl = extractImageUrl(step.image);
                }
                // その他のメタデータ
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
    if (!n || typeof n !== "object")
        return undefined;
    const out = {};
    for (const k of Object.keys(n)) {
        const v = n[k];
        if (v == null)
            continue;
        const s = typeof v === "string" ? v : String(v);
        out[k] = s;
    }
    return Object.keys(out).length ? out : undefined;
}
// ========= Ingredient line parsing =========
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
                suffix: alt.suffix,
            };
        }
    }
    return undefined;
}
export function parseIngredientLine(line) {
    const original = line.trim();
    const spaceSplit = original.split(/[\s　]+/);
    if (spaceSplit.length === 2) {
        const result = tryParseIngredientQuantity(spaceSplit[0], spaceSplit[1], original);
        if (result)
            return result;
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
        secondary = undefined;
    }
    // 数量として解釈できない括弧は suffix に残す
    let parenNoteSuffix;
    if (!secondary && parens && parens.length) {
        const note = parens.join(" ").trim();
        if (note)
            parenNoteSuffix = note;
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
        suffix: [quantityInfo.suffix, parenNoteSuffix].filter(Boolean).join("") ||
            undefined,
        secondaryQuantity: secondary?.quantity,
        secondaryQuantityRange: secondary?.quantityRange,
        secondaryUnit: secondary?.unit,
        secondaryUnitText: secondary?.unitText,
        secondaryPrefix: secondary?.prefix,
        secondarySuffix: secondary?.suffix,
        scalable: primaryFromParens != null || !quantityInfo.isNonScalable,
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
        secondary = undefined;
    }
    // 非数値の括弧は suffix に残す
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
        suffix: [quantityInfo.suffix, parenNoteSuffix].filter(Boolean).join("") ||
            undefined,
        secondaryQuantity: secondary?.quantity,
        secondaryQuantityRange: secondary?.quantityRange,
        secondaryUnit: secondary?.unit,
        secondaryUnitText: secondary?.unitText,
        secondaryPrefix: secondary?.prefix,
        secondarySuffix: secondary?.suffix,
        scalable: primaryFromParens != null || !quantityInfo.isNonScalable,
    };
}
export function parseQuantityExpression(text) {
    const nonScalableMatch = checkNonScalableKeywords(text);
    if (nonScalableMatch) {
        return {
            hasNumber: false,
            isNonScalable: true,
            prefix: undefined,
            // 非スケール語自体を表示に残す
            suffix: nonScalableMatch.match,
            originalExpression: nonScalableMatch.match,
        };
    }
    // "1 と 1/2" や "1 1/2" を合算小数へ
    const preNormalized = text.replace(/(\d+)\s*(?:と)?\s*(\d+[\/／]\d+)/g, (_m, a, frac) => {
        const fv = parseNumber(frac);
        if (fv == null)
            return `${a} ${frac}`;
        return String(Number(a) + fv);
    });
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
                isNonScalable: true,
            };
        }
        if (/[〜～~-]/.test(numberStr)) {
            const rangeParts = numberStr.split(/[〜～~-]/);
            if (rangeParts.length === 2) {
                const min = parseNumber(rangeParts[0].trim());
                const max = parseNumber(rangeParts[1].trim());
                if (min !== undefined && max !== undefined) {
                    quantityRange = { min: Math.min(min, max), max: Math.max(min, max) };
                    quantity = (min + max) / 2;
                }
            }
        }
        else {
            quantity = parseNumber(numberStr);
        }
        const beforeNumber = preNormalized.substring(0, numberMatch.index || 0);
        const afterNumber = preNormalized.substring((numberMatch.index || 0) + numberMatch[0].length);
        const beforeLower = beforeNumber.trim().toLowerCase();
        const afterLower = afterNumber.trim().toLowerCase();
        let unitMatch = extractUnitAdjacent(beforeLower, afterLower);
        if (!unitMatch) {
            const fallback = extractUnit(beforeNumber + " " + afterNumber) ||
                extractUnit(preNormalized);
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
                // 単位直後の「〜お好みで」等も suffix に取り込む
                const m = rest.match(/^([〜～-]?[一-龯ぁ-ゔァ-ヴーa-zA-Z]+(?:で)?)?/);
                if (m && m[0])
                    suffix = m[0].trim() || undefined;
            }
        }
        if (quantity !== undefined &&
            !quantityRange &&
            /[〜～~-]/.test(afterNumber)) {
            const m = afterNumber.match(/[〜～~-]\s*(\d+(?:\.\d+)?(?:[\/／]\d+)?)/);
            if (m) {
                const nextVal = parseNumber(m[1]);
                if (nextVal !== undefined) {
                    const minV = Math.min(quantity, nextVal);
                    const maxV = Math.max(quantity, nextVal);
                    quantityRange = { min: minV, max: maxV };
                    quantity = (minV + maxV) / 2;
                }
            }
        }
        const beforeRaw = beforeNumber;
        if (beforeRaw && /\S$/.test(beforeRaw)) {
            // 単位が数値の前側にマッチしている場合、prefix からその単位文字を除去する
            let beforeForPrefix = beforeRaw;
            if (unitMatch && unitMatch.side === "before") {
                const rawTrim = beforeRaw.trimEnd();
                // unitMatch.matched は小文字化されたキーなので、長さで切り落とす
                // 末尾に一致する分だけ除去し、例えば「各小さじ」→「各」を維持する
                if (rawTrim.toLowerCase().endsWith(unitMatch.matched)) {
                    beforeForPrefix = rawTrim.slice(0, rawTrim.length - unitMatch.matched.length);
                }
            }
            const m = beforeForPrefix.match(/([一-龯ぁ-ゔァ-ヴーa-zA-Z]+)$/);
            if (m && m[1])
                prefix = m[1];
        }
    }
    return {
        quantity,
        quantityRange,
        unit,
        unitText,
        prefix,
        suffix,
        hasNumber: quantity !== undefined || quantityRange !== undefined,
        isNonScalable: quantity === undefined && quantityRange === undefined,
        originalExpression,
    };
}
export function extractUnit(text) {
    const haystack = text.toLowerCase();
    for (const [unitStrLower, canonicalUnit] of SORTED_UNIT_ENTRIES) {
        if (haystack.includes(unitStrLower)) {
            return {
                unit: canonicalUnit,
                unitText: unitDisplayJa[canonicalUnit] || unitStrLower,
            };
        }
    }
    return undefined;
}
export function extractUnitAdjacent(beforeLowerTrim, afterLowerTrim) {
    // 個・本 などの個数系が後置され、前置に「大」「小」（大さじ/小さじ）の曖昧表現がある場合は、後置の個数系を優先
    const countStarts = [
        ["個", "piece"],
        ["本", "stalk"],
        ["枚", "slice"],
        ["丁", "block"],
        ["片", "clove"],
        ["缶", "can"],
        ["パック", "pack"],
        ["袋", "bag"],
        ["束", "bunch"],
        ["株", "head"],
        ["尾", "tail"],
        ["粒", "grain"],
    ];
    for (const [jp, cu] of countStarts) {
        if (afterLowerTrim.startsWith(jp)) {
            return {
                unit: cu,
                unitText: unitDisplayJa[cu] || jp,
                matched: jp,
                side: "after",
            };
        }
    }
    for (const [unitStrLower, canonicalUnit] of SORTED_UNIT_ENTRIES) {
        if (afterLowerTrim.startsWith(unitStrLower) ||
            beforeLowerTrim.endsWith(unitStrLower)) {
            return {
                unit: canonicalUnit,
                unitText: unitDisplayJa[canonicalUnit] || unitStrLower,
                matched: unitStrLower,
                side: afterLowerTrim.startsWith(unitStrLower) ? "after" : "before",
            };
        }
    }
    if (afterLowerTrim.startsWith("こ") || beforeLowerTrim.endsWith("こ")) {
        return {
            unit: "piece",
            unitText: unitDisplayJa["piece"],
            matched: "こ",
            side: afterLowerTrim.startsWith("こ") ? "after" : "before",
        };
    }
    return undefined;
}
