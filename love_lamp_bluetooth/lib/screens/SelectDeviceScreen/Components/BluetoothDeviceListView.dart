import 'package:flutter/material.dart';
import 'package:flutter_bluetooth_serial/flutter_bluetooth_serial.dart';
import 'package:love_lamp_bluetooth/screens/SelectDeviceScreen/Components/BluetoothDeviceTile.dart';

// This widget is the listView to show a list of some bluetooth List
// it just gets a list and shows a list of the objects
// in the view BluetoothDeviceTile
class BluetoothDeviceList extends StatelessWidget {
  const BluetoothDeviceList({
    Key? key,
    required this.devices,
  }) : super(key: key);

  final List<BluetoothDevice> devices;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      itemCount: devices.length,
      itemBuilder: ((context, index) {
        var device = devices[index];
        return BluetoothDeviceTile(
          device: device,
        );
      }),
    );
  }
}
