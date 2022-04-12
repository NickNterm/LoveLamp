import 'package:flutter/material.dart';
import 'package:love_lamp_bluetooth/colors.dart';

// This widget is just a button that shows turns off the lamp
class ExpandedButton extends StatelessWidget {
  const ExpandedButton({
    Key? key,
    required this.text,
    required this.onPress,
  }) : super(key: key);
  final String text;
  final Function onPress;
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Ink(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(10),
                  color: kPrimaryColor,
                  boxShadow: [
                    BoxShadow(
                      color: kPrimaryColor.withOpacity(0.5),
                      blurRadius: 10,
                    ),
                  ],
                ),
                height: 50,
                child: InkWell(
                  borderRadius: BorderRadius.circular(10),
                  onTap: () {
                    onPress(const Color(0X00000000));
                  },
                  child: Center(
                      child: Text(
                    text,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  )),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
