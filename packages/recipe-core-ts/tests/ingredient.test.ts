import { strict as assert } from "assert";
import { readFileSync } from "fs";
import { join } from "path";
import { Ingredient, Recipe } from "../src/index";

function approxEqual(a: number | undefined, b: number, eps = 1e-6) {
  assert.ok(typeof a === "number");
  assert.ok(Math.abs((a as number) - b) < eps);
}

// Load all ingredient data from recipeIngredient.txt
function loadIngredientData(): string[] {
  const filePath = join(__dirname, "../output/recipeIngredient.txt");
  const content = readFileSync(filePath, "utf-8");
  return content.split("\n").filter((line) => line.trim() !== "");
}

// Load all quantity test data from recipeQuantity.txt
function loadQuantityTestData(): string[] {
  const filePath = join(__dirname, "../output/recipeQuantity.txt");
  const content = readFileSync(filePath, "utf-8");
  return content.split("\n").filter((line) => line.trim() !== "");
}

// Test result tracking
interface TestResult {
  line: string;
  success: boolean;
  error?: string;
  parsed?: any;
}

// Test individual quantity expressions
function runQuantityExpressionTests(): void {
  const quantityLines = loadQuantityTestData();
  const results: TestResult[] = [];
  let successCount = 0;
  let failureCount = 0;

  console.log(`\n🧪 分量表現テスト開始: ${quantityLines.length} 件`);
  console.log("=".repeat(60));

  for (let i = 0; i < quantityLines.length; i++) {
    const line = quantityLines[i];
    try {
      // Parse as "ingredient quantity" format
      const testIngredient = "テスト食材";
      const fullLine = `${testIngredient} ${line}`;
      const parsed = Ingredient.parse(fullLine).toJSON();

      // Check if quantity was successfully parsed
      const hasQuantity =
        parsed.quantity !== undefined || parsed.quantityRange !== undefined;
      // Include 半 (half) as a number indicator since it gets normalized to 1/2
      const hasNumberInOriginal =
        /\d|[０-９]|[一二三四五六七八九十]|ひとつ|ふたつ|半/.test(line);

      // If original has numbers but parsed doesn't, it's a failure
      if (hasNumberInOriginal && !hasQuantity && parsed.scalable) {
        throw new Error(`数量が検出されませんでした: "${line}"`);
      }

      // If original has no numbers, should be non-scalable
      if (!hasNumberInOriginal && parsed.scalable) {
        console.log(`Debug: Non-scalable detection failed for "${line}"`);
        console.log(`  hasNumberInOriginal: ${hasNumberInOriginal}`);
        console.log(`  parsed.scalable: ${parsed.scalable}`);
        console.log(`  parsed:`, JSON.stringify(parsed, null, 2));
        throw new Error(`非スケール可能として検出されませんでした: "${line}"`);
      }

      results.push({
        line,
        success: true,
        parsed,
      });
      successCount++;

      // Show progress every 50 items
      if ((i + 1) % 50 === 0) {
        console.log(
          `進捗: ${i + 1}/${quantityLines.length} (${Math.round(
            ((i + 1) / quantityLines.length) * 100
          )}%)`
        );
      }
    } catch (error) {
      results.push({
        line,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
      failureCount++;
      console.error(`❌ エラー (行 ${i + 1}): ${line}`);
      console.error(
        `   ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  console.log("\n📊 分量表現テスト結果:");
  console.log(
    `✅ 成功: ${successCount} / ${quantityLines.length} (${Math.round(
      (successCount / quantityLines.length) * 100
    )}%)`
  );
  console.log(
    `❌ 失敗: ${failureCount} / ${quantityLines.length} (${Math.round(
      (failureCount / quantityLines.length) * 100
    )}%)`
  );

  // Show some successful parsing examples
  console.log("\n🔍 分量解析結果例 (成功例の最初の15件):");
  const successful = results.filter((r) => r.success);
  for (let i = 0; i < Math.min(15, successful.length); i++) {
    const result = successful[i];
    if (result.parsed) {
      const p = result.parsed;
      console.log(`${i + 1}. "${result.line}"`);
      console.log(
        `   数量: ${p.quantity || "なし"}, 範囲: ${
          p.quantityRange
            ? `${p.quantityRange.min}〜${p.quantityRange.max}`
            : "なし"
        }, 単位: ${p.unit || "なし"}, スケール可能: ${p.scalable}`
      );
      if (p.notes) console.log(`   備考: ${p.notes}`);
    }
  }

  // Show failed examples
  if (failureCount > 0) {
    console.log("\n❌ 失敗例 (最初の10件):");
    const failures = results.filter((r) => !r.success).slice(0, 10);
    failures.forEach((result, i) => {
      console.log(`${i + 1}. "${result.line}"`);
      console.log(`   エラー: ${result.error}`);
    });
  }

  if (failureCount > 0) {
    throw new Error(`${failureCount} 件の分量表現解析に失敗しました`);
  }
}

function runAllIngredientTests(): void {
  const ingredientLines = loadIngredientData();
  const results: TestResult[] = [];
  let successCount = 0;
  let failureCount = 0;

  console.log(`\n🧪 全食材データテスト開始: ${ingredientLines.length} 件`);
  console.log("=".repeat(60));

  for (let i = 0; i < ingredientLines.length; i++) {
    const line = ingredientLines[i];
    try {
      const parsed = Ingredient.parse(line).toJSON();

      // Basic validation - ingredient should be parsed without throwing
      // Note: originalText is trimmed in parseIngredientLine, so we compare with trimmed line
      assert.ok(
        parsed.originalText === line.trim(),
        `Original text mismatch for line: "${line}". Expected: "${line.trim()}", Got: "${
          parsed.originalText
        }"`
      );
      // Name should exist and be non-empty (after trimming)
      assert.ok(
        parsed.name != null && parsed.name.trim().length > 0,
        `Parsed name is empty for line: "${line}". Got name: "${parsed.name}"`
      );

      // Debug problematic lines
      if (line.includes("はんぺん") && !parsed.name.includes("はんぺん")) {
        console.log(`Debug problematic line: "${line}"`);
        console.log(`  Parsed name: "${parsed.name}"`);
        console.log(`  Full parsed:`, JSON.stringify(parsed, null, 2));
      }

      results.push({
        line,
        success: true,
        parsed,
      });
      successCount++;

      // Show progress every 100 items
      if ((i + 1) % 100 === 0) {
        console.log(
          `進捗: ${i + 1}/${ingredientLines.length} (${Math.round(
            ((i + 1) / ingredientLines.length) * 100
          )}%)`
        );
      }
    } catch (error) {
      results.push({
        line,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
      failureCount++;
      console.error(`❌ エラー (行 ${i + 1}): ${line}`);
      console.error(
        `   ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  console.log("\n📊 テスト結果サマリー:");
  console.log(
    `✅ 成功: ${successCount} / ${ingredientLines.length} (${Math.round(
      (successCount / ingredientLines.length) * 100
    )}%)`
  );
  console.log(
    `❌ 失敗: ${failureCount} / ${ingredientLines.length} (${Math.round(
      (failureCount / ingredientLines.length) * 100
    )}%)`
  );

  // Show some interesting parsed examples
  console.log("\n🔍 解析結果例 (最初の10件):");
  for (let i = 0; i < Math.min(10, results.length); i++) {
    const result = results[i];
    if (result.success && result.parsed) {
      const p = result.parsed;
      console.log(`${i + 1}. "${result.line}"`);
      console.log(
        `   名前: "${p.name}", 数量: ${p.quantity || "なし"}, 単位: ${
          p.unit || "なし"
        }`
      );
      if (p.notes) console.log(`   備考: ${p.notes}`);
    }
  }

  // Show failed examples if any
  if (failureCount > 0) {
    console.log("\n❌ 失敗例:");
    const failures = results.filter((r) => !r.success).slice(0, 10);
    failures.forEach((result, i) => {
      console.log(`${i + 1}. "${result.line}"`);
      console.log(`   エラー: ${result.error}`);
      // Also try to parse and show what we get
      try {
        const debugParsed = Ingredient.parse(result.line).toJSON();
        console.log(
          `   解析結果: name="${debugParsed.name}", quantity=${debugParsed.quantity}, unit=${debugParsed.unit}`
        );
      } catch (debugError) {
        console.log(
          `   解析中にエラー: ${
            debugError instanceof Error
              ? debugError.message
              : String(debugError)
          }`
        );
      }
    });
  }

  // Statistics about parsed data
  const successful = results.filter((r) => r.success);
  const withQuantity = successful.filter((r) => r.parsed?.quantity != null);
  const withUnit = successful.filter((r) => r.parsed?.unit != null);
  const scalable = successful.filter((r) => r.parsed?.scalable === true);

  console.log("\n📈 解析統計:");
  console.log(
    `数量が検出された食材: ${withQuantity.length} / ${
      successful.length
    } (${Math.round((withQuantity.length / successful.length) * 100)}%)`
  );
  console.log(
    `単位が検出された食材: ${withUnit.length} / ${
      successful.length
    } (${Math.round((withUnit.length / successful.length) * 100)}%)`
  );
  console.log(
    `スケール可能な食材: ${scalable.length} / ${
      successful.length
    } (${Math.round((scalable.length / successful.length) * 100)}%)`
  );

  // Unit distribution
  const unitCounts: Record<string, number> = {};
  withUnit.forEach((r) => {
    const unit = r.parsed?.unit || "unknown";
    unitCounts[unit] = (unitCounts[unit] || 0) + 1;
  });

  console.log("\n📏 単位分布 (上位10):");
  const sortedUnits = Object.entries(unitCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
  sortedUnits.forEach(([unit, count]) => {
    console.log(`  ${unit}: ${count}件`);
  });

  // Only fail if failure rate is above 5%
  const failureRate = (failureCount / ingredientLines.length) * 100;
  console.log(`\n失敗率: ${failureRate.toFixed(2)}%`);

  if (failureRate > 5) {
    throw new Error(
      `${failureCount} 件の食材解析に失敗しました (失敗率: ${failureRate.toFixed(
        2
      )}%)`
    );
  } else {
    console.log(`✅ 許容可能な失敗率です (${failureRate.toFixed(2)}% < 5%)`);
  }
}

// Basic regression tests (keep original tests)
console.log("🧪 基本回帰テスト実行中...");

{
  const ing = Ingredient.parse("豚ロース ３００ｇ").toJSON();
  console.log("Debug test 1:", JSON.stringify(ing, null, 2));
  assert.ok(
    ing.name.includes("豚ロース"),
    `Expected name to include "豚ロース", got: "${ing.name}"`
  );
  approxEqual(ing.quantity, 300);
  assert.equal(ing.unit, "g");
}

{
  const ing = Ingredient.parse("★生姜チューブ ４ｃｍ").toJSON();
  console.log("Debug test 2:", JSON.stringify(ing, null, 2));
  assert.ok(
    ing.name.includes("生姜チューブ"),
    `Expected name to include "生姜チューブ", got: "${ing.name}"`
  );
  approxEqual(ing.quantity, 4);
  assert.equal(ing.unit, "cm");
}

{
  const ing = Ingredient.parse("★砂糖 小１").toJSON();
  console.log("Debug test 3:", JSON.stringify(ing, null, 2));
  assert.equal(ing.unit, "tsp");
  approxEqual(ing.quantity, 1);
}

{
  const ing = Ingredient.parse("★酒 大１").toJSON();
  console.log("Debug test 4:", JSON.stringify(ing, null, 2));
  assert.equal(ing.unit, "tbsp");
  approxEqual(ing.quantity, 1);
}

{
  const ing = Ingredient.parse("小 1/2 塩").toJSON();
  console.log("Debug test 5:", JSON.stringify(ing, null, 2));
  assert.equal(ing.unit, "tsp");
  approxEqual(ing.quantity, 0.5);
}

{
  const ing = Ingredient.parse("大 1 しょうゆ").toJSON();
  console.log("Debug test 6:", JSON.stringify(ing, null, 2));
  assert.equal(ing.unit, "tbsp");
  approxEqual(ing.quantity, 1);
}

console.log("✓ 基本回帰テスト合格");

// Run quantity expression tests first
runQuantityExpressionTests();

// Run comprehensive tests on all ingredient data
runAllIngredientTests();

// Spot checks for display conversions
{
  // 小さじ3以上は大さじ表記
  const ing = Ingredient.parse("砂糖 小さじ3");
  const txt = ing.format();
  assert.equal(txt, "大さじ1");
}
{
  // 小さじ4 = 大さじ1と1/3（端数は自然表記）
  const ing = Ingredient.parse("酢 小さじ4");
  const txt = ing.format();
  assert.ok(txt.startsWith("大さじ"));
}
{
  // 大さじ1〜2 は「大さじ1〜2」表示（前後の単位省略）
  const rec = Recipe.fromJsonLd({
    name: "t",
    recipeIngredient: ["水 大さじ1〜2"],
    recipeInstructions: [""],
  }).toJSON();
  assert.equal(rec.ingredients[0].unit, "tbsp");
}
{
  // 大さじ4以上は ml 表記
  const ing = Ingredient.parse("水 大さじ4");
  const txt = ing.format();
  assert.equal(txt, "60 ml");
}

console.log("\n🎉 全テスト完了!");

// 新仕様: 括弧内の第2数量・単位の保持
{
  const ing = Ingredient.parse("トマト 1個(約150g)").toJSON();
  console.log("Debug new test トマト:", JSON.stringify(ing, null, 2));
  assert.equal(ing.unit, "piece");
  approxEqual(ing.quantity, 1);
  assert.equal(ing.secondaryUnit, "g");
  approxEqual(ing.secondaryQuantity, 150);
  assert.equal(ing.secondaryPrefix, "約");
}
{
  const ing = Ingredient.parse("えのき 1/2袋(約100g)").toJSON();
  console.log("Debug new test えのき:", JSON.stringify(ing, null, 2));
  assert.equal(ing.unit, "bag");
  approxEqual(ing.quantity, 0.5);
  assert.equal(ing.secondaryUnit, "g");
  approxEqual(ing.secondaryQuantity, 100);
  assert.equal(ing.secondaryPrefix, "約");
}
{
  const ing = Ingredient.parse("たまご 1/2こ(120gくらい)").toJSON();
  console.log("Debug new test たまご:", JSON.stringify(ing, null, 2));
  assert.equal(ing.unit, "piece");
  approxEqual(ing.quantity, 0.5);
  assert.equal(ing.secondaryUnit, "g");
  approxEqual(ing.secondaryQuantity, 120);
  assert.equal(ing.secondarySuffix, "くらい");
}
{
  const ing = Ingredient.parse("きゅうり 10cm長さ分（200g～250g）").toJSON();
  console.log("Debug new test きゅうり:", JSON.stringify(ing, null, 2));
  assert.equal(ing.unit, "cm");
  approxEqual(ing.quantity, 10);
  assert.equal(ing.secondaryUnit, "g");
  assert.ok(ing.secondaryQuantityRange);
  approxEqual(ing.secondaryQuantityRange?.min, 200);
  approxEqual(ing.secondaryQuantityRange?.max, 250);
  assert.equal(ing.suffix, "長さ分");
}

// Secondary scaling tests
{
  const ing = Ingredient.parse("トマト 1個(約150g)");
  const scaled = ing.scale(2).toJSON();
  approxEqual(scaled.quantity, 2);
  approxEqual(scaled.secondaryQuantity, 300);
}
{
  const ing = Ingredient.parse("えのき 1/2袋(約100g)");
  const scaled = ing.scale(3).toJSON();
  approxEqual(scaled.quantity, 1.5);
  approxEqual(scaled.secondaryQuantity, 300);
}
{
  const ing = Ingredient.parse("きゅうり 10cm長さ分（200g～250g）");
  const scaled = ing.scale(0.5).toJSON();
  approxEqual(scaled.quantity, 5);
  approxEqual(scaled.secondaryQuantityRange?.min, 100);
  approxEqual(scaled.secondaryQuantityRange?.max, 125);
}
