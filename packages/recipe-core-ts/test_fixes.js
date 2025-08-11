const { parseIngredientLine } = require('./dist/parse.js');
const { formatIngredientQuantities } = require('./dist/format.js');

console.log('=== 修正確認テスト ===\n');

function testIngredient(text) {
  const parsed = parseIngredientLine(text);
  const formatted = formatIngredientQuantities(parsed);
  return { parsed, formatted };
}

// 1. 大1個 → 大さじ1個 の問題
console.log('1. 大1個の解析:');
const test1 = testIngredient('タマネギ 大1個');
console.log('  結果:', test1.formatted);
console.log('  単位:', test1.parsed.unit, '(期待: piece)');
console.log('');

// 2. ひとつまみが1と表示される問題
console.log('2. ひとつまみの表示:');
const test2 = testIngredient('塩 ひとつまみ');
console.log('  結果:', test2.formatted);
console.log('');

// 3. 280㎖の㎖が表示されていない
console.log('3. 280㎖の正規化:');
const test3 = testIngredient('牛乳 280㎖');
console.log('  結果:', test3.formatted);
console.log('  単位:', test3.parsed.unit, test3.parsed.unitText);
console.log('');

// 4. 適量などのunscalableの文字が表示されていない
console.log('4. 適量の表示:');
const test4 = testIngredient('塩 適量');
console.log('  結果:', test4.formatted);
console.log('');

// 5. 〜お好みでがsuffixに
console.log('5. 〜お好みでのsuffix:');
const test5 = testIngredient('砂糖 100g〜お好みで');
console.log('  結果:', test5.formatted);
console.log('  suffix:', test5.parsed.suffix);
console.log('');

// 6. 1/4個（60g)でsecondaryが表示されていない
console.log('6. 括弧内secondary表示:');
const test6 = testIngredient('タマネギ 1/4個（60g）');
console.log('  結果:', test6.formatted);
console.log('');

// 7. 180〜200g(卵の大きさによって調節する)のsuffix
console.log('7. 括弧内コメントのsuffix:');
const test7 = testIngredient('卵 180〜200g(卵の大きさによって調節する)');
console.log('  結果:', test7.formatted);
console.log('');

// 8. 1と1/2の小数表示
console.log('8. 1と1/2の小数表示:');
const test8 = testIngredient('小麦粉 1と1/2カップ');
console.log('  結果:', test8.formatted);
console.log('');

// 9. 10以上の数の小数点以下切り捨て
console.log('9. 10以上の小数点切り捨て:');
const test9 = testIngredient('水 12.7ml');
console.log('  結果:', test9.formatted);
console.log('');
