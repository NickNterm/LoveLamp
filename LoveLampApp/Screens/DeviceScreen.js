import { useIsFocused } from "@react-navigation/native";
import React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import colors from "../colors/colors";
import { Entypo } from "@expo/vector-icons";

function DeviceScreen({ route, navigation }) {
  const [item, setItem] = React.useState(route.params.device);
  const [colorsData, setData] = React.useState([]);
  const [indColor, setIndColor] = React.useState(route.params.currentColor);
  if (indColor != "") {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          {item.screen ? (
            <Entypo
              name="typing"
              size={30}
              color={colors.white}
              onPress={() => {
                navigation.navigate("sendMessage", { device: item });
              }}
            />
          ) : null}
          <View
            style={{
              width: 60,
              marginRight: 10,
              marginLeft: 20,
              height: 30,
              borderRadius: 5,
              backgroundColor: indColor,
            }}
          ></View>
        </View>
      ),
    });
  }

  React.useEffect(() => {
    fetch("http://130.185.234.70:3336/SmartHouse/" + item.token + "/")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }, []);

  const isFocused = useIsFocused();

  React.useEffect(() => {
    fetch("http://130.185.234.70:3336/SmartHouse/" + item.token + "/")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }, [isFocused]);

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  function setColor(hex) {
    if (item.password != "") {
      setIndColor(hex);
      console.log(hex);
      var details = {
        Red: hexToRgb(hex).r,
        Green: hexToRgb(hex).g,
        Blue: hexToRgb(hex).b,
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      let data = {
        method: "POST",
        body: formBody,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      fetch(
        "http://130.185.234.70:3336/SmartHouse/" +
          item.token +
          "/" +
          item.password +
          "/",
        data
      )
        .then((response) => response.json())
        .then((json) => console.log(json))
        .catch((error) => console.error(error));
    }
  }
  return (
    <View style={{ backgroundColor: colors.backgroundColor, flex: 1 }}>
      <View>
        {colorsData.length > 0 ? (
          <FlatList
            style={{
              marginTop: 10,
              marginBottom: item.password != "" ? 60 : 0,
            }}
            data={colorsData}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback
                onPress={() => {
                  setColor(item.color);
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.backgroundColor2,
                    marginHorizontal: 10,
                    marginTop: 10,
                    padding: 10,
                    height: 50,
                    borderRadius: 10,
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      width: "85%",
                      fontSize: 17,
                      textAlignVertical: "center",
                      color: colors.white,
                    }}
                  >
                    {item.meaning}
                  </Text>
                  <View
                    style={{
                      backgroundColor: item.color,
                      width: "15%",
                      borderRadius: 5,
                      height: "100%",
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            )}
          />
        ) : null}
      </View>
      {colorsData.length == 0 ? (
        <View
          style={{
            backgroundColor: colors.backgroundColor2,
            marginHorizontal: 10,
            marginTop: 10,
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 17,
              lineHeight: 30,
              textAlignVertical: "center",
              color: colors.white,
            }}
          >
            There are no colors yet ):
          </Text>
        </View>
      ) : null}
      {item.password != "" ? (
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate("AddColor", { device: item });
          }}
        >
          <View
            style={{
              marginHorizontal: 10,
              marginTop: 15,
              height: 40,
              backgroundColor: colors.tintRed,
              borderRadius: 10,
              position: "absolute",
              bottom: 15,
              width: "90%",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                textAlign: "center",
                textAlignVertical: "center",
                lineHeight: 40,
                color: colors.white,
                fontWeight: "bold",
              }}
            >
              Add Color
            </Text>
          </View>
        </TouchableWithoutFeedback>
      ) : null}
    </View>
  );
}

export default DeviceScreen;
