import React from "react";
import { View, Image } from "react-native";

function SplashScreen(props) {
  return (
    <View style={{ flex: 1, backgroundColor: "#0f1617" }}>
      <Image style={{ width: 300, height: 300 }} />
    </View>
  );
}

export default SplashScreen;
