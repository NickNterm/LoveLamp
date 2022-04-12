import 'package:flutter/material.dart';
import 'package:love_lamp_bluetooth/colors.dart';
import 'package:love_lamp_bluetooth/screens/PickColorScreen/Components/ColorBlock.dart';

class ColorBlockGridView extends StatelessWidget {
  const ColorBlockGridView({
    Key? key,
    required this.onItemPress,
  }) : super(key: key);
  final Function onItemPress;

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      itemCount: colorList.length,
      itemBuilder: (context, index) {
        return Padding(
          padding: const EdgeInsets.all(10),
          child: ColorBlockPick(
            color: colorList[index],
            sendData: onItemPress,
          ),
        );
      },
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
      ),
    );
  }
}
