import React from "react";
import { Text, TextInput, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import ColorPicker from "react-native-wheel-color-picker";
import colors from "../colors/colors";

function AddColor({ route, navigation }) {
  const [item, setItem] = React.useState(route.params.device);
  const [Meaning, setMeaningInput] = React.useState("");
  const [Error, setError] = React.useState("");
  const [currentColor, setCurrentColor] = React.useState();
  function createColor() {
    if (Meaning != "") {
      var details = {
        Name: Meaning,
        Color: currentColor,
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
      fetch("http://130.185.234.70:3336/SmartHouse/" + item.token + "/", data)
        .then((response) => response.json())
        .then((json) => navigation.goBack())
        .catch((error) => console.error(error));
    }
  }
  return (
    <View
      style={{ flex: 1, backgroundColor: colors.backgroundColor, padding: 5 }}
    >
      <TextInput
        style={{
          marginTop: 20,
          marginHorizontal: 10,
          color: colors.white,
          backgroundColor: colors.backgroundColor2,
          borderRadius: 10,
          height: 40,
          paddingHorizontal: 10,
        }}
        placeholderTextColor="#a6a6a6"
        placeholder="Meaning Of Color"
        onChangeText={setMeaningInput}
      />
      <View
        style={{
          height: 400,
          marginHorizontal: 10,
          marginTop: 10,
          padding: 20,
          borderRadius: 10,
          backgroundColor: colors.backgroundColor2,
        }}
      >
        <ColorPicker
          color={colors.backgroundColor2}
          onColorChange={setCurrentColor}
          thumbSize={40}
          sliderSize={40}
          noSnap={true}
          row={false}
        />
      </View>
      <View
        style={{
          backgroundColor: currentColor,
          margin: 10,
          padding: 10,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <Text
          style={{
            color: colors.white,
            fontSize: 16,
            textAlign: "center",
            textAlignVertical: "center",
          }}
        >
          Final Color
        </Text>
      </View>
      <TouchableWithoutFeedback
        onPress={() => {
          createColor();
        }}
      >
        <View
          style={{
            backgroundColor: colors.tintRed,
            marginHorizontal: 10,
            marginTop: 5,
            borderRadius: 10,
            padding: 10,
          }}
        >
          <Text
            style={{
              color: colors.white,
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 17,
            }}
          >
            Create Color
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default AddColor;
