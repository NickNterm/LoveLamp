import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bluetooth_serial/flutter_bluetooth_serial.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:love_lamp_bluetooth/colors.dart';
import 'package:love_lamp_bluetooth/screens/pickColorScreen.dart';

class SelectDeviceScreen extends StatefulWidget {
  const SelectDeviceScreen({Key? key}) : super(key: key);

  @override
  State<SelectDeviceScreen> createState() => _SelectDeviceScreenState();
}

class _SelectDeviceScreenState extends State<SelectDeviceScreen> {
  late FlutterBluetoothSerial flutterbt;
  StreamSubscription<BluetoothDiscoveryResult>? _streamSubscription;
  List<BluetoothDiscoveryResult> results =
      List<BluetoothDiscoveryResult>.empty(growable: true);
  List<BluetoothDevice> devices = [];
  bool isDiscovering = false;

  @override
  void initState() {
    super.initState();
    flutterbt = FlutterBluetoothSerial.instance;
    _startDiscovery();
    getDevices();
  }

  void _startDiscovery() async {
    await flutterbt.cancelDiscovery();
    setState(() {
      isDiscovering = true;
    });
    _streamSubscription = flutterbt.startDiscovery().listen((r) {
      setState(() {
        final existingIndex = results.indexWhere(
            (element) => element.device.address == r.device.address);
        if (existingIndex >= 0) {
          results[existingIndex] = r;
        } else {
          results.add(r);
        }
      });
    });

    _streamSubscription!.onDone(() {
      setState(() {
        isDiscovering = false;
      });
    });
  }

  void getDevices() async {
    List<BluetoothDevice> dummylist = await flutterbt.getBondedDevices();
    setState(() {
      devices.clear();
      devices.addAll(dummylist);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Select Device"),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        scrollDirection: Axis.vertical,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.all(20),
              child: Text(
                "Connect To A Device: ",
                style: TextStyle(
                  fontSize: 20,
                  color: kPrimaryColor,
                ),
              ),
            ),
            devices.isNotEmpty
                ? ListView.builder(
                    physics: const NeverScrollableScrollPhysics(),
                    shrinkWrap: true,
                    itemCount: devices.length,
                    itemBuilder: ((context, index) {
                      return ListTile(
                        leading: const Icon(
                          Icons.bluetooth_rounded,
                          color: kPrimaryColor,
                        ),
                        title: Text(devices[index].name.toString()),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => PickColorScreen(
                                btDevice: devices[index],
                              ),
                            ),
                          );
                        },
                      );
                    }),
                  )
                : const SpinKitPouringHourGlass(
                    strokeWidth: 1.5,
                    size: 60,
                    color: kPrimaryColor,
                  ),
            Row(
              children: [
                const Padding(
                  padding: EdgeInsets.fromLTRB(20, 20, 10, 20),
                  child: Text(
                    "Available Devices: ",
                    style: TextStyle(
                      fontSize: 20,
                      color: kPrimaryColor,
                    ),
                  ),
                ),
                isDiscovering
                    ? const SpinKitRing(
                        color: kPrimaryColor,
                        lineWidth: 2,
                        size: 20,
                      )
                    : IconButton(
                        onPressed: () {
                          _startDiscovery();
                        },
                        icon: const Icon(Icons.refresh_rounded),
                      )
              ],
            ),
            ListView.builder(
              physics: const NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              itemCount: results.length,
              itemBuilder: ((context, index) {
                return ListTile(
                  leading: const Icon(
                    Icons.bluetooth_rounded,
                    color: kPrimaryColor,
                  ),
                  title: Text(results[index].device.name.toString()),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => PickColorScreen(
                          btDevice: results[index].device,
                        ),
                      ),
                    );
                  },
                );
              }),
            )
          ],
        ),
      ),
    );
  }
}
