import 'package:flutter/material.dart';
import 'package:love_lamp_bluetooth/colors.dart';
import 'package:love_lamp_bluetooth/screens/SelectDeviceScreen/selectDeviceScreen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Love Lamp V2',
      themeMode: ThemeMode.dark,
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        appBarTheme:
            const AppBarTheme().copyWith(backgroundColor: Colors.grey[850]),
        scaffoldBackgroundColor: Colors.grey[900],
        primarySwatch: kPrimaryColor,
      ),
      theme: ThemeData(
        brightness: Brightness.light,
        primarySwatch: kPrimaryColor,
      ),
      home: const SelectDeviceScreen(),
    );
  }
}
