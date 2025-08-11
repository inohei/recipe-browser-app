import fs from "fs/promises";
import path from "path";
import puppeteer, { Page } from "puppeteer";

interface RecipeData {
  url: string;
  jsonLd: any;
  timestamp: string;
}

interface CategoryInfo {
  name: string;
  url: string;
  count: string;
}

async function extractJsonLd(page: Page): Promise<any | null> {
  try {
    const jsonLdScripts = await page.evaluate(() => {
      const scripts = document.querySelectorAll(
        'script[type="application/ld+json"]'
      );
      const results: any[] = [];

      scripts.forEach((script) => {
        try {
          const content = script.textContent;
          if (content) {
            const parsed = JSON.parse(content);
            // Schema.org/Recipeのデータを探す
            if (
              parsed["@type"] === "Recipe" ||
              (Array.isArray(parsed) &&
                parsed.some((item) => item["@type"] === "Recipe"))
            ) {
              results.push(parsed);
            }
          }
        } catch (e) {
          console.warn("JSON-LDの解析に失敗:", e);
        }
      });

      return results;
    });

    return jsonLdScripts.length > 0 ? jsonLdScripts[0] : null;
  } catch (error) {
    console.error("JSON-LDの抽出に失敗:", error);
    return null;
  }
}

async function getCategories(page: Page): Promise<CategoryInfo[]> {
  try {
    await page.goto("https://cookpad.com/jp/categories", {
      waitUntil: "networkidle2",
    });

    // ページが完全に読み込まれるまで少し待機
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const categories = await page.evaluate(() => {
      const categoryItems = document.querySelectorAll("li");
      const categories: CategoryInfo[] = [];

      categoryItems.forEach((item) => {
        const link = item.querySelector('a[href*="/categories/"]');

        if (link) {
          const href = link.getAttribute("href");
          const name = link.textContent?.trim();

          // 品数を取得するために、li要素内のテキストノードを探す
          let count = "";
          const walker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT);

          const textNodes = [];
          let node;
          while ((node = walker.nextNode())) {
            const text = node.textContent?.trim();
            if (text && text.match(/\d+品$/)) {
              count = text;
              break;
            }
          }

          if (href && href.includes("/categories/") && name && count) {
            categories.push({
              name: name,
              url: href.startsWith("http")
                ? href
                : `https://cookpad.com${href}`,
              count: count,
            });
          }
        }
      });

      return categories;
    });

    console.log(`取得したカテゴリ数: ${categories.length}`);
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (${cat.count}) - ${cat.url}`);
    });

    return categories;
  } catch (error) {
    console.error("カテゴリの取得に失敗:", error);
    return [];
  }
}

async function getRecipeUrls(
  page: Page,
  categoryUrl: string
): Promise<string[]> {
  try {
    await page.goto(categoryUrl, { waitUntil: "networkidle2" });

    // ページが完全に読み込まれるまで少し待機
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // レシピリンクを取得
    const recipeUrls = await page.evaluate(() => {
      const links = document.querySelectorAll('a[href*="/recipes/"]');
      const urls: string[] = [];

      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (
          href &&
          href.includes("/recipes/") &&
          !href.includes("/recipes/new")
        ) {
          const fullUrl = href.startsWith("http")
            ? href
            : `https://cookpad.com${href}`;
          urls.push(fullUrl);
        }
      });

      // 重複を除去して最初の10個を返す
      return [...new Set(urls)].slice(0, 10);
    });

    return recipeUrls;
  } catch (error) {
    console.error("レシピURLの取得に失敗:", error);
    return [];
  }
}

async function fetchRecipeData(
  page: Page,
  url: string
): Promise<RecipeData | null> {
  try {
    console.log(`レシピデータを取得中: ${url}`);

    await page.goto(url, { waitUntil: "networkidle2" });

    // ページが完全に読み込まれるまで少し待機
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const jsonLd = await extractJsonLd(page);

    if (!jsonLd) {
      console.warn(`JSON-LDデータが見つかりません: ${url}`);
      return null;
    }

    return {
      url,
      jsonLd,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`レシピデータの取得に失敗: ${url}`, error);
    return null;
  }
}

async function saveRecipeData(
  recipeData: RecipeData,
  outputDir: string,
  categoryName: string
): Promise<void> {
  try {
    // URLからレシピIDを抽出
    const recipeId = recipeData.url.match(/\/recipes\/(\d+)/)?.[1] || "unknown";
    const safeCategoryName = categoryName.replace(
      /[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF]/g,
      "_"
    );
    const filename = `${safeCategoryName}_recipe_${recipeId}_${Date.now()}.json`;
    const filepath = path.join(outputDir, filename);

    await fs.writeFile(filepath, JSON.stringify(recipeData, null, 2), "utf-8");
    console.log(`レシピデータを保存しました: ${filepath}`);
  } catch (error) {
    console.error("レシピデータの保存に失敗:", error);
  }
}

async function processCategory(
  page: Page,
  category: CategoryInfo,
  outputDir: string
): Promise<number> {
  console.log(`\n=== ${category.name} (${category.count}) を処理中 ===`);

  try {
    const recipeUrls = await getRecipeUrls(page, category.url);

    if (recipeUrls.length === 0) {
      console.log(`${category.name}: レシピURLが見つかりませんでした`);
      return 0;
    }

    console.log(
      `${category.name}: ${recipeUrls.length}個のレシピURLを取得しました`
    );

    let successCount = 0;
    for (const url of recipeUrls) {
      const recipeData = await fetchRecipeData(page, url);
      if (recipeData) {
        await saveRecipeData(recipeData, outputDir, category.name);
        successCount++;
      }

      // サーバーに負荷をかけないよう少し待機
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(
      `${category.name}: ${successCount}個のレシピデータを保存しました`
    );
    return successCount;
  } catch (error) {
    console.error(`${category.name}の処理中にエラーが発生:`, error);
    return 0;
  }
}

async function main() {
  const outputDir = path.join(
    process.cwd(),
    "output",
    "cookpad-all-categories"
  );

  // 出力ディレクトリを作成
  await fs.mkdir(outputDir, { recursive: true });

  console.log("ブラウザを起動中...");
  const browser = await puppeteer.launch({
    headless: false, // デバッグ用にブラウザを表示
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // ユーザーエージェントを設定
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    console.log("カテゴリ一覧を取得中...");
    const categories = await getCategories(page);

    if (categories.length === 0) {
      console.log("カテゴリが見つかりませんでした");
      return;
    }

    console.log(`\n${categories.length}個のカテゴリを処理します`);

    const results: { category: string; count: number }[] = [];
    let totalRecipes = 0;

    for (const category of categories) {
      const count = await processCategory(page, category, outputDir);
      results.push({ category: category.name, count });
      totalRecipes += count;

      // カテゴリ間の待機時間
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log(`\n=== 処理完了 ===`);
    console.log(`総取得レシピ数: ${totalRecipes}個`);
    console.log(`保存先: ${outputDir}`);

    console.log("\n=== カテゴリ別結果 ===");
    results.forEach((result) => {
      console.log(`${result.category}: ${result.count}個`);
    });
  } catch (error) {
    console.error("エラーが発生しました:", error);
  } finally {
    await browser.close();
  }
}

// スクリプトを実行
main().catch(console.error);
