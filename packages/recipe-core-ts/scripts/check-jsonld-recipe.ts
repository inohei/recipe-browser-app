import fs from "fs/promises";
import path from "path";
import puppeteer, { Page } from "puppeteer";

type JsonLike = Record<string, unknown> | Record<string, unknown>[];

interface CheckResult {
  url: string;
  hasRecipeJsonLd: boolean;
  matches: number;
  savedHtmlPath?: string;
  savedJsonLdPath?: string;
  error?: string;
  timestamp: string;
}

const OUTPUT_ROOT = path.join(process.cwd(), "output", "site-jsonld-check");

const URLS: string[] = [
  "https://recipe.rakuten.co.jp/recipe/1050010236/",
  "https://park.ajinomoto.co.jp/recipe/card/707350/",
  "https://www.lettuceclub.net/recipe/dish/23384/",
  "https://www.orangepage.net/recipes/114473",
  "https://macaro-ni.jp/47507",
  "https://www.kyounoryouri.jp/recipe/20966_%E8%B1%9A%E3%81%AE%E3%81%97%E3%82%87%E3%81%86%E3%81%8C%E7%84%BC%E3%81%8D.html",
  "https://www.recipe-blog.jp/profile/161304/recipe/985044",
  "https://cal.bob-an.com/jge/2021/08aug/70005.html",
  "https://recipe.yamasa.com/recipes/3213",
  "https://www.mizkan.co.jp/ouchirecipe/recipe/?menu_id=5139",
  "https://www.kagome.co.jp/products/recipe/12856/",
  "https://www.sbfoods.co.jp/recipe/detail/01915.html",
  "https://with.glico.com/recipeclub/report.html?number=48725",
  "https://www.marukome.co.jp/recipe/misosoup/recipe/easy/",
  "https://www.yamaki.co.jp/recipe/%E6%9C%88%E8%A6%8B%E3%81%86%E3%81%A9%E3%82%93",
  "https://www.nisshin-oillio.com/recipe/detail.html?id=7403",
  "https://www.oisix.com/shop.g6–shopping–recipe__html.htm?id=se-0075",
  "https://www.tastemade.jp/content/videos/v8zx05edg32ykw9rp1mnq7o4/",
  "https://dancyu.jp/recipe/2024_00008824.html",
  "https://erecipe.woman.excite.co.jp/detail/0831e9b9560db342e51f122c55b02a9e.html",
  "https://delishkitchen.tv/recipes/197328869693326368",
  "https://cookpad.com/jp/recipes/18090858",
  "https://www.nichireifoods.co.jp/recipe/detail/recipe_id40862/",
  "https://housefoods.jp/recipe/rcp_00016990.html",
  "https://www.sirogohan.com/recipe/shougayaki/",
  "https://mi-journey.jp/foodie/69341/",
  "https://oceans-nadia.com/user/253470/recipe/439451",
  "https://www.nipponham.co.jp/recipes/genre/japanese/23001/",
  "https://www.kurashiru.com/recipes/6c351dfe-0252-4506-bafa-1e03169052d2",
  "https://www.kikkoman.co.jp/homecook/search/recipe/00004693/",
  "https://www.nippn.co.jp/recipe/other/other/detail/1220535_1958.html",
  "https://daidokolog.pal-system.co.jp/recipe/2338",
  "https://www.kewpie.co.jp/recipes/basicokazu/okazu07/",
  "https://www.yutori.co.jp/shop/rp/rp160777/",
  "https://a-aji.jp/kitchen/76/",
];

function sanitizeForFilename(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9-_\.]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 120);
}

function getBaseDirForUrl(url: string): string {
  const urlObj = new URL(url);
  const slug = sanitizeForFilename(
    `${urlObj.hostname}${urlObj.pathname}${urlObj.search}`
  );
  return path.join(OUTPUT_ROOT, slug);
}

async function isAlreadyFetched(url: string): Promise<boolean> {
  const baseDir = getBaseDirForUrl(url);
  try {
    const files = await fs.readdir(baseDir);
    // いずれかの成果物が存在すれば取得済みとみなす
    return files.some((f) => f.startsWith("page_") || f.startsWith("jsonld_"));
  } catch {
    // ディレクトリが無い等 → 未取得
    return false;
  }
}

async function extractJsonLd(page: Page): Promise<JsonLike[]> {
  const blocks = await page.evaluate(() => {
    const scripts = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]')
    );
    const results: any[] = [];
    for (const script of scripts) {
      const text = script.textContent || "";
      try {
        const parsed = JSON.parse(text);
        results.push(parsed);
      } catch (err) {
        // 一部のサイトは複数JSONを連結している場合があるため、緩和パース
        const candidates = text
          .split(/\n\s*(?=\{)/)
          .map((t) => t.trim())
          .filter(Boolean);
        for (const c of candidates) {
          try {
            results.push(JSON.parse(c));
          } catch {
            /* noop */
          }
        }
      }
    }
    return results;
  });
  return blocks as JsonLike[];
}

function isRecipeType(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;

  const types: string[] = [];
  const rawType = obj["@type"] as unknown;
  if (typeof rawType === "string") types.push(rawType);
  if (Array.isArray(rawType)) {
    for (const t of rawType) if (typeof t === "string") types.push(t);
  }

  // @graph対応
  const graph = obj["@graph"] as unknown;
  if (Array.isArray(graph)) {
    for (const node of graph) if (isRecipeType(node)) return true;
  }

  return types.some((t) => /(^|:)Recipe$/i.test(t));
}

function countRecipeMatches(block: JsonLike): number {
  let count = 0;
  const pushIfRecipe = (node: any) => {
    if (isRecipeType(node)) count += 1;
  };

  const visit = (node: any) => {
    if (!node) return;
    pushIfRecipe(node);
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    if (typeof node === "object") {
      for (const v of Object.values(node as Record<string, unknown>)) {
        if (v && typeof v === "object") visit(v);
      }
    }
  };

  visit(block);
  return count;
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function savePageArtifacts(
  url: string,
  html: string,
  jsonLdBlocks: JsonLike[]
): Promise<{ htmlPath: string; jsonPath?: string; baseDir: string }> {
  const urlObj = new URL(url);
  const slug = sanitizeForFilename(
    `${urlObj.hostname}${urlObj.pathname}${urlObj.search}`
  );
  const baseDir = path.join(OUTPUT_ROOT, slug);
  await ensureDir(baseDir);

  const timestamp = Date.now();
  const htmlPath = path.join(baseDir, `page_${timestamp}.html`);
  await fs.writeFile(htmlPath, html, "utf-8");

  let jsonPath: string | undefined;
  if (jsonLdBlocks.length > 0) {
    jsonPath = path.join(baseDir, `jsonld_${timestamp}.json`);
    await fs.writeFile(
      jsonPath,
      JSON.stringify(jsonLdBlocks, null, 2),
      "utf-8"
    );
  }

  return { htmlPath, jsonPath, baseDir };
}

async function checkOne(page: Page, url: string): Promise<CheckResult> {
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    // レンダリング待ち
    await new Promise((r) => setTimeout(r, 2000));

    const html = await page.content();
    const jsonLdBlocks = await extractJsonLd(page);
    const matchCounts = jsonLdBlocks.map((b) => countRecipeMatches(b));
    const matches = matchCounts.reduce((a, b) => a + b, 0);

    const saved = await savePageArtifacts(url, html, jsonLdBlocks);

    return {
      url,
      hasRecipeJsonLd: matches > 0,
      matches,
      savedHtmlPath: path.relative(process.cwd(), saved.htmlPath),
      savedJsonLdPath: saved.jsonPath
        ? path.relative(process.cwd(), saved.jsonPath)
        : undefined,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    return {
      url,
      hasRecipeJsonLd: false,
      matches: 0,
      error: String(error?.message || error),
      timestamp: new Date().toISOString(),
    };
  }
}

async function main() {
  await ensureDir(OUTPUT_ROOT);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({
      "Accept-Language": "ja-JP,ja;q=0.9,en;q=0.8",
    });

    // 既に取得済みのURLはスキップ
    const targets: string[] = [];
    for (const url of URLS) {
      if (await isAlreadyFetched(url)) {
        console.log(`[SKIP] ${url} -> already fetched`);
      } else {
        targets.push(url);
      }
    }

    const results: CheckResult[] = [];
    for (const url of targets) {
      console.log(`\n[CHECK] ${url}`);
      const r = await checkOne(page, url);
      console.log(
        r.error
          ? `  -> Error: ${r.error}`
          : `  -> hasRecipeJsonLd=${r.hasRecipeJsonLd} (matches=${r.matches})`
      );
      if (r.savedHtmlPath) console.log(`  -> HTML: ${r.savedHtmlPath}`);
      if (r.savedJsonLdPath) console.log(`  -> JSON-LD: ${r.savedJsonLdPath}`);
      results.push(r);
      // サイト負荷軽減
      await new Promise((r) => setTimeout(r, 1000));
    }

    const summaryPath = path.join(OUTPUT_ROOT, `results_${Date.now()}.json`);
    await fs.writeFile(summaryPath, JSON.stringify(results, null, 2), "utf-8");
    console.log(
      `\nSummary saved: ${path.relative(process.cwd(), summaryPath)}`
    );

    // 簡易CSV出力
    const csvLines = [
      [
        "url",
        "hasRecipeJsonLd",
        "matches",
        "savedHtmlPath",
        "savedJsonLdPath",
        "error",
      ].join(","),
      ...results.map((r) =>
        [
          r.url,
          String(r.hasRecipeJsonLd),
          String(r.matches),
          r.savedHtmlPath || "",
          r.savedJsonLdPath || "",
          (r.error || "").replace(/[,\n\r]/g, " "),
        ].join(",")
      ),
    ].join("\n");
    const csvPath = path.join(OUTPUT_ROOT, `results_${Date.now()}.csv`);
    await fs.writeFile(csvPath, csvLines, "utf-8");
    console.log(`CSV saved: ${path.relative(process.cwd(), csvPath)}`);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
