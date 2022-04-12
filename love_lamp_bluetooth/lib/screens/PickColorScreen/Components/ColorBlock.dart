import 'package:flutter/material.dart';

class ColorBlockPick extends StatelessWidget {
  const ColorBlockPick({
    Key? key,
    required this.color,
    required this.sendData,
  }) : super(key: key);
  final Color color;
  final Function sendData;
  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(10),
      child: Ink(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          color: color,
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.5),
              blurRadius: 10,
            ),
          ],
        ),
        width: 50,
        height: 50,
        child: InkWell(
          borderRadius: BorderRadius.circular(10),
          onTap: () {
            sendData(color);
          },
        ),
      ),
    );
  }
}
