import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import colors from "../colors/colors";

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function LampItem({ item, navigation }) {
  const [indColor, setColor] = useState(colors.backgroundColor2);

  useEffect(() => {
    if (item.password != "") {
      fetch(
        "http://130.185.234.70:3336/SmartHouse/" +
          item.token +
          "/" +
          item.password +
          "/"
      )
        .then((response) => response.json())
        .then((json) => setColor(rgbToHex(json.R, json.G, json.B)))
        .catch((error) => console.error(error));
    }
  }, []);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (item.password != "") {
      fetch(
        "http://130.185.234.70:3336/SmartHouse/" +
          item.token +
          "/" +
          item.password +
          "/"
      )
        .then((response) => response.json())
        .then((json) => setColor(rgbToHex(json.R, json.G, json.B)))
        .catch((error) => console.error(error));
    }
  }, [isFocused]);
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate("ShowDevice", {
          device: item,
          currentColor: item.password != "" ? indColor : "",
        });
      }}
    >
      <View
        style={{
          backgroundColor: colors.backgroundColor2,
          marginHorizontal: 20,
          marginTop: 12,
          padding: 10,
          height: 50,
          borderRadius: 10,
          flexDirection: "row",
        }}
      >
        <Image
          source={require("../assets/lampIcon.png")}
          style={{ height: 30, width: 30, resizeMode: "contain" }}
        />
        <Text
          style={{
            marginStart: 10,
            fontSize: 18,
            textAlignVertical: "center",
            color: colors.white,
          }}
        >
          {item.name}
        </Text>
        <View
          style={{
            backgroundColor: indColor,
            width: "15%",
            position: "absolute",
            right: 10,
            top: 10,
            borderRadius: 5,
            height: "100%",
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
export default LampItem;
