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
      position: sticky;
      top: 0;
      width: 100%;
      height: 200px;
      overflow: hidden;
      margin: 0;
      padding: 0;
      z-index: 10;
      background: #fff;
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
      top: 200px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 16px 0 0 0;
      flex-wrap: nowrap;
      gap: 16px;
      min-height: 40px;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(8px);
      z-index: 9;
      padding: 12px 20px;
      border-bottom: 2px solid #f8f9fa;
    }
    
    .rb-body .rb-section-title { 
      font-weight: 600; 
      margin: 0; 
      color: #2d3748;
      font-size: 17px;
      display: block;
      font-family: inherit;
      flex-shrink: 0;
      letter-spacing: 0.025em;
      text-transform: uppercase;
      font-size: 14px;
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
      margin: 8px 0 24px 0; 
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
      padding: 0; 
      margin: 8px 20px 24px 20px;
      color: #1a1a1a;
      display: block;
      font-family: inherit;
      list-style: none;
      counter-reset: recipe-step;
    }
    .rb-body .rb-steps li { 
      margin: 0 0 12px 0; 
      color: #1a1a1a;
      line-height: 1.7;
      display: flex;
      align-items: flex-start;
      font-family: inherit;
      padding: 16px;
      background: rgba(248, 250, 252, 0.6);
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.04);
      counter-increment: recipe-step;
      position: relative;
      gap: 12px;
    }
    
    .rb-body .rb-steps li::before {
      content: counter(recipe-step);
      background: #3b82f6;
      color: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      flex-shrink: 0;
      margin-top: 2px;
      transition: all 0.2s ease;
    }
    
    .rb-body .rb-steps li:hover {
      background: rgba(248, 250, 252, 0.9);
      border-color: rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
    }
    
    .rb-body .rb-steps li:hover::before {
      background: #2563eb;
      transform: scale(1.1);
    }
    
    .rb-body .rb-step-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }
    
    .rb-body .rb-step-text {
      flex: 1;
      line-height: 1.7;
      color: #1a1a1a;
    }
    
    .rb-body .rb-step-image {
      display: flex;
      justify-content: center;
      margin-top: 8px;
    }
    
    .rb-body .rb-step-image img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    }
    
    .rb-body .rb-step-image img:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  `,
};
// iframe用サイドバーコンテナスタイル
export function getIframeContainerStyles() {
    return `
    body {
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
    
    /* iframe内では親ページのスクロールに追従 */
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
    
    
    .rb-instructions-header {
      position: sticky;
      top: 0;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(8px);
      z-index: 5;
      margin: 16px 0 0 0;
      padding: 12px 20px;
      border-bottom: 2px solid #f8f9fa;
    }
    
    .rb-instructions-header .rb-section-title {
      font-weight: 600; 
      margin: 0; 
      color: #2d3748;
      font-size: 14px;
      display: block;
      font-family: inherit;
      letter-spacing: 0.025em;
      text-transform: uppercase;
    }
    
    ${SHARED_STYLES.RECIPE_APP_STYLES}
  `;
}
// モバイル用（全画面、CSS_RESET不要）のコンテナスタイル - iframe側のデザインに統一
export function getMobileContainerStyles() {
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
    
    /* モバイル向けの特別なスタイル修正 - iframe側に統一 */
    #recipe-mobile-container .rb-body { 
      flex: none; 
      overflow: visible; 
      color: #111; 
      background: #fff;
      box-sizing: border-box;
      display: block;
      font-family: ui-sans-serif, -apple-system, 'Segoe UI', Roboto, 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif;
      height: auto;
      min-height: 100vh;
      /* iframe側に合わせてスクロール設定を統一 */
      touch-action: pan-y;
      overscroll-behavior: auto;
    }
    
    /* 画像とタイトル部分を固定 - iframe側のサイズに統一 */
    #recipe-mobile-container .rb-header-image {
      position: sticky;
      top: 0;
      width: 100%;
      height: 200px; /* iframe側に合わせて250px→200pxに変更 */
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
    
    /* オーバーレイをiframe側に統一 */
    #recipe-mobile-container .rb-title-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 15px; /* iframe側に合わせて24px→15pxに変更 */
      display: flex;
      align-items: flex-end;
    }
    
    /* タイトルサイズをiframe側に統一 */
    #recipe-mobile-container .rb-title-overlay .rb-name {
      font-size: 20px; /* iframe側に合わせて28px→20pxに変更 */
      font-weight: 800; 
      color: #fff;
      line-height: 1.2;
      margin: 0;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8); /* iframe側に統一 */
      font-family: inherit;
      letter-spacing: 0.5px;
    }
    
    /* 画像なしのタイトル部分のスタイル調整 - iframe側に統一 */
    #recipe-mobile-container .rb-body > .rb-name {
      font-size: 24px; /* iframe側に合わせて28px→24pxに変更 */
      font-weight: 600; 
      margin: 20px 20px 16px 20px; /* iframe側に統一 */
      color: #333;
      line-height: 1.3;
      display: block;
      font-family: inherit;
    }
    
    /* モバイル版でのセクションヘッダーの調整 - iframe側の位置に統一 */
    #recipe-mobile-container .rb-section-header {
      position: sticky;
      top: 200px; /* iframe側に合わせて250px→200pxに変更 */
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 16px 0 0 0;
      flex-wrap: nowrap;
      gap: 16px;
      min-height: 40px;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(8px);
      z-index: 9;
      padding: 12px 20px;
      border-bottom: 2px solid #f8f9fa;
    }

    /* 共通スタイルを適用 */
    ${SHARED_STYLES.RECIPE_APP_STYLES}
    
    
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
export function injectStyles(styleId, cssContent) {
    if (document.getElementById(styleId))
        return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = cssContent;
    document.head.appendChild(style);
}
