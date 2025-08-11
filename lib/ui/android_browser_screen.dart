import 'dart:collection';

import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:provider/provider.dart';

import '../state/browser_state.dart';
import 'shared/tabs_overview.dart';

class AndroidBrowserScreen extends StatelessWidget {
  const AndroidBrowserScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<BrowserState>();
    final tab = state.currentTab;
    return Scaffold(
      body: Column(
        children: [
          Expanded(
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
                                  transparentBackground: true,
                                  javaScriptEnabled: true,
                                ),
                                onWebViewCreated: (c) =>
                                    state.setRecipeOverlayController(c),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(8, 8, 8, 0),
            child: _Omnibox(),
          ),
          _BottomBar(),
        ],
      ),
    );
  }
}

class _Omnibox extends StatefulWidget {
  @override
  State<_Omnibox> createState() => _OmniboxState();
}

class _OmniboxState extends State<_Omnibox> {
  final TextEditingController _controller = TextEditingController();
  final FocusNode _focusNode = FocusNode();
  bool _focused = false;

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
  void initState() {
    super.initState();
    _focusNode.addListener(() {
      setState(() {
        _focused = _focusNode.hasFocus;
      });
    });
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
    return TextField(
      controller: _controller,
      decoration: InputDecoration(
        hintText: '検索語句またはURLを入力',
        isDense: true,
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        filled: true,
        fillColor: Theme.of(context).colorScheme.surfaceContainerHighest,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(24),
          borderSide: BorderSide.none,
        ),
        prefixIcon: const Icon(Icons.search),
        suffixIcon: _focused
            ? IconButton(
                icon: const Icon(Icons.clear),
                onPressed: () {
                  _controller.clear();
                  state.setOmniboxText('');
                },
              )
            : IconButton(
                icon: const Icon(Icons.refresh),
                onPressed: state.reload,
              ),
      ),
      onSubmitted: (value) => state.navigateCurrent(value),
      onChanged: state.setOmniboxText,
      focusNode: _focusNode,
      keyboardType: TextInputType.url,
      textInputAction: TextInputAction.go,
      autocorrect: false,
      enableSuggestions: false,
      textCapitalization: TextCapitalization.none,
    );
  }
}

class _BottomBar extends StatelessWidget {
  const _BottomBar();

  @override
  Widget build(BuildContext context) {
    final state = context.watch<BrowserState>();
    final tab = state.currentTab;
    return Container(
      color: Theme.of(context).colorScheme.surface,
      child: SafeArea(
        top: false,
        child: BottomAppBar(
          child: SizedBox(
            height: 56,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                IconButton(
                  tooltip: '戻る',
                  icon: const Icon(Icons.arrow_back),
                  onPressed: tab?.canGoBack == true ? state.goBack : null,
                ),
                IconButton(
                  tooltip: '進む',
                  icon: const Icon(Icons.arrow_forward),
                  onPressed: tab?.canGoForward == true ? state.goForward : null,
                ),
                IconButton(
                  tooltip: 'ブックマーク',
                  icon: Icon(
                    state.isBookmarkedCurrent()
                        ? Icons.bookmark
                        : Icons.bookmark_border,
                  ),
                  onPressed: state.toggleBookmarkCurrent,
                ),
                IconButton(
                  tooltip: 'タブ',
                  icon: Stack(
                    clipBehavior: Clip.none,
                    children: [
                      const Icon(Icons.tab),
                      Positioned(
                        right: -6,
                        top: -6,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 5,
                            vertical: 1,
                          ),
                          decoration: BoxDecoration(
                            color: Theme.of(context).colorScheme.primary,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            '${state.tabs.length}',
                            style: TextStyle(
                              color: Theme.of(context).colorScheme.onPrimary,
                              fontSize: 10,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  onPressed: () => Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const TabsOverviewPage()),
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
