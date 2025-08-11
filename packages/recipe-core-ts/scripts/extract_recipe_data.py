#!/usr/bin/env python3
import glob
import json
import os
import re


def _is_recipe_type(value):
    """@type が Recipe（または name-spaced な Recipe）かを判定"""
    if isinstance(value, str):
        return re.search(r"(^|:)Recipe$", value, re.IGNORECASE) is not None
    if isinstance(value, list):
        return any(_is_recipe_type(v) for v in value)
    return False


def _iter_recipe_nodes(node):
    """
    任意の JSON-LD 構造の中から Recipe ノードを見つけて yield する。
    - ルート配列
    - @graph 配列
    - ネストしたオブジェクト/配列
    に再帰対応。
    """
    if node is None:
        return

    # ルートが配列
    if isinstance(node, list):
        for item in node:
            yield from _iter_recipe_nodes(item)
        return

    # オブジェクト
    if isinstance(node, dict):
        # @graph 対応
        if isinstance(node.get("@graph"), list):
            for item in node["@graph"]:
                yield from _iter_recipe_nodes(item)

        # 自身が Recipe か
        if _is_recipe_type(node.get("@type")):
            yield node

        # 値を再帰探索
        for v in node.values():
            if isinstance(v, (dict, list)):
                yield from _iter_recipe_nodes(v)


def _collect_from_recipe_node(node, recipe_yields, recipe_ingredients):
    """Recipe ノードから recipeYield / recipeIngredient(+ingredients) を収集"""
    # recipeYield
    ry = node.get("recipeYield")
    if isinstance(ry, list):
        for item in ry:
            if item:
                recipe_yields.append(str(item))
    elif ry:
        recipe_yields.append(str(ry))

    # recipeIngredient（互換：ingredients）
    ing = node.get("recipeIngredient")
    if ing is None:
        ing = node.get("ingredients")

    if isinstance(ing, list):
        for item in ing:
            if isinstance(item, str):
                recipe_ingredients.append(item)
            elif item is not None:
                # 文字列以外は文字列化して格納（サイト差異吸収）
                recipe_ingredients.append(json.dumps(item, ensure_ascii=False))
    elif isinstance(ing, str):
        recipe_ingredients.append(ing)
    elif ing is not None:
        recipe_ingredients.append(json.dumps(ing, ensure_ascii=False))


def extract_recipe_data():
    """
    Cookpadレシピの全JSONファイルからrecipeYieldとrecipeIngredientを抽出し、
    それぞれを別のテキストファイルに保存する
    """
    
    # JSONファイルのディレクトリパス
    cookpad_json_dir = "/Users/inohei/Google Drive Old/Local Files/recipe_browser/recipe_browser_app/packages/recipe-core-ts/output/cookpad-all-categories"
    site_jsonld_root = "/Users/inohei/Google Drive Old/Local Files/recipe_browser/recipe_browser_app/packages/recipe-core-ts/output/site-jsonld-check"
    
    # 出力ファイルのパス
    yield_output_file = "/Users/inohei/Google Drive Old/Local Files/recipe_browser/recipe_browser_app/packages/recipe-core-ts/output/recipeYield.txt"
    ingredient_output_file = "/Users/inohei/Google Drive Old/Local Files/recipe_browser/recipe_browser_app/packages/recipe-core-ts/output/recipeIngredient.txt"
    
    # 結果を保存するリスト
    recipe_yields = []
    recipe_ingredients = []
    
    # JSONファイルのパターンを作成
    cookpad_pattern = os.path.join(cookpad_json_dir, "*.json")
    cookpad_files = glob.glob(cookpad_pattern)

    site_pattern = os.path.join(site_jsonld_root, "**", "jsonld_*.json")
    site_files = glob.glob(site_pattern, recursive=True)

    print(f"処理対象のJSONファイル数: cookpad={len(cookpad_files)}, site-jsonld={len(site_files)}")

    # Cookpad 形式（{ jsonLd: {...} }）を処理
    for json_file in cookpad_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            # jsonLdオブジェクトから情報を抽出
            if 'jsonLd' in data:
                json_ld = data['jsonLd']
                
                # recipeYieldを抽出
                if 'recipeYield' in json_ld:
                    recipe_yield = json_ld['recipeYield']
                    if recipe_yield:  # 空でない場合のみ追加
                        recipe_yields.append(recipe_yield)
                
                # recipeIngredientを抽出
                if 'recipeIngredient' in json_ld:
                    ingredients = json_ld['recipeIngredient']
                    if isinstance(ingredients, list):
                        recipe_ingredients.extend(ingredients)
                    elif isinstance(ingredients, str):
                        recipe_ingredients.append(ingredients)
                        
        except Exception as e:
            print(f"エラー: {json_file} の処理中にエラーが発生しました: {e}")

    # site-jsonld-check 形式（JSON-LD の配列 or @graph を含む）を処理
    for json_file in site_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

            for recipe_node in _iter_recipe_nodes(data):
                _collect_from_recipe_node(recipe_node, recipe_yields, recipe_ingredients)
        except Exception as e:
            print(f"エラー: {json_file} の処理中にエラーが発生しました: {e}")
    
    # recipeYield.txtに書き出し
    with open(yield_output_file, 'w', encoding='utf-8') as f:
        for yield_item in recipe_yields:
            f.write(f"{yield_item}\n")
    
    # recipeIngredient.txtに書き出し
    with open(ingredient_output_file, 'w', encoding='utf-8') as f:
        for ingredient in recipe_ingredients:
            f.write(f"{ingredient}\n")
    
    print(f"\n抽出完了:")
    print(f"- recipeYield: {len(recipe_yields)}件 → {yield_output_file}")
    print(f"- recipeIngredient: {len(recipe_ingredients)}件 → {ingredient_output_file}")
    
    # 結果の一部を表示
    print(f"\nrecipeYieldの例:")
    for i, yield_item in enumerate(recipe_yields[:5]):
        print(f"  {i+1}: {yield_item}")
    
    print(f"\nrecipeIngredientの例:")
    for i, ingredient in enumerate(recipe_ingredients[:10]):
        print(f"  {i+1}: {ingredient}")

if __name__ == "__main__":
    extract_recipe_data()
