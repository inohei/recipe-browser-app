import 'dart:convert';
import 'dart:math';

// ignore_for_file: avoid_print

import 'package:flutter/foundation.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/bookmark.dart';
import '../models/history_entry.dart';

class BrowserTab {
  BrowserTab({required this.id, required this.initialUrl});

  final String id;
  final String initialUrl;
  InAppWebViewController? controller;
  String url = '';
  String? title;
  bool canGoBack = false;
  bool canGoForward = false;
  bool isLoading = false;
  String? pendingUrlToLoad;

  // タブごとのオーバーレイ状態
  bool overlayVisible = false;
  Map<String, dynamic>? overlayRecipeData;

  InAppWebViewSettings get settings => InAppWebViewSettings(
    javaScriptEnabled: true,
    transparentBackground: true,
  );
}

class BrowserState extends ChangeNotifier {
  static const String _prefsHistoryKey = 'history_v1';
  static const String _prefsBookmarksKey = 'bookmarks_v1';
  static const String _prefsSessionKey = 'session_tabs_v1';
  final List<BrowserTab> _tabs = <BrowserTab>[];
  final List<HistoryEntry> _history = <HistoryEntry>[];
  final List<Bookmark> _bookmarks = <Bookmark>[];
  int _currentTabIndex = 0;
  String _omniboxText = '';
  List<BrowserTab> get tabs => List.unmodifiable(_tabs);
  int get currentTabIndex => _currentTabIndex;
  BrowserTab? get currentTab =>
      _tabs.isEmpty ? null : _tabs[min(_currentTabIndex, _tabs.length - 1)];
  List<HistoryEntry> get history => List.unmodifiable(_history.reversed);
  List<Bookmark> get bookmarks => List.unmodifiable(_bookmarks);
  String get omniboxText => _omniboxText;

  // レシピオーバーレイWebView
  InAppWebViewController? _recipeOverlayController;

  // 現在のタブのオーバーレイ表示状態を返す
  bool get recipeOverlayVisible => currentTab?.overlayVisible ?? false;

  Map<String, dynamic>? _pendingRecipeJson;
  void setRecipeOverlayController(InAppWebViewController controller) {
    print('setRecipeOverlayController called');
    _recipeOverlayController = controller;

    // コンソールログキャプチャを追加
    controller.addJavaScriptHandler(
      handlerName: 'consoleLog',
      callback: (args) {
        if (args.isNotEmpty) {
          print('OVERLAY CONSOLE: ${args.first}');
        }
        return null;
      },
    );

    // 初期HTMLを読み込み、JSをプリロード
    _initializeRecipeOverlay();
    // 保留レシピがあれば描画
    if (_pendingRecipeJson != null) {
      print('Processing pending recipe JSON');
      final json = _pendingRecipeJson!;
      _pendingRecipeJson = null;
      // 非同期で少し待ってから実行（初期スクリプト注入完了を待つ）
      Future.microtask(() => showRecipeOverlayWithJson(json));
    }

    // 現在のタブにオーバーレイ状態があれば復元
    final currentTab = this.currentTab;
    if (currentTab != null &&
        currentTab.overlayVisible &&
        currentTab.overlayRecipeData != null) {
      Future.microtask(() async {
        await _restoreOverlayForCurrentTab();
      });
    }
  }

  // (unused) 以前のデバッグ用ハンドラーは削除

  Future<void> initialize() async {
    await _loadPrefs();
    if (_tabs.isEmpty) {
      await addNewTab(initialUrl: 'about:start');
    }
  }

  Future<void> _loadPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    // History
    final historyJson = prefs.getStringList(_prefsHistoryKey) ?? <String>[];
    _history
      ..clear()
      ..addAll(
        historyJson.map(
          (s) => HistoryEntry.fromJson(json.decode(s) as Map<String, dynamic>),
        ),
      );
    // Bookmarks
    final bookmarkJson = prefs.getStringList(_prefsBookmarksKey) ?? <String>[];
    _bookmarks
      ..clear()
      ..addAll(
        bookmarkJson.map(
          (s) => Bookmark.fromJson(json.decode(s) as Map<String, dynamic>),
        ),
      );
    // Session tabs (restore URLs)
    final session = prefs.getStringList(_prefsSessionKey) ?? <String>[];
    final restoredUrls = session.isEmpty ? ['about:start'] : session;
    for (final url in restoredUrls) {
      _tabs.add(_createTab(url));
    }
    _currentTabIndex = 0;
    final firstUrl = _tabs.isNotEmpty ? _tabs[0].url : '';
    _omniboxText = firstUrl.startsWith('data:text/html') ? '' : firstUrl;
    notifyListeners();
  }

  Future<void> _savePrefs() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(
      _prefsHistoryKey,
      _history.map((e) => json.encode(e.toJson())).toList(),
    );
    await prefs.setStringList(
      _prefsBookmarksKey,
      _bookmarks.map((e) => json.encode(e.toJson())).toList(),
    );
    await prefs.setStringList(
      _prefsSessionKey,
      _tabs
          .map((t) => t.url.startsWith('http') ? t.url : 'about:start')
          .toList(),
    );
  }

  BrowserTab _createTab(String initialUrl) {
    // 初期URL解決
    final effectiveUrl = initialUrl == 'about:start'
        ? _createStartPageDataUri()
        : initialUrl;
    return BrowserTab(
      id: UniqueKey().toString(),
      initialUrl: _normalizeToUrl(effectiveUrl),
    );
  }

  Future<void> addNewTab({String initialUrl = 'about:start'}) async {
    _tabs.add(_createTab(initialUrl));
    _currentTabIndex = _tabs.length - 1;
    final newTab = _tabs[_currentTabIndex];
    _omniboxText = initialUrl == 'about:start' ? '' : newTab.initialUrl;

    // 新しいタブに切り替わるので、以前のタブのオーバーレイは自動的に非表示になる
    // （新しいタブはoverlayVisible = falseで作成される）

    notifyListeners();
    await _savePrefs();
  }

  Future<void> closeTab(int index) async {
    if (index < 0 || index >= _tabs.length) return;
    _tabs.removeAt(index);
    if (_tabs.isEmpty) {
      await addNewTab();
    } else {
      _currentTabIndex = (_currentTabIndex.clamp(0, _tabs.length - 1));
      final url = currentTab?.url ?? '';
      _omniboxText = url.startsWith('data:text/html') ? '' : url;
      notifyListeners();
      await _savePrefs();
    }
  }

  Future<void> switchToTab(int index) async {
    if (index < 0 || index >= _tabs.length) return;

    // タブ切り替え時は一時的にオーバーレイを非表示にする
    final previousVisible = recipeOverlayVisible;
    if (previousVisible) {
      // 一時的に非表示にする（状態は保持）
      notifyListeners();
    }

    _currentTabIndex = index;
    final tab = currentTab;
    if (tab != null) {
      final url = tab.url.isEmpty ? tab.initialUrl : tab.url;
      _omniboxText = url.startsWith('data:text/html') ? '' : url;

      // タブ切り替え時に、そのタブのコントローラーがまだない場合は初期URLを読み込む
      if (tab.controller != null && tab.url.isEmpty) {
        await tab.controller?.loadUrl(
          urlRequest: URLRequest(url: WebUri(tab.initialUrl)),
        );
      }

      // 切り替え先のタブにオーバーレイ状態があれば復元
      if (tab.overlayVisible && tab.overlayRecipeData != null) {
        // 少し待ってからオーバーレイを再描画
        Future.microtask(() async {
          await _restoreOverlayForCurrentTab();
        });
      }
    }
    notifyListeners();
    await _savePrefs();
  }

  // 現在のタブのオーバーレイ状態を復元する
  Future<void> _restoreOverlayForCurrentTab() async {
    final tab = currentTab;
    if (tab == null || !tab.overlayVisible || tab.overlayRecipeData == null) {
      return;
    }

    if (_recipeOverlayController == null) {
      return;
    }

    print('Restoring overlay for tab: ${tab.id}');
    final jsonStr = jsonEncode(tab.overlayRecipeData!);
    try {
      await _recipeOverlayController!.evaluateJavascript(
        source:
            '''
          console.log("Restoring recipe overlay for tab");
          window.renderRecipeData($jsonStr);
        ''',
      );
      print('Overlay restored successfully');
    } catch (e) {
      print('Failed to restore overlay: $e');
    }
    notifyListeners();
  }

  Future<void> navigateCurrent(String input) async {
    final tab = currentTab;
    if (tab == null) return;
    final url = _normalizeToUrl(input);

    // ページ遷移時はオーバーレイを非表示にする
    if (tab.overlayVisible) {
      tab.overlayVisible = false;
      tab.overlayRecipeData = null; // 新しいページなのでレシピデータもクリア
    }

    if (tab.controller == null) {
      tab.pendingUrlToLoad = url;
    } else {
      await tab.controller?.loadUrl(urlRequest: URLRequest(url: WebUri(url)));
    }
    _omniboxText = url;
    notifyListeners();
  }

  Future<void> goBack() async {
    final tab = currentTab;
    if (tab == null) return;

    // ページ遷移時はオーバーレイを非表示にする
    if (tab.overlayVisible) {
      tab.overlayVisible = false;
      tab.overlayRecipeData = null;
      notifyListeners();
    }

    if (await tab.controller?.canGoBack() == true) {
      await tab.controller?.goBack();
    }
  }

  Future<void> goForward() async {
    final tab = currentTab;
    if (tab == null) return;

    // ページ遷移時はオーバーレイを非表示にする
    if (tab.overlayVisible) {
      tab.overlayVisible = false;
      tab.overlayRecipeData = null;
      notifyListeners();
    }

    if (await tab.controller?.canGoForward() == true) {
      await tab.controller?.goForward();
    }
  }

  Future<void> reload() async {
    final tab = currentTab;
    if (tab == null) return;

    // リロード時はオーバーレイを非表示にする
    if (tab.overlayVisible) {
      tab.overlayVisible = false;
      tab.overlayRecipeData = null;
      notifyListeners();
    }

    await tab.controller?.reload();
  }

  void setOmniboxText(String text) {
    _omniboxText = text;
    notifyListeners();
  }

  bool isBookmarkedCurrent() {
    final url = currentTab?.url;
    if (url == null) return false;
    return _bookmarks.any((b) => b.url == url);
  }

  Future<void> toggleBookmarkCurrent() async {
    final tab = currentTab;
    if (tab == null) return;
    final existing = _bookmarks.indexWhere((b) => b.url == tab.url);
    if (existing >= 0) {
      _bookmarks.removeAt(existing);
    } else {
      _bookmarks.add(Bookmark(url: tab.url, title: tab.title ?? tab.url));
    }
    notifyListeners();
    await _savePrefs();
  }

  Future<void> addHistory({required String url, String? title}) async {
    _history.add(
      HistoryEntry(url: url, title: title, visitedAt: DateTime.now()),
    );
    if (_history.length > 1000) {
      _history.removeRange(0, _history.length - 1000);
    }
    notifyListeners();
    await _savePrefs();
  }

  Future<void> clearHistory() async {
    _history.clear();
    notifyListeners();
    await _savePrefs();
  }

  Future<void> removeBookmark(String url) async {
    _bookmarks.removeWhere((b) => b.url == url);
    notifyListeners();
    await _savePrefs();
  }

  String _normalizeToUrl(String input) {
    final trimmed = input.trim();
    if (trimmed.isEmpty) return 'about:start';
    if (trimmed == 'about:start') return _createStartPageDataUri();
    if (trimmed.startsWith('data:text/html')) return trimmed;
    final hasSpace = trimmed.contains(' ');
    final hasScheme = trimmed.contains('://');
    final looksLikeDomain = RegExp(r'^[^\s]+\.[^\s]{2,}').hasMatch(trimmed);
    if (!hasScheme && (hasSpace || !looksLikeDomain)) {
      final q = Uri.encodeComponent(trimmed);
      return 'https://www.google.com/search?q=$q';
    }
    if (!hasScheme) {
      return 'https://$trimmed';
    }
    return trimmed;
  }

  bool _shouldRecordHistory(String url) {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  String _createStartPageDataUri() {
    final bookmarkItems = _bookmarks
        .map(
          (b) =>
              '<li><a href="${htmlEscape.convert(b.url)}">${htmlEscape.convert(b.title ?? b.url)}</a></li>',
        )
        .join();
    final historyItems = _history.reversed
        .take(50)
        .map(
          (h) =>
              '<li><a href="${htmlEscape.convert(h.url)}">${htmlEscape.convert(h.title ?? h.url)}</a></li>',
        )
        .join();
    final html =
        '''
<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>スタートページ</title>
  <style>
    body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:0;padding:16px;}
    h1{font-size:20px;margin:0 0 12px}
    h2{font-size:16px;margin:20px 0 8px}
    ul{list-style:none;padding-left:0;margin:0}
    li{padding:8px 0;border-bottom:1px solid #eee}
    a{color:#007aff;text-decoration:none;word-break:break-all}
    .empty{color:#999}
    .section{background:#fafafa;border:1px solid #eee;border-radius:8px;padding:12px}
  </style>
  <script>
    document.addEventListener('click', function(e){
      const a = e.target.closest('a[href]');
      if(!a) return;
      // let WebView handle navigation normally
    });
  </script>
  </head>
<body>
  <h1>新しいタブ</h1>
  <div class="section">
    <h2>ブックマーク</h2>
    <ul>
      ${bookmarkItems.isEmpty ? '<li class="empty">ブックマークはありません</li>' : bookmarkItems}
    </ul>
  </div>
  <div class="section" style="margin-top:16px">
    <h2>履歴（最新50件）</h2>
    <ul>
      ${historyItems.isEmpty ? '<li class="empty">履歴はありません</li>' : historyItems}
    </ul>
  </div>
</body>
</html>
''';
    final uri = Uri.dataFromString(html, mimeType: 'text/html', encoding: utf8);
    return uri.toString();
  }

  // --- Recipe Overlay handling ---
  Future<void> _initializeRecipeOverlay() async {
    if (_recipeOverlayController == null) return;

    // HTMLファイルをファイルパスから読み込み
    await _recipeOverlayController!.loadFile(
      assetFilePath: 'assets/recipe-mobile/content-mobile.html',
    );
  }

  Future<void> showRecipeOverlayWithJson(
    Map<String, dynamic> recipeJson,
  ) async {
    print(
      'showRecipeOverlayWithJson called, controller: ${_recipeOverlayController != null}',
    );

    final tab = currentTab;
    if (tab == null) return;

    if (_recipeOverlayController == null) {
      print('Controller null, storing in pending');
      _pendingRecipeJson = recipeJson;
      return;
    }

    print('Executing JS to show recipe');
    final jsonStr = jsonEncode(recipeJson);
    try {
      // シンプルに直接renderRecipeData関数を呼び出す
      await _recipeOverlayController!.evaluateJavascript(
        source:
            '''
            window.renderRecipeData($jsonStr);
            ''',
      );
      print('JS execution completed');
    } catch (e) {
      print('JS execution error: $e');
    }

    // 現在のタブの状態を更新
    tab.overlayVisible = true;
    tab.overlayRecipeData = recipeJson;
    notifyListeners();
    print('notifyListeners called, visible: ${tab.overlayVisible}');
  }

  void hideRecipeOverlay() {
    final tab = currentTab;
    if (tab != null) {
      tab.overlayVisible = false;
      // レシピデータは保持しておく（再表示のため）
    }
    notifyListeners();
  }

  void showOverlay() {
    final tab = currentTab;
    if (tab != null) {
      tab.overlayVisible = true;
    }
    notifyListeners();
  }

  // --- Main WebView event hooks ---
  InAppWebViewSettings get mainWebViewSettings => InAppWebViewSettings(
    javaScriptEnabled: true,
    transparentBackground: true,
    allowsInlineMediaPlayback: true,
    useShouldOverrideUrlLoading: true,
    // アプリ起動を防ぐための設定
    regexToCancelSubFramesLoading:
        r'^(intent:|market:|line:|twitter:|instagram:|fb:|whatsapp:|tg:|zoomus:|msteamss:|mailto:|tel:|sms:|cookpad:|kurashiru:|delishkitchen:|orangepage:|recipe-blog:|tastemade:|macaro-ni:|mi-journey:|oceans-nadia:|dan-cyu:|erecipe:|housefoods:|ajinomoto:|rakuten-recipe:|yamasa:|glico:|kagome:|kewpie:|kikkoman:|kyounoryouri:|lettuceclub:|marukome:|mizkan:|nichirei:|nippn:|nipponham:|nisshin-oillio:|oisix:|sbfoods:|sirogohan:|yamaki:|yutori:|a-aji:|bob-an:|daidokolog:)',
    // ポップアップ経由の起動を基本禁止
    supportMultipleWindows: false,
    javaScriptCanOpenWindowsAutomatically: false,
  );

  List<UserScript> get mainUserScripts => [
    // JSON-LD 検出 (document start)
    UserScript(
      source: _jsonLdDetectorScript,
      injectionTime: UserScriptInjectionTime.AT_DOCUMENT_END,
    ),
    // 外部スキームブロッカー (document start)
    UserScript(
      source: _externalSchemeBlockerScript,
      injectionTime: UserScriptInjectionTime.AT_DOCUMENT_START,
    ),
  ];

  String get _jsonLdDetectorScript => r"""
    (function(){
      if(window.__rbJsonLdDetector) return; window.__rbJsonLdDetector = true;
      try{ window.flutter_inappwebview.callHandler('RBLog', 'jsonld-detector:init'); }catch(e){}
      var sent=false; function send(item){ if(sent) return; sent=true; try{ window.flutter_inappwebview.callHandler('RBLog', 'jsonld-detector:found'); }catch(e){} try{ window.flutter_inappwebview.callHandler('RBRecipeFound', item); }catch(e){} }
      function findRecipe(obj){ if(!obj) return null; if(typeof obj==='string'){ try{ obj=JSON.parse(obj); }catch(e){} } if(Array.isArray(obj)){ for(var i=0;i<obj.length;i++){ var r=findRecipe(obj[i]); if(r) return r; } return null; } if(typeof obj==='object'){ var t=obj['@type']; if(t==='Recipe' || (Array.isArray(t)&&t.indexOf('Recipe')>=0)) return obj; for(var k in obj){ try{ var r=findRecipe(obj[k]); if(r) return r; }catch(e){} } } return null; }
      function parseScripts(root){ var nodes=(root||document).querySelectorAll('script[type="application/ld+json"]'); for(var i=0;i<nodes.length;i++){ try{ var data=JSON.parse(nodes[i].textContent||'null'); if(!data) continue; var graph = data['@graph']? data['@graph'] : data; var rec=findRecipe(graph); if(rec){ send(rec); return; } }catch(e){} } }
      // Fallback: window.__NEXT_DATA__ / application/json の中にも稀に混在
      try{ if(window.__NEXT_DATA__){ var r=findRecipe(window.__NEXT_DATA__); if(r){ send(r); } } }catch(e){}
      try{ var appJson=document.querySelectorAll('script[type="application/json"]'); for(var i=0;i<appJson.length;i++){ var rec=findRecipe(appJson[i].textContent||''); if(rec){ send(rec); break; } } }catch(e){}
      if(document.head) parseScripts(document.head); else parseScripts(document);
      try{ new MutationObserver(function(muts){ muts.forEach(function(m){ m.addedNodes && m.addedNodes.forEach(function(n){ if(n.nodeType===1) parseScripts(n); }); }); }).observe(document.documentElement, {childList:true, subtree:true}); }catch(e){}
    })();
  """;

  String get _externalSchemeBlockerScript => r"""
    (function(){
      if (window.__rbExternalSchemeBlocker) return; window.__rbExternalSchemeBlocker = true;
      function isCustomScheme(url){ try{ var u=new URL(url, location.href); var s=(u.protocol||'').replace(':','').toLowerCase(); return ['http','https','data','about','file'].indexOf(s)===-1; }catch(e){ return false; } }
      document.addEventListener('click', function(e){ var a=e.target && e.target.closest? e.target.closest('a[href]'): null; if(!a) return; var href=a.getAttribute('href')||a.href||''; if(isCustomScheme(href)){ e.preventDefault(); try{ window.flutter_inappwebview.callHandler('RBLog', 'block-click:'+href); }catch(_){} } }, true);
      var _open=window.open; window.open=function(url){ if(isCustomScheme(url)){ try{ window.flutter_inappwebview.callHandler('RBLog','block-window-open:'+url);}catch(_){} return null;} return _open.apply(this, arguments); };
      var _assign=window.location.assign.bind(window.location); window.location.assign=function(url){ if(isCustomScheme(url)){ try{ window.flutter_inappwebview.callHandler('RBLog','block-assign:'+url);}catch(_){} return; } return _assign(url); };
      var _replace=window.location.replace.bind(window.location); window.location.replace=function(url){ if(isCustomScheme(url)){ try{ window.flutter_inappwebview.callHandler('RBLog','block-replace:'+url);}catch(_){} return; } return _replace(url); };
    })();
  """;

  // イベント: WebView生成
  void onMainWebViewCreated(BrowserTab tab, InAppWebViewController controller) {
    tab.controller = controller;

    controller.addJavaScriptHandler(
      handlerName: 'RBRecipeFound',
      callback: (args) async {
        if (args.isNotEmpty && args.first is Map) {
          print('RBRecipeFound: received recipe JSON');
          print('recipeOverlayVisible before: $recipeOverlayVisible');
          showOverlay();
          print('recipeOverlayVisible after: $recipeOverlayVisible');
          await showRecipeOverlayWithJson(
            (args.first as Map).cast<String, dynamic>(),
          );
          print('showRecipeOverlayWithJson completed');
        }
        return null;
      },
    );

    controller.addJavaScriptHandler(
      handlerName: 'RBLog',
      callback: (args) {
        if (args.isNotEmpty) {
          print('JS: ${args.first}');
        }
        return null;
      },
    );

    // 初回ロード（ペンディングがあればそちらを優先）
    final firstUrl = tab.pendingUrlToLoad ?? tab.initialUrl;
    tab.pendingUrlToLoad = null;
    controller.loadUrl(urlRequest: URLRequest(url: WebUri(firstUrl)));
  }

  // (unused) 以前のデバッグ用ハンドラーは削除

  void onMainLoadStart(BrowserTab tab, Uri? url) {
    tab.isLoading = true;
    final u = (url?.toString() ?? '');

    // URLが変わった場合（異なるページへの遷移）はオーバーレイをリセット
    if (tab.url != u && tab.overlayVisible) {
      tab.overlayVisible = false;
      tab.overlayRecipeData = null;
    }

    tab.url = u;
    // タイトルはロード開始時点ではURLを入れておく
    tab.title = u.isNotEmpty ? u : tab.title;
    if (u.startsWith('data:text/html')) {
      _omniboxText = '';
    } else if (_shouldRecordHistory(u)) {
      _omniboxText = u;
    }
    notifyListeners();
    _updateNavStateFor(tab);
  }

  void onMainLoadStop(BrowserTab tab, Uri? url) {
    tab.isLoading = false;
    final u = (url?.toString() ?? '');
    tab.url = u;
    // タイトルが取得できない場合のフォールバック
    tab.title = tab.title ?? u;
    if (_shouldRecordHistory(u)) {
      addHistory(url: u, title: tab.title);
    }
    if (u.startsWith('data:text/html')) {
      _omniboxText = '';
    } else if (_shouldRecordHistory(u)) {
      _omniboxText = u;
    }
    notifyListeners();
    _updateNavStateFor(tab);
    _savePrefs();
  }

  Future<void> _updateNavStateFor(BrowserTab tab) async {
    try {
      final back = await tab.controller?.canGoBack() ?? false;
      final forward = await tab.controller?.canGoForward() ?? false;
      tab.canGoBack = back;
      tab.canGoForward = forward;
      notifyListeners();
    } catch (_) {}
  }

  Future<NavigationActionPolicy> onShouldOverrideUrlLoading(
    NavigationAction action,
  ) async {
    final uri = action.request.url;
    if (uri == null) return NavigationActionPolicy.ALLOW;

    final url = uri.toString();
    final scheme = uri.scheme.toLowerCase();

    // 許可するスキーム
    const allowedSchemes = {'http', 'https', 'about', 'data', 'file'};

    // グローバルにブロックしたい"アプリ系"スキーム
    const blockedSchemes = {
      'intent', 'market', 'line', 'twitter', 'instagram', 'fb', 'whatsapp',
      'tg', 'zoomus', 'msteamss', 'mailto', 'tel', 'sms',
      // レシピアプリ系
      'cookpad', 'kurashiru', 'delishkitchen', 'orangepage', 'recipe-blog',
      'tastemade', 'macaro-ni', 'mi-journey', 'oceans-nadia', 'dan-cyu',
      'erecipe', 'housefoods', 'ajinomoto', 'rakuten-recipe', 'yamasa',
      'glico', 'kagome', 'kewpie', 'kikkoman', 'kyounoryouri', 'lettuceclub',
      'marukome', 'mizkan', 'nichirei', 'nippn', 'nipponham', 'nisshin-oillio',
      'oisix', 'sbfoods', 'sirogohan', 'yamaki', 'yutori', 'a-aji', 'bob-an',
      'daidokolog',
    };

    // 1) 許可していないスキームは即ブロック
    if (!allowedSchemes.contains(scheme) || blockedSchemes.contains(scheme)) {
      print('Blocking URL with scheme "$scheme": $url');
      return NavigationActionPolicy.CANCEL;
    }

    // 2) HTTPSでもアプリストアやSNSリンクをブロック
    if (scheme == 'https' || scheme == 'http') {
      final host = uri.host.toLowerCase();
      const blockedHosts = {
        'apps.apple.com',
        'itunes.apple.com',
        'play.google.com',
        'line.me',
        'api.whatsapp.com',
        'twitter.com',
        'instagram.com',
        'facebook.com',
        'm.facebook.com',
        'fb.com',
      };

      if (blockedHosts.contains(host)) {
        print('Blocking URL with blocked host "$host": $url');
        return NavigationActionPolicy.CANCEL;
      }

      // Universal Links パターンもブロック
      if (host.contains('cookpad.com') && uri.path.startsWith('/recipe/')) {
        // cookpad.com のレシピページは表示を許可（ブラウザで見せる）
        return NavigationActionPolicy.ALLOW;
      }
    }

    return NavigationActionPolicy.ALLOW;
  }
}
