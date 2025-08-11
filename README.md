# Recipe Browser App

レシピブラウザアプリ - 様々な料理サイトからレシピ情報を抽出・表示するFlutterアプリケーション

## 概要

このプロジェクトは、料理サイトからレシピ情報を自動的に抽出し、統一された形式で表示するモバイルアプリケーションです。Flutterで構築されたUIと、TypeScriptで書かれたレシピ解析エンジンを組み合わせています。

## 機能

- **レシピ情報の自動抽出**: 様々な料理サイトからレシピの材料、手順、調理時間などを自動的に抽出
- **統一された表示**: 異なるサイトのレシピを統一された形式で表示
- **ブックマーク機能**: お気に入りのレシピを保存
- **履歴機能**: 閲覧したレシピの履歴を管理
- **クロスプラットフォーム**: iOSとAndroidの両方で動作

## 技術スタック

### フロントエンド
- **Flutter**: モバイルアプリケーション
- **Dart**: プログラミング言語

### バックエンド/解析エンジン
- **TypeScript**: レシピ解析エンジン
- **React**: ブラウザ拡張機能
- **Zod**: データ検証

## プロジェクト構造

```
recipe_browser_app/
├── lib/                    # Flutterアプリケーション
│   ├── main.dart          # エントリーポイント
│   ├── models/            # データモデル
│   ├── state/             # 状態管理
│   └── ui/                # UIコンポーネント
├── packages/
│   └── recipe-core-ts/    # TypeScriptレシピ解析エンジン
│       ├── src/           # ソースコード
│       ├── extension/     # ブラウザ拡張機能
│       └── tests/         # テスト
├── android/               # Android設定
├── ios/                   # iOS設定
└── assets/                # 静的ファイル
```

## セットアップ

### 前提条件
- Flutter SDK
- Node.js
- Git

### インストール手順

1. リポジトリをクローン
```bash
git clone https://github.com/inohei/recipe-browser-app.git
cd recipe-browser-app
```

2. Flutter依存関係をインストール
```bash
flutter pub get
```

3. TypeScript依存関係をインストール
```bash
cd packages/recipe-core-ts
npm install
```

4. アプリケーションを実行
```bash
flutter run
```

## 開発

### Flutterアプリの開発
```bash
# ホットリロードで開発
flutter run

# ビルド
flutter build apk  # Android
flutter build ios  # iOS
```

### TypeScriptエンジンの開発
```bash
cd packages/recipe-core-ts

# 開発サーバー起動
npm run dev

# テスト実行
npm test

# ビルド
npm run build
```

## 対応サイト

現在以下のサイトのレシピ抽出に対応しています：
- Cookpad
- 楽天レシピ
- クックパッド
- その他多数の料理サイト

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 貢献

プルリクエストやイシューの報告を歓迎します。貢献する前に、まずイシューを作成して変更内容を議論してください。

## 作者

inohei
