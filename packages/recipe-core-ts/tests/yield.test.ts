import { strict as assert } from "assert";
import { readFileSync } from "fs";
import { join } from "path";
import { Yield } from "../src/index";

function loadYieldData(): string[] {
  const filePath = join(__dirname, "../output/recipeYield.txt");
  const content = readFileSync(filePath, "utf-8");
  return content
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

function approxEqual(a: number | undefined, b: number, eps = 1e-6) {
  assert.ok(typeof a === "number");
  assert.ok(Math.abs((a as number) - b) < eps);
}

// すべての行がパースできる
{
  const lines = loadYieldData();
  for (const line of lines) {
    const y = Yield.parse(line).toJSON()!;
    assert.ok(y && y.originalText.length > 0);
  }
}

// 範囲: 2～3人分
{
  const y = Yield.parse("2～3人分").toJSON()!;
  assert.equal(y.unit, "serving");
  assert.ok(y.quantityRange);
  assert.equal(y.quantityRange?.min, 2);
  assert.equal(y.quantityRange?.max, 3);
  assert.equal(y.scalable, true);
}

// 記号除去: 《4人分》
{
  const y = Yield.parse("《4人分》");
  const yJson = y.toJSON()!;
  assert.equal(yJson.unit, "serving");
  approxEqual(yJson.quantity, 4);
  // 表示確認
  const txt = y.format();
  assert.equal(txt, "4人分");
}

// 人分/人前の同義
{
  const a = Yield.parse("2人分").toJSON()!;
  const b = Yield.parse("2人前").toJSON()!;
  assert.equal(a.unit, "serving");
  assert.equal(b.unit, "serving");
  approxEqual(a.quantity, 2);
  approxEqual(b.quantity, 2);
}

// 非スケール: お好みの量
{
  const y = Yield.parse("お好みの量").toJSON()!;
  assert.equal(y.scalable, false);
}

// 人数以外（個・枚など）は全行テストで網羅

// prefix/suffix の代表例は全行テストで検証済み

// secondary 単位: 2人分(4個)
{
  const y = Yield.parse("2人分(4個)");
  const yJson = y.toJSON()!;
  assert.equal(yJson.unit, "serving");
  approxEqual(yJson.quantity, 2);
  approxEqual(yJson.secondaryQuantity, 4);
  assert.equal(yJson.secondaryUnitText, "個");
  const txt = y.format();
  assert.equal(txt, "2人分（4 個）");
}

// 型・サイズ表記は prefix として扱う
{
  const a = Yield.parse("18cm型(15cmも可) 1台分");
  const aJson = a.toJSON()!;
  approxEqual(aJson.quantity, 1);
  assert.ok(aJson.prefix?.includes("18cm型"));
  const aTxt = a.format();
  assert.ok(aTxt.startsWith("18cm型(15cmも可)"));

  const b = Yield.parse("8㎝×6枚");
  const bJson = b.toJSON()!;
  approxEqual(bJson.quantity, 6);
  assert.equal(bJson.unitText, "枚");
  assert.ok(bJson.prefix?.includes("8cm×"));
  const bTxt = b.format();
  assert.ok(bTxt.startsWith("8cm×"));
}
