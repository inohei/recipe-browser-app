import 'dart:collection';
import 'dart:ui';

import 'package:flutter/cupertino.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:provider/provider.dart';

import '../state/browser_state.dart';
import 'shared/tabs_overview.dart';

class IosBrowserScreen extends StatelessWidget {
  const IosBrowserScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<BrowserState>();
    final tab = state.currentTab;
    return CupertinoPageScaffold(
      child: Stack(
        children: [
          Positioned.fill(
            child: SafeArea(
              top: true,
              left: true,
              right: true,
              bottom: false,
              child: tab == null
                  ? const SizedBox.shrink()
                  : Stack(
                      children: [
                        Positioned.fill(
                          child: InAppWebView(
                            key: ValueKey(tab.id),
                            initialSettings: state.mainWebViewSettings,
                            initialUserScripts: UnmodifiableListView(
                              state.mainUserScripts,
                            ),
                            onWebViewCreated: (c) =>
                                state.onMainWebViewCreated(tab, c),
                            onTitleChanged: (c, t) => tab.title = t,
                            onLoadStart: (c, u) =>
                                state.onMainLoadStart(tab, u),
                            onLoadStop: (c, u) => state.onMainLoadStop(tab, u),
                            shouldOverrideUrlLoading: (c, a) =>
                                state.onShouldOverrideUrlLoading(a),
                          ),
                        ),
                        Positioned.fill(
                          child: Opacity(
                            opacity: state.recipeOverlayVisible ? 1.0 : 0.0,
                            child: IgnorePointer(
                              ignoring: !state.recipeOverlayVisible,
                              child: InAppWebView(
                                initialSettings: InAppWebViewSettings(
                                  transparentBackground: false,
                                  javaScriptEnabled: true,
                                  useShouldOverrideUrlLoading: true,
                                  // アプリ起動を防ぐための設定
                                  regexToCancelSubFramesLoading:
                                      r'^(intent:|market:|line:|twitter:|instagram:|fb:|whatsapp:|tg:|zoomus:|msteamss:|mailto:|tel:|sms:|cookpad:|kurashiru:|delishkitchen:)',
                                  // ポップアップ経由の起動を基本禁止
                                  supportMultipleWindows: false,
                                  javaScriptCanOpenWindowsAutomatically: false,
                                ),
                                onWebViewCreated: (c) =>
                                    state.setRecipeOverlayController(c),
                                shouldOverrideUrlLoading: (c, a) =>
                                    state.onShouldOverrideUrlLoading(a),
                              ),
                            ),
                          ),
                        ),
                        // オーバーレイの開閉ボタン（レシピが見つかった時のみ表示）
                        if (state.currentTab?.overlayRecipeData != null)
                          Positioned(
                            left: 0,
                            right: 0,
                            bottom: 120, // ボトムツールバーの上に配置（余裕を持たせる）
                            child: _OverlayToggleButton(),
                          ),
                      ],
                    ),
            ),
          ),
          Positioned(left: 0, right: 0, bottom: 0, child: _BottomToolbar()),
        ],
      ),
    );
  }
}

class _BottomToolbar extends StatefulWidget {
  const _BottomToolbar();

  @override
  State<_BottomToolbar> createState() => _BottomToolbarState();
}

class _BottomToolbarState extends State<_BottomToolbar> {
  final FocusNode _focusNode = FocusNode();
  final TextEditingController _controller = TextEditingController();
  bool _focused = false;

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(() {
      setState(() {
        _focused = _focusNode.hasFocus;
      });
      // フォーカスが当たった時に全選択
      if (_focusNode.hasFocus && _controller.text.isNotEmpty) {
        _controller.selection = TextSelection(
          baseOffset: 0,
          extentOffset: _controller.text.length,
        );
      }
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final text = context.read<BrowserState>().omniboxText;
    // フォーカスされていない時のみテキストを更新
    if (!_focused && _controller.text != text) {
      _controller.text = text;
    }
  }

  @override
  void dispose() {
    _focusNode.dispose();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<BrowserState>();
    final tab = state.currentTab;
    final mediaQuery = MediaQuery.of(context);
    final isDark = mediaQuery.platformBrightness == Brightness.dark;

    final bottomInset = MediaQuery.of(context).viewPadding.bottom;

    // iOS のテーマ情報は UI 構築にのみ使用

    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          padding: EdgeInsets.fromLTRB(16, 8, 16, 8 + bottomInset),
          decoration: BoxDecoration(
            color: isDark
                ? const Color.fromARGB(167, 0, 0, 0)
                : const Color.fromARGB(167, 255, 255, 255),
            border: Border(
              top: BorderSide(
                color: (isDark ? CupertinoColors.white : CupertinoColors.black)
                    .withValues(alpha: 0.06),
                width: 0.5,
              ),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 上段: 検索フィールド
              Row(
                children: [
                  Expanded(
                    child: CupertinoTextField(
                      focusNode: _focusNode,
                      controller: _controller,
                      placeholder: '検索語句またはURLを入力',
                      placeholderStyle: TextStyle(
                        color: isDark
                            ? CupertinoColors.systemGrey
                            : CupertinoColors.systemGrey2,
                        fontSize: 17,
                      ),
                      style: const TextStyle(fontSize: 17),
                      clearButtonMode: OverlayVisibilityMode.editing,
                      prefix: Padding(
                        padding: const EdgeInsets.only(left: 8),
                        child: Icon(
                          CupertinoIcons.search,
                          size: 18,
                          color: isDark
                              ? CupertinoColors.systemGrey
                              : CupertinoColors.systemGrey2,
                        ),
                      ),
                      suffix: _focused
                          ? CupertinoButton(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                              ),
                              onPressed: () {
                                _controller.clear();
                                state.setOmniboxText('');
                              },
                              minimumSize: Size(0, 0),
                              child: Icon(
                                CupertinoIcons.clear,
                                size: 18,
                                color: isDark
                                    ? CupertinoColors.systemGrey
                                    : CupertinoColors.systemGrey2,
                              ),
                            )
                          : CupertinoButton(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                              ),
                              onPressed: state.reload,
                              minimumSize: Size(0, 0),
                              child: Icon(
                                CupertinoIcons.refresh,
                                size: 18,
                                color: isDark
                                    ? CupertinoColors.systemGrey
                                    : CupertinoColors.systemGrey2,
                              ),
                            ),
                      decoration: BoxDecoration(
                        color: isDark
                            ? const Color(0x40FFFFFF)
                            : CupertinoColors.systemGrey6,
                        borderRadius: BorderRadius.circular(18),
                      ),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 10,
                      ),
                      keyboardType: TextInputType.text,
                      textInputAction: TextInputAction.go,
                      onSubmitted: (v) => state.navigateCurrent(v),
                      onChanged: (v) => state.setOmniboxText(v),
                      autocorrect: false,
                      enableSuggestions: true,
                      enableIMEPersonalizedLearning: true,
                      textCapitalization: TextCapitalization.none,
                      inputFormatters: [
                        FilteringTextInputFormatter.deny(
                          RegExp(r'[\u0000-\u001F\u007F-\u009F]'),
                        ),
                      ],
                      smartDashesType: SmartDashesType.disabled,
                      smartQuotesType: SmartQuotesType.disabled,
                    ),
                  ),
                  const SizedBox(width: 8),
                ],
              ),
              const SizedBox(height: 8),
              // 下段: 戻る/進む/ブックマーク/タブ
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  CupertinoButton(
                    padding: EdgeInsets.zero,
                    onPressed: tab?.canGoBack == true ? state.goBack : null,
                    child: Icon(
                      CupertinoIcons.left_chevron,
                      color: tab?.canGoBack == true
                          ? CupertinoColors.systemBlue
                          : (isDark
                                ? CupertinoColors.systemGrey3
                                : CupertinoColors.systemGrey4),
                      size: 24,
                    ),
                  ),
                  CupertinoButton(
                    padding: EdgeInsets.zero,
                    onPressed: tab?.canGoForward == true
                        ? state.goForward
                        : null,
                    child: Icon(
                      CupertinoIcons.right_chevron,
                      color: tab?.canGoForward == true
                          ? CupertinoColors.systemBlue
                          : (isDark
                                ? CupertinoColors.systemGrey3
                                : CupertinoColors.systemGrey4),
                      size: 24,
                    ),
                  ),
                  CupertinoButton(
                    padding: EdgeInsets.zero,
                    onPressed: state.toggleBookmarkCurrent,
                    child: Icon(
                      state.isBookmarkedCurrent()
                          ? CupertinoIcons.bookmark_fill
                          : CupertinoIcons.bookmark,
                      color: state.isBookmarkedCurrent()
                          ? CupertinoColors.systemYellow
                          : (isDark
                                ? CupertinoColors.systemGrey
                                : CupertinoColors.systemGrey2),
                      size: 24,
                    ),
                  ),
                  CupertinoButton(
                    padding: EdgeInsets.zero,
                    onPressed: () => Navigator.of(context).push(
                      CupertinoPageRoute(
                        builder: (_) => const TabsOverviewPage(),
                      ),
                    ),
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        Icon(
                          CupertinoIcons.square_on_square,
                          color: isDark
                              ? CupertinoColors.systemGrey
                              : CupertinoColors.systemGrey2,
                          size: 24,
                        ),
                        Positioned(
                          right: -2,
                          top: -2,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 4,
                              vertical: 1,
                            ),
                            decoration: BoxDecoration(
                              color: CupertinoColors.activeBlue,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              '${state.tabs.length}',
                              style: const TextStyle(
                                fontSize: 11,
                                color: CupertinoColors.white,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _OverlayToggleButton extends StatelessWidget {
  const _OverlayToggleButton();

  @override
  Widget build(BuildContext context) {
    final state = context.watch<BrowserState>();
    final isDark = MediaQuery.of(context).platformBrightness == Brightness.dark;
    final isVisible = state.recipeOverlayVisible;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: isDark
                  ? const Color.fromARGB(200, 0, 0, 0)
                  : const Color.fromARGB(200, 255, 255, 255),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: (isDark ? CupertinoColors.white : CupertinoColors.black)
                    .withValues(alpha: 0.1),
                width: 0.5,
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: [
                CupertinoButton(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 4,
                  ),
                  onPressed: () {
                    if (isVisible) {
                      state.hideRecipeOverlay();
                    } else {
                      state.showOverlay();
                    }
                  },
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        isVisible
                            ? CupertinoIcons.eye_slash
                            : CupertinoIcons.eye,
                        size: 16,
                        color: CupertinoColors.systemBlue,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        isVisible ? 'レシピを隠す' : 'レシピを表示',
                        style: TextStyle(
                          fontSize: 14,
                          color: CupertinoColors.systemBlue,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
