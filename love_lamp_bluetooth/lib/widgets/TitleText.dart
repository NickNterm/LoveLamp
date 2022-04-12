import 'package:flutter/material.dart';
import 'package:love_lamp_bluetooth/colors.dart';

// Its simply a text with size 20 and has the primary color
class TitleText extends StatelessWidget {
  const TitleText({
    Key? key,
    required this.text,
  }) : super(key: key);
  final String text;
  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
        fontSize: 20,
        color: kPrimaryColor,
      ),
    );
  }
}
