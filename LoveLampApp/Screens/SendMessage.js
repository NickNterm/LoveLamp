import React from "react";
import { View, Text, TextInput } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import colors from "../colors/colors";

function SendMessage({ route, navigation }) {
  const [item, setItem] = React.useState(route.params.device);
  const [Message, setMessageInput] = React.useState("");
  function Send() {
    var details = {
      Message: Message,
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
        "/message/",
      data
    )
      .then((response) => response.json())
      .then((json) => navigation.goBack())
      .catch((error) => console.error(error));
  }
  return (
    <View style={{ backgroundColor: colors.backgroundColor, flex: 1 }}>
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
        placeholder="Message"
        onChangeText={setMessageInput}
      />

      <TouchableWithoutFeedback onPress={() => Send()}>
        <View
          style={{
            backgroundColor: colors.tintRed,
            marginHorizontal: 10,
            marginTop: 20,
            height: 40,
            borderRadius: 40,
          }}
        >
          <Text
            style={{
              lineHeight: 40,
              textAlign: "center",
              color: colors.white,
              fontSize: 17,
              fontWeight: "bold",
            }}
          >
            SEND
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default SendMessage;
