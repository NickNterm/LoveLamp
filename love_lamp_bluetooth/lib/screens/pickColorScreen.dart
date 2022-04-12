import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_bluetooth_serial/flutter_bluetooth_serial.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:love_lamp_bluetooth/colors.dart';
import 'package:love_lamp_bluetooth/showSnackBar.dart';

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
                      child: Text(
                        "Basic Colors",
                        style: TextStyle(
                          fontSize: 20,
                          color: kPrimaryColor,
                        ),
                      ),
                    ),
                    GridView.builder(
                      physics: const NeverScrollableScrollPhysics(),
                      shrinkWrap: true,
                      itemCount: colorList.length,
                      itemBuilder: (context, index) {
                        return Padding(
                          padding: const EdgeInsets.all(10),
                          child: ColorBlockPick(
                              color: colorList[index], sendData: sendColorData),
                        );
                      },
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 4,
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.all(20),
                      child: Text(
                        "Pick Your Color",
                        style: TextStyle(
                          fontSize: 20,
                          color: kPrimaryColor,
                        ),
                      ),
                    ),
                    ColorPicker(
                        pickerColor: pickedColor,
                        onColorChanged: (Color value) {
                          sendColorData(value);
                        }),
                    Row(
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
                                    sendColorData(const Color(0X00000000));
                                  },
                                  child: Center(
                                      child: Text(
                                    "Turn Off",
                                    style: TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.bold),
                                  )),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
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
