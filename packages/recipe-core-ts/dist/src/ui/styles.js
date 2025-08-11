// 共通のスタイル定義
export const SHARED_STYLES = {
    // 基本的なコンテナスタイル
    CONTAINER_BASE: `
    font-family: ui-sans-serif, -apple-system, 'Segoe UI', Roboto, 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif !important;
    line-height: 1.6 !important;
    color: #333 !important;
    background: #fff !important;
    box-sizing: border-box !important;
  `,
    // サイトスタイルからの分離用CSS Reset
    CSS_RESET: `
    all: unset !important;
    display: block !important;
    box-sizing: border-box !important;
  `,
    // RecipeSidebarAppの共通スタイル
    RECIPE_APP_STYLES: `
    .rb-header { 
      all: unset !important;
      display: flex !important; 
      align-items: center !important; 
      justify-content: space-between !important; 
      padding: 12px !important; 
      border-bottom: 1px solid #eee !important; 
      background: #f8f9fa !important;
      box-sizing: border-box !important;
      font-family: ui-sans-serif, -apple-system, 'Segoe UI', Roboto, 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif !important;
    }
    .rb-header .rb-title { 
      all: unset !important;
      font-weight: 700 !important; 
      font-size: 16px !important; 
      color: #333 !important;
      margin: 0 !important;
      font-family: inherit !important;
    }
    .rb-header .rb-close { 
      all: unset !important;
      font-size: 18px !important; 
      border: none !important; 
      background: transparent !important; 
      cursor: pointer !important; 
      color: #666 !important;
      padding: 4px !important;
      border-radius: 4px !important;
      font-family: inherit !important;
    }
    .rb-header .rb-close:hover {
      background: #e9ecef !important;
    }
    .rb-body { 
      all: unset !important;
      flex: 1 !important; 
      overflow: auto !important; 
      padding: 20px !important; 
      color: #111 !important; 
      background: #fff !important;
      box-sizing: border-box !important;
      display: block !important;
      font-family: ui-sans-serif, -apple-system, 'Segoe UI', Roboto, 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif !important;
    }
    .rb-body .rb-name { 
      all: unset !important;
      font-size: 24px !important; 
      font-weight: 600 !important; 
      margin-bottom: 16px !important; 
      color: #333 !important;
      line-height: 1.3 !important;
      display: block !important;
      font-family: inherit !important;
    }
    .rb-body .rb-image { 
      all: unset !important;
      width: 100% !important; 
      height: auto !important;
      max-width: 100% !important;
      max-height: 240px !important; 
      border-radius: 8px !important; 
      object-fit: cover !important; 
      margin-bottom: 20px !important; 
      display: block !important;
      box-sizing: border-box !important;
      border: none !important;
      outline: none !important;
      background: transparent !important;
      position: relative !important;
      top: auto !important;
      left: auto !important;
      right: auto !important;
      bottom: auto !important;
      transform: none !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      margin-top: 0 !important;
      padding: 0 !important;
      float: none !important;
      clear: none !important;
      z-index: auto !important;
      overflow: visible !important;
    }
    .rb-body .rb-yield { 
      all: unset !important;
      margin: 4px 0 12px !important; 
      color: #333 !important; 
      display: flex !important; 
      align-items: center !important; 
      gap: 6px !important; 
      font-family: inherit !important;
    }
    .rb-body .rb-yield .rb-yield-label { 
      all: unset !important;
      font-weight: 600 !important; 
      color: #333 !important;
      font-family: inherit !important;
    }
    .rb-body .rb-yield .rb-yield-inline { 
      all: unset !important;
      display: inline-flex !important; 
      align-items: center !important; 
      gap: 6px !important; 
    }
    .rb-body .rb-yield .rb-btn { 
      all: unset !important;
      width: 24px !important; 
      height: 24px !important; 
      border: 1px solid #ddd !important; 
      border-radius: 4px !important; 
      background: #fff !important; 
      cursor: pointer !important; 
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 14px !important;
      color: #333 !important;
      font-family: inherit !important;
      box-sizing: border-box !important;
    }
    .rb-body .rb-yield .rb-btn:hover {
      background: #f8f9fa !important;
    }
    .rb-body .rb-yield .rb-num { 
      all: unset !important;
      width: 48px !important; 
      text-align: center !important; 
      height: 24px !important; 
      border: 1px solid #ddd !important;
      border-radius: 4px !important;
      background: #fff !important;
      color: #333 !important;
      font-size: 14px !important;
      font-family: inherit !important;
      box-sizing: border-box !important;
      display: block !important;
      padding: 2px 4px !important;
      line-height: 1.2 !important;
    }
    .rb-body .rb-section-title { 
      all: unset !important;
      font-weight: 700 !important; 
      margin: 20px 0 8px !important; 
      color: #333 !important;
      font-size: 18px !important;
      display: block !important;
      font-family: inherit !important;
    }
    .rb-body .rb-list { 
      all: unset !important;
      list-style: none !important; 
      padding: 0 !important; 
      margin: 0 0 12px 0 !important; 
      display: block !important;
    }
    .rb-body .rb-list li { 
      all: unset !important;
      display: flex !important; 
      justify-content: space-between !important; 
      gap: 8px !important; 
      padding: 8px 0 !important; 
      border-bottom: 1px solid #f0f0f0 !important;
      color: #333 !important;
      font-family: inherit !important;
      box-sizing: border-box !important;
    }
    .rb-body .rb-list .rb-qty { 
      all: unset !important;
      color: #666 !important; 
      font-weight: 500 !important;
      font-family: inherit !important;
    }
    .rb-body .rb-steps { 
      all: unset !important;
      padding-left: 20px !important; 
      margin: 0 !important;
      color: #333 !important;
      display: block !important;
      font-family: inherit !important;
      list-style-type: decimal !important;
      counter-reset: recipe-step !important;
    }
    .rb-body .rb-steps li { 
      all: unset !important;
      margin: 8px 0 !important; 
      color: #333 !important;
      line-height: 1.6 !important;
      display: list-item !important;
      font-family: inherit !important;
      list-style-type: decimal !important;
      padding-left: 8px !important;
    }
  `,
};
// デスクトップ用（サイドバー）のコンテナスタイル
export function getDesktopContainerStyles() {
    return `
    #recipe-sidebar-container { 
      ${SHARED_STYLES.CSS_RESET}
      position: fixed !important; 
      top: 0 !important; 
      right: 0 !important; 
      height: 100vh !important; 
      width: 360px !important; 
      ${SHARED_STYLES.CONTAINER_BASE}
      box-shadow: 0 0 12px rgba(0,0,0,0.15) !important; 
      border-left: 1px solid #eee !important; 
      z-index: 2147483647 !important; 
      display: flex !important; 
      flex-direction: column !important; 
      overflow: hidden !important; 
    }
    #recipe-sidebar-container * {
      ${SHARED_STYLES.CSS_RESET}
    }
    #recipe-sidebar-container ${SHARED_STYLES.RECIPE_APP_STYLES}
  `;
}
// モバイル用（全画面）のコンテナスタイル
export function getMobileContainerStyles() {
    return `
    #recipe-mobile-container { 
      ${SHARED_STYLES.CSS_RESET}
      ${SHARED_STYLES.CONTAINER_BASE}
      min-height: 100vh !important; 
      display: flex !important; 
      flex-direction: column !important; 
      width: 100% !important;
      overflow-x: hidden !important;
      padding-bottom: 80px !important; /* フッターボタンのためのスペース */
      position: relative !important;
    }
    /* モバイル版ではより緩やかなリセットを適用 */
    #recipe-mobile-container > :not(.rb-header):not(.rb-body) {
      font-family: inherit !important;
      box-sizing: border-box !important;
    }
    #recipe-mobile-container ${SHARED_STYLES.RECIPE_APP_STYLES}
    
    /* モバイル用追加スタイル */
    #recipe-mobile-container .rb-header .rb-close { 
      display: none !important; /* モバイルでは閉じるボタンを非表示 */
    }
    
    /* モバイル用フッターボタンスタイル */
    .recipe-mobile-footer {
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      background: #fff !important;
      border-top: 1px solid #eee !important;
      padding: 12px 20px !important;
      box-shadow: 0 -2px 8px rgba(0,0,0,0.1) !important;
      z-index: 2147483648 !important;
      box-sizing: border-box !important;
    }
    
    .recipe-mobile-footer button {
      width: 100% !important;
      background: #007AFF !important;
      color: white !important;
      border: none !important;
      border-radius: 8px !important;
      padding: 12px !important;
      font-size: 16px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      font-family: inherit !important;
      ${SHARED_STYLES.CSS_RESET}
    }
    
    .recipe-mobile-footer button:hover {
      background: #0056b3 !important;
    }
    
    /* レシピビューに戻るボタンスタイル */
    .recipe-return-button {
      ${SHARED_STYLES.CSS_RESET}
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      z-index: 2147483647 !important;
      background: #ff6b35 !important;
      color: white !important;
      border: none !important;
      border-radius: 25px !important;
      padding: 12px 20px !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3) !important;
      transition: all 0.2s ease !important;
      font-family: ui-sans-serif, -apple-system, 'Segoe UI', Roboto, sans-serif !important;
    }
    
    .recipe-return-button:hover {
      transform: scale(1.05) !important;
      box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4) !important;
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
