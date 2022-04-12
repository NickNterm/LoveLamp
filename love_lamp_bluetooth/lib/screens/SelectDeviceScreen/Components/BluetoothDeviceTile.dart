import 'package:flutter/material.dart';
import 'package:flutter_bluetooth_serial/flutter_bluetooth_serial.dart';
import 'package:love_lamp_bluetooth/colors.dart';
import 'package:love_lamp_bluetooth/screens/PickColorScreen/pickColorScreen.dart';

// This widget is shown inside the List View of the devices
// It just shows the device Name and an icon leading in the start
// If the user taps it goes to PickColorScreen and controls that device
class BluetoothDeviceTile extends StatelessWidget {
  const BluetoothDeviceTile({
    Key? key,
    required this.device,
  }) : super(key: key);
  final BluetoothDevice device;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: const Icon(
        Icons.bluetooth_rounded,
        color: kPrimaryColor,
      ),
      title: Text(device.name.toString()),
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => PickColorScreen(
              btDevice: device,
            ),
          ),
        );
      },
    );
  }
}
