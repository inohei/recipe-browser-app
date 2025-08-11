import fs from "fs/promises";
import path from "path";
import puppeteer, { Page } from "puppeteer";

interface RecipeData {
  url: string;
  jsonLd: any;
  timestamp: string;
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

    console.log(`取得したレシピURL: ${recipeUrls.length}個`);
    recipeUrls.forEach((url, index) => {
      console.log(`${index + 1}. ${url}`);
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
  outputDir: string
): Promise<void> {
  try {
    // URLからレシピIDを抽出
    const recipeId = recipeData.url.match(/\/recipe\/(\d+)/)?.[1] || "unknown";
    const filename = `recipe_${recipeId}_${Date.now()}.json`;
    const filepath = path.join(outputDir, filename);

    await fs.writeFile(filepath, JSON.stringify(recipeData, null, 2), "utf-8");
    console.log(`レシピデータを保存しました: ${filepath}`);
  } catch (error) {
    console.error("レシピデータの保存に失敗:", error);
  }
}

async function main() {
  const categoryUrl = "https://cookpad.com/jp/categories/10";
  const outputDir = path.join(process.cwd(), "output", "cookpad-recipes");

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

    console.log("レシピURLを取得中...");
    const recipeUrls = await getRecipeUrls(page, categoryUrl);

    if (recipeUrls.length === 0) {
      console.log("レシピURLが見つかりませんでした");
      return;
    }

    console.log(`${recipeUrls.length}個のレシピURLを取得しました`);

    const results: RecipeData[] = [];

    for (const url of recipeUrls) {
      const recipeData = await fetchRecipeData(page, url);
      if (recipeData) {
        await saveRecipeData(recipeData, outputDir);
        results.push(recipeData);
      }

      // サーバーに負荷をかけないよう少し待機
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(`\n完了！ ${results.length}個のレシピデータを取得しました`);
    console.log(`保存先: ${outputDir}`);
  } catch (error) {
    console.error("エラーが発生しました:", error);
  } finally {
    await browser.close();
  }
}

// スクリプトを実行
main().catch(console.error);
