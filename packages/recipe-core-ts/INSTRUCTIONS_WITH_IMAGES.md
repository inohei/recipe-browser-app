# レシピ手順の画像機能実装

## 概要

JSON-LDレシピデータからレシピ手順の画像を取得し、UIで表示する機能を実装しました。

## 実装内容

### 1. データ構造の拡張

#### `NormalizedInstruction`型の追加
```typescript
export type NormalizedInstruction = {
  text: string;
  imageUrl?: string;
  name?: string;
  url?: string;
};
```

#### `NormalizedRecipe`型の更新
```typescript
export type NormalizedRecipe = {
  // ... 既存フィールド
  instructions: NormalizedInstruction[]; // string[]から変更
};
```

### 2. パース機能の拡張

#### `normalizeInstructions`関数の更新
- JSONの`recipeInstructions`配列から画像URLを抽出
- `HowToStep`オブジェクトの`image`フィールドを処理
- 文字列形式の手順も引き続きサポート

#### 対応するJSON形式
```json
{
  "recipeInstructions": [
    {
      "@type": "HowToStep",
      "name": "手順名",
      "text": "手順の説明",
      "url": "手順のURL",
      "image": "画像のURL"
    }
  ]
}
```

### 3. UIコンポーネントの更新

#### `RecipeSidebarApp.tsx`の変更
- 手順表示部分で画像を表示
- 画像がない場合はテキストのみ表示
- レスポンシブデザイン対応

#### 新しいUI構造
```jsx
<ol class="rb-steps">
  {displayedRecipe.instructions.map((step, index) => (
    <li>
      <div class="rb-step-content">
        <div class="rb-step-text">{step.text}</div>
        {step.imageUrl && (
          <div class="rb-step-image">
            <img src={step.imageUrl} alt={`手順${index + 1}`} />
          </div>
        )}
      </div>
    </li>
  ))}
</ol>
```

### 4. CSSスタイルの追加

#### 新しいスタイル
- `.rb-step-content`: 手順コンテンツのレイアウト
- `.rb-step-text`: 手順テキストのスタイル
- `.rb-step-image`: 画像コンテナのスタイル
- 画像のホバーエフェクトとレスポンシブ対応

## 使用方法

### 1. JSON-LDデータの準備
レシピのJSON-LDデータに手順の画像URLを含めます：

```json
{
  "@type": "Recipe",
  "recipeInstructions": [
    {
      "@type": "HowToStep",
      "text": "材料を混ぜる",
      "image": "https://example.com/step1.jpg"
    }
  ]
}
```

### 2. アプリケーションでの使用
```typescript
import { Recipe } from '@recipe-browser/recipe-core-ts';

const recipe = Recipe.fromJsonLd(jsonData);
recipe.instructions.forEach(instruction => {
  console.log('テキスト:', instruction.text);
  console.log('画像URL:', instruction.imageUrl);
});
```

## 互換性

- 既存の文字列形式の手順データは引き続きサポート
- 画像がない手順は従来通りテキストのみ表示
- 後方互換性を維持

## 技術仕様

- TypeScript対応
- JSON-LD Schema.org形式準拠
- レスポンシブデザイン対応
- アクセシビリティ対応（alt属性付き）

## ファイル変更一覧

1. `src/core.ts` - 型定義の追加
2. `src/parse.ts` - パース機能の拡張
3. `src/domain.ts` - Instructionクラスの追加
4. `src/index.ts` - エクスポートの更新
5. `src/ui/RecipeSidebarApp.tsx` - UIコンポーネントの更新
6. `src/ui/styles.ts` - CSSスタイルの追加

## テスト

実装の動作確認用テストファイル：
- `test_instructions_with_images.js` - 基本テスト
- `test_parse_instructions.js` - パース機能テスト
- `simple_test.js` - 簡単な動作確認
