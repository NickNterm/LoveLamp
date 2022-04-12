import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_bluetooth_serial/flutter_bluetooth_serial.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:love_lamp_bluetooth/colors.dart';
import 'package:love_lamp_bluetooth/screens/PickColorScreen/Components/ColorBlockGridView.dart';
import 'package:love_lamp_bluetooth/screens/PickColorScreen/Components/ExpandedButton.dart';
import 'package:love_lamp_bluetooth/showSnackBar.dart';
import 'package:love_lamp_bluetooth/widgets/TitleText.dart';

class PickColorScreen extends StatefulWidget {
  const PickColorScreen({Key? key, required this.btDevice}) : super(key: key);
  final BluetoothDevice btDevice;
  @override
  State<PickColorScreen> createState() => _PickColorScreenState();
}

class _PickColorScreenState extends State<PickColorScreen> {
  late BluetoothConnection connection;
  bool connected = false;

  void initConnection() async {
    try {
      connection = await BluetoothConnection.toAddress(widget.btDevice.address);
      if (connection.isConnected) {
        setState(() {
          connected = true;
        });
      }
    } catch (e) {
      showOnSnackBar(context, "Couldn't Connect With The Device");
      Navigator.pop(context);
    }
  }

  @override
  void initState() {
    super.initState();
    initConnection();
  }

  @override
  void dispose() {
    super.dispose();
    connection.dispose();
  }

  void sendColorData(Color color) async {
    List<int> list = "${color.red}.${color.green}.${color.blue}.n".codeUnits;
    Uint8List bytes = Uint8List.fromList(list);
    connection.output.add(bytes);
  }

  @override
  Widget build(BuildContext context) {
    Color pickedColor = kPrimaryColor;
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        title: Text(
          widget.btDevice.name.toString(),
        ),
      ),
      body: Center(
        child: connected
            ? SingleChildScrollView(
                scrollDirection: Axis.vertical,
                child: Column(
                  children: [
                    const Padding(
                      padding: EdgeInsets.all(20),
                      child: TitleText(
                        text: "Basic Colors",
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(10),
                      child: ColorBlockGridView(
                        onItemPress: sendColorData,
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.all(20),
                      child: TitleText(
                        text: "Pick Your Color",
                      ),
                    ),
                    ColorPicker(
                      pickerColor: pickedColor,
                      onColorChanged: (Color value) {
                        sendColorData(value);
                      },
                    ),
                    ExpandedButton(
                      text: "Turn Off",
                      onPress: sendColorData,
                    ),
                  ],
                ),
              )
            : const SpinKitPouringHourGlass(
                strokeWidth: 1.5,
                size: 60,
                color: kPrimaryColor,
              ),
      ),
    );
  }
}
