import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../state/browser_state.dart';

class TabsOverviewPage extends StatelessWidget {
  const TabsOverviewPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Platform.isIOS ? const _IosTabs() : const _AndroidTabs();
  }
}

class _IosTabs extends StatelessWidget {
  const _IosTabs();

  @override
  Widget build(BuildContext context) {
    final state = context.watch<BrowserState>();
    return CupertinoPageScaffold(
      navigationBar: const CupertinoNavigationBar(middle: Text('タブ')),
      child: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: GridView.builder(
                padding: const EdgeInsets.all(12),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: 0.75,
                ),
                itemCount: state.tabs.length,
                itemBuilder: (context, index) {
                  final tab = state.tabs[index];
                  return GestureDetector(
                    onTap: () async {
                      await state.switchToTab(index);
                      if (context.mounted) {
                        Navigator.pop(context);
                      }
                    },
                    child: Stack(
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            color: CupertinoColors.systemGrey5,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          padding: const EdgeInsets.all(8),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                tab.title ?? tab.url,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 6),
                              Expanded(
                                child: Container(
                                  alignment: Alignment.center,
                                  child: const Icon(
                                    CupertinoIcons.doc_plaintext,
                                    size: 44,
                                  ),
                                ),
                              ),
                              Text(
                                tab.url,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: CupertinoColors.systemGrey,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Positioned(
                          right: 6,
                          top: 6,
                          child: CupertinoButton(
                            padding: EdgeInsets.zero,
                            onPressed: () => state.closeTab(index),
                            child: const Icon(
                              CupertinoIcons.xmark_circle_fill,
                              color: CupertinoColors.systemGrey,
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
            CupertinoButton.filled(
              onPressed: () async {
                await state.addNewTab();
                if (context.mounted) {
                  Navigator.pop(context);
                }
              },
              child: const Text('新しいタブ'),
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }
}

class _AndroidTabs extends StatelessWidget {
  const _AndroidTabs();

  @override
  Widget build(BuildContext context) {
    final state = context.watch<BrowserState>();
    return Scaffold(
      appBar: AppBar(title: const Text('タブ')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: state.tabs.length,
              itemBuilder: (context, index) {
                final tab = state.tabs[index];
                return ListTile(
                  title: Text(
                    tab.title ?? tab.url,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  subtitle: Text(
                    tab.url,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  trailing: IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => state.closeTab(index),
                  ),
                  onTap: () async {
                    await state.switchToTab(index);
                    if (context.mounted) {
                      Navigator.pop(context);
                    }
                  },
                );
              },
            ),
          ),
          SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: FilledButton.icon(
                onPressed: () async {
                  await state.addNewTab();
                  if (context.mounted) {
                    Navigator.pop(context);
                  }
                },
                icon: const Icon(Icons.add),
                label: const Text('新しいタブ'),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
