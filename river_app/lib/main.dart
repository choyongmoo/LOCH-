import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_windows/webview_windows.dart';
import 'package:window_manager/window_manager.dart';

final navigatorKey = GlobalKey<NavigatorState>();

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await windowManager.ensureInitialized();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: navigatorKey,
      home: const ExampleBrowser(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class ExampleBrowser extends StatefulWidget {
  const ExampleBrowser({super.key});

  @override
  State<ExampleBrowser> createState() => _ExampleBrowser();
}

class _ExampleBrowser extends State<ExampleBrowser> {
  final _controller = WebviewController();
  final List<StreamSubscription> _subscriptions = [];

  @override
  void initState() {
    super.initState();
    initPlatformState();
  }

  Future<void> initPlatformState() async {
    try {
      await _controller.initialize();

      _subscriptions.add(
        _controller.url.listen((url) {
          debugPrint("현재 URL: $url");
        }),
      );

      _subscriptions.add(
        _controller.containsFullScreenElementChanged.listen((flag) {
          debugPrint('전체화면 상태: $flag');
          windowManager.setFullScreen(flag);
        }),
      );

      await _controller.setBackgroundColor(Colors.white);
      await _controller.setPopupWindowPolicy(WebviewPopupWindowPolicy.deny);
      await _controller.loadUrl('https://d2m0eness3apiw.cloudfront.net/');

      if (!mounted) return;
      setState(() {});
    } on PlatformException catch (e) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        showDialog(
          context: context,
          builder: (_) => AlertDialog(
            title: const Text('오류 발생'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [Text('코드: ${e.code}'), Text('메시지: ${e.message}')],
            ),
            actions: [
              TextButton(
                child: const Text('확인'),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
            ],
          ),
        );
      });
    }
  }

  Widget compositeView() {
    if (!_controller.value.isInitialized) {
      return const Center(
        child: Text(
          '초기화되지 않음',
          style: TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold),
        ),
      );
    } else {
      return Stack(
        children: [
          Webview(_controller, permissionRequested: _onPermissionRequested),
          StreamBuilder<LoadingState>(
            stream: _controller.loadingState,
            builder: (context, snapshot) {
              if (snapshot.data == LoadingState.loading) {
                return const LinearProgressIndicator();
              } else {
                return const SizedBox.shrink();
              }
            },
          ),
        ],
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: compositeView(),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          await _controller.goBack();
        },
        child: const Icon(Icons.arrow_back),
      ),
    );
  }

  Future<WebviewPermissionDecision> _onPermissionRequested(
    String url,
    WebviewPermissionKind kind,
    bool isUserInitiated,
  ) async {
    if (kind == WebviewPermissionKind.camera ||
        kind == WebviewPermissionKind.microphone) {
      return WebviewPermissionDecision.allow;
    }

    final decision = await showDialog<WebviewPermissionDecision>(
      context: navigatorKey.currentContext!,
      builder: (BuildContext context) => AlertDialog(
        title: const Text('권한 요청'),
        content: Text('웹페이지가 "$kind" 권한을 요청했습니다. 허용하시겠습니까?'),
        actions: <Widget>[
          TextButton(
            onPressed: () =>
                Navigator.pop(context, WebviewPermissionDecision.deny),
            child: const Text('거절'),
          ),
          TextButton(
            onPressed: () =>
                Navigator.pop(context, WebviewPermissionDecision.allow),
            child: const Text('허용'),
          ),
        ],
      ),
    );

    return decision ?? WebviewPermissionDecision.none;
  }

  @override
  void dispose() {
    for (var s in _subscriptions) {
      s.cancel();
    }
    _controller.dispose();
    super.dispose();
  }
}
