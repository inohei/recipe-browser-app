// 共通のスタイル定義
export const SHARED_STYLES = {
  // 基本的なコンテナスタイル
  CONTAINER_BASE: `
    font-family: ui-sans-serif, -apple-system, 'Segoe UI', Roboto, 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif;
    line-height: 1.6;
    color: #333;
    background: #fff;
    box-sizing: border-box;
  `,

  // 基本的なiframe内で使用する通常のスタイル
  IFRAME_BASE: `
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  `,

  // RecipeSidebarAppの共通スタイル
  RECIPE_APP_STYLES: `
    .rb-body { 
      flex: 1; 
      overflow: visible; 
      color: #111; 
      background: #fff;
      box-sizing: border-box;
      display: block;
      font-family: ui-sans-serif, -apple-system, 'Segoe UI', Roboto, 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif;
    }
    
    .rb-header {
      display: flex;
      justify-content: flex-end;
      padding: 8px 12px;
      background: #fff;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .rb-close-button {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 50%;
      background: #f8f9fa;
      color: #666;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      font-family: inherit;
      line-height: 1;
    }
    
    .rb-close-button:hover {
      background: #e9ecef;
      color: #333;
      transform: scale(1.1);
    }
    
    .rb-header-image {
      position: fixed;
      width: 100%;
      height: 200px;
      overflow: hidden;
      margin: 0;
      padding: 0;
    }
    
    .rb-header-image .rb-image { 
      width: 100%; 
      height: 100%;
      object-fit: cover; 
      display: block;
      margin: 0;
      padding: 0;
    }
    
    .rb-title-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 15px;
      display: flex;
      align-items: flex-end;
    }
    
    .rb-title-overlay .rb-name {
      font-size: 20px; 
      font-weight: 800; 
      color: #fff;
      line-height: 1.2;
      margin: 0;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
      font-family: inherit;
      letter-spacing: 0.5px;
    }
    
    .rb-body > .rb-name { 
      font-size: 24px; 
      font-weight: 600; 
      margin: 20px 20px 16px 20px; 
      color: #333;
      line-height: 1.3;
      display: block;
      font-family: inherit;
    }
    
    .rb-section-header {
      position: sticky;
      top: 100px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 20px 8px 20px;
      flex-wrap: nowrap;
      gap: 12px;
      min-height: 32px;
    }
    
    .rb-body .rb-section-title { 
      font-weight: 700; 
      margin: 0; 
      color: #333;
      font-size: 18px;
      display: block;
      font-family: inherit;
      flex-shrink: 0;
    }
    
    .rb-body .rb-yield { 
      margin: 0; 
      color: #333; 
      display: flex; 
      align-items: center; 
      gap: 8px; 
      font-family: inherit;
      font-size: 14px;
      flex-shrink: 0;
      white-space: nowrap;
    }
    
    .rb-body .rb-yield .rb-yield-inline { 
      display: inline-flex; 
      align-items: center; 
      gap: 8px; 
    }
    
    .rb-body .rb-yield .rb-yield-display {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    
    .rb-body .rb-yield .rb-btn { 
      width: 28px; 
      height: 28px; 
      border: 1px solid #ddd; 
      border-radius: 4px; 
      background: #fff; 
      cursor: pointer; 
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: #333;
      font-family: inherit;
      box-sizing: border-box;
      transition: all 0.2s ease;
    }
    
    .rb-body .rb-yield .rb-btn-round {
      border-radius: 50%;
      font-weight: 600;
    }
    
    .rb-body .rb-yield .rb-btn:hover {
      background: #f8f9fa;
      transform: scale(1.05);
    }
    
    .rb-body .rb-yield .rb-num { 
      width: 36px;
      max-width: 36px;
      text-align: center; 
      height: 24px; 
      border: none;
      border-radius: 0;
      background: transparent;
      color: #333;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
      display: inline-block;
      padding: 2px 4px;
      line-height: 1.2;
      font-weight: 500;
    }
    .rb-body .rb-list { 
      list-style: none; 
      padding: 0 20px; 
      margin: 0 0 12px 0; 
      display: block;
    }
    .rb-body .rb-list li { 
      display: flex; 
      justify-content: space-between; 
      gap: 8px; 
      padding: 8px 0; 
      border-bottom: 1px solid #f0f0f0;
      color: #333;
      font-family: inherit;
      box-sizing: border-box;
    }
    .rb-body .rb-list .rb-qty { 
      color: #666; 
      font-weight: 500;
      font-family: inherit;
    }
    .rb-body .rb-steps { 
      padding-left: 40px; 
      margin: 0 20px 20px 20px;
      color: #333;
      display: block;
      font-family: inherit;
      list-style-type: decimal;
      counter-reset: recipe-step;
    }
    .rb-body .rb-steps li { 
      margin: 8px 0; 
      color: #333;
      line-height: 1.6;
      display: list-item;
      font-family: inherit;
      list-style-type: decimal;
      padding-left: 8px;
    }
  `,
};

// Shadow DOM用サイドバーコンテナスタイル
export function getShadowDOMContainerStyles(): string {
  return `
    :host {
      ${SHARED_STYLES.CONTAINER_BASE}
      height: 100vh;
      display: block;
      overflow: visible;
      position: relative;
      /* ページ全体のスクロールを有効化 */
      touch-action: pan-y;
      overscroll-behavior: auto;
    }
    
    #recipe-sidebar-root {
      height: 100vh;
      overflow: visible;
      display: block;
      margin: 0;
      padding: 0;
      ${SHARED_STYLES.CONTAINER_BASE}
      /* ページ全体のスクロールを有効化 */
      touch-action: pan-y;
      overscroll-behavior: auto;
    }
    
    /* shadowDOM内では親ページのスクロールに追従 */
    .rb-body { 
      flex: none; 
      overflow: visible; 
      color: #111; 
      background: #fff;
      box-sizing: border-box;
      display: block;
      font-family: ui-sans-serif, -apple-system, 'Segoe UI', Roboto, 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif;
      height: auto;
      min-height: 100vh;
      /* ページ全体のスクロールを有効化 */
      touch-action: pan-y;
      overscroll-behavior: auto;
    }
    
    /* shadowDOM内でもスティッキーヘッダーが動作するようにする */
    .rb-section-header {
      position: sticky;
      top: 0;
      background: #fff;
      z-index: 5;
      margin: 20px 20px 8px 20px;
      padding: 16px 0 12px 0;
      border-bottom: 1px solid #f0f0f0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    
    .rb-instructions-header {
      position: sticky;
      top: 0;
      background: #fff;
      z-index: 5;
      margin: 20px 20px 0 20px;
      padding: 16px 0 12px 0;
      border-bottom: 1px solid #f0f0f0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .rb-instructions-header .rb-section-title {
      font-weight: 700; 
      margin: 0; 
      color: #333;
      font-size: 18px;
      display: block;
      font-family: inherit;
    }
    
    ${SHARED_STYLES.RECIPE_APP_STYLES}
  `;
}

// iframe用サイドバーコンテナスタイル（後方互換性のため残す）
export function getIframeContainerStyles(): string {
  return getShadowDOMContainerStyles();
}

// モバイル用（全画面、CSS_RESET不要）のコンテナスタイル
export function getMobileContainerStyles(): string {
  return `
    #recipe-mobile-container { 
      ${SHARED_STYLES.CONTAINER_BASE}
      min-height: 100vh; 
      display: block; 
      width: 100%;
      overflow-x: hidden;
      overflow-y: visible;
      padding-bottom: 80px; /* フッターボタンのためのスペース */
      position: relative;
    }
    
    /* モバイル向けの特別なスタイル修正 */
    #recipe-mobile-container .rb-body { 
      flex: none; 
      overflow: visible; 
      color: #111; 
      background: #fff;
      box-sizing: border-box;
      display: block;
      font-family: ui-sans-serif, -apple-system, 'Segoe UI', Roboto, 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif;
    }
    
    /* 画像とタイトル部分を固定 */
    #recipe-mobile-container .rb-header-image {
      position: sticky;
      top: 0;
      width: 100%;
      height: 250px;
      overflow: hidden;
      margin: 0;
      padding: 0;
      z-index: 10;
      background: #fff;
    }
    
    #recipe-mobile-container .rb-header-image .rb-image { 
      width: 100%; 
      height: 100%;
      object-fit: cover; 
      display: block;
      margin: 0;
      padding: 0;
    }
    
    #recipe-mobile-container .rb-title-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
      padding: 24px;
      display: flex;
      align-items: flex-end;
    }
    
    #recipe-mobile-container .rb-title-overlay .rb-name {
      font-size: 28px; 
      font-weight: 800; 
      color: #fff;
      line-height: 1.2;
      margin: 0;
      text-shadow: 
        0 2px 8px rgba(0, 0, 0, 0.8),
        0 1px 3px rgba(0, 0, 0, 0.9),
        1px 1px 0 rgba(0, 0, 0, 0.7),
        -1px -1px 0 rgba(0, 0, 0, 0.7),
        1px -1px 0 rgba(0, 0, 0, 0.7),
        -1px 1px 0 rgba(0, 0, 0, 0.7);
      font-family: inherit;
      letter-spacing: 0.5px;
      backdrop-filter: blur(2px);
    }
    
    /* 材料ヘッダーをスティッキーに（画像ありの場合） */
    #recipe-mobile-container .rb-header-image + .rb-section-header {
      position: sticky;
      top: 250px;
      background: #fff;
      z-index: 5;
      margin: 0;
      padding: 16px 20px 12px 20px;
      border-bottom: 1px solid #f0f0f0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    
    /* 材料ヘッダーをスティッキーに（画像なしの場合） */
    #recipe-mobile-container .rb-name + .rb-section-header {
      position: sticky;
      top: 108px; /* タイトル高さ分 */
      background: #fff;
      z-index: 5;
      margin: 0;
      padding: 16px 20px 12px 20px;
      border-bottom: 1px solid #f0f0f0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    
    /* 作り方ヘッダーもスティッキーに（画像ありの場合） */
    #recipe-mobile-container .rb-header-image ~ .rb-instructions-header {
      position: sticky;
      top: 250px;
      background: #fff;
      z-index: 5;
      margin: 20px 0 0 0;
      padding: 16px 20px 12px 20px;
      border-bottom: 1px solid #f0f0f0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    /* 作り方ヘッダーもスティッキーに（画像なしの場合） */
    #recipe-mobile-container .rb-name ~ .rb-instructions-header {
      position: sticky;
      top: 108px; /* タイトル高さ分 */
      background: #fff;
      z-index: 5;
      margin: 20px 0 0 0;
      padding: 16px 20px 12px 20px;
      border-bottom: 1px solid #f0f0f0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    #recipe-mobile-container .rb-instructions-header .rb-section-title {
      font-weight: 700; 
      margin: 0; 
      color: #333;
      font-size: 18px;
      display: block;
      font-family: inherit;
    }
    
    /* 画像なしのタイトル部分のスタイル調整 */
    #recipe-mobile-container .rb-name {
      position: sticky;
      top: 0;
      background: #fff;
      z-index: 10;
      font-size: 28px; 
      font-weight: 700; 
      margin: 0; 
      padding: 20px;
      color: #333;
      line-height: 1.3;
      display: block;
      font-family: inherit;
      border-bottom: 1px solid #f0f0f0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    #recipe-mobile-container ${SHARED_STYLES.RECIPE_APP_STYLES}
    

    
    /* モバイル用フッターボタンスタイル */
    .recipe-mobile-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #fff;
      border-top: 1px solid #eee;
      padding: 12px 20px;
      box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
      z-index: 2147483648;
      box-sizing: border-box;
    }
    
    .recipe-mobile-footer button {
      width: 100%;
      background: #007AFF;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      ${SHARED_STYLES.IFRAME_BASE}
    }
    
    .recipe-mobile-footer button:hover {
      background: #0056b3;
    }
    
    /* レシピビューに戻るボタンスタイル */
    .recipe-return-button {
      ${SHARED_STYLES.IFRAME_BASE}
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 2147483647;
      background: #ff6b35;
      color: white;
      border: none;
      border-radius: 25px;
      padding: 12px 20px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
      transition: all 0.2s ease;
      font-family: ui-sans-serif, -apple-system, 'Segoe UI', Roboto, sans-serif;
    }
    
    .recipe-return-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
    }
  `;
}

// スタイルを注入するヘルパー関数
export function injectStyles(styleId: string, cssContent: string): void {
  if (document.getElementById(styleId)) return;
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = cssContent;
  document.head.appendChild(style);
}
