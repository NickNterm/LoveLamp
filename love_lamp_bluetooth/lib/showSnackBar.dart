import 'package:flutter/material.dart';

void showOnSnackBar(BuildContext context, String text) {
  final snackBar = SnackBar(
    content: Text(
      text,
    ),
  );
  ScaffoldMessenger.of(context).showSnackBar(snackBar);
}
