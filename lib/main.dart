import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'state/browser_state.dart';
import 'ui/android_browser_screen.dart';
import 'ui/ios_browser_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const RootApp());
}

class RootApp extends StatelessWidget {
  const RootApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => BrowserState()..initialize(),
      child: Builder(
        builder: (context) {
          if (Platform.isIOS) {
            return const CupertinoApp(
              debugShowCheckedModeBanner: false,
              home: IosBrowserScreen(),
            );
          }
          return MaterialApp(
            debugShowCheckedModeBanner: false,
            theme: ThemeData(
              colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
              useMaterial3: true,
            ),
            home: const AndroidBrowserScreen(),
          );
        },
      ),
    );
  }
}
