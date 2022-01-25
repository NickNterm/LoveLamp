import React from "react";
import {
  TextInput,
  View,
  Text,
  TouchableWithoutFeedback,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../colors/colors";

function AddDeviceSreen({ navigation }) {
  const [Name, setNameInput] = React.useState("");
  const [Error, setError] = React.useState("");
  const [Token, setTokenInput] = React.useState("");
  const [Password, setPasswordInput] = React.useState("");
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      console.log(jsonValue);
      await AsyncStorage.setItem("Devices", jsonValue);
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async (objectToSave) => {
    try {
      const jsonValue = await AsyncStorage.getItem("Devices");
      var data = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (data != null) {
        data.push(objectToSave);
        storeData(data);
      } else {
        var list = [];
        list.push(objectToSave);
        storeData(list);
      }
    } catch (e) {
      console.log(e);
    }
  };

  function AddDevice() {
    if (Name == "" || Token == "") {
      setError("Please fill the Name and the Token of the device");
    } else {
      if (Password != "") {
        if (Password == "fineyougotitihateyou") {
          setError(
            "Haha I didn't except you to fall for that! <3 Wrong password "
          );
          var details = {
            Code: "Lydia_Fall_For_that",
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
            "http://130.185.234.70:3336/SmartHouse/" + Token + "/prank/",
            data
          )
            .then((response) => console.log("json"))
            .catch((error) => console.error(error));
        } else {
          fetch(
            "http://130.185.234.70:3336/SmartHouse/" +
              Token +
              "/" +
              Password +
              "/"
          )
            .then((response) => response.json())
            .then((json) => {
              var myNewLamp = {
                name: Name,
                token: Token,
                password: Password,
                screen: isEnabled,
              };
              getData(myNewLamp);
            })
            .catch((error) =>
              setError("You little Demon this is the wrong password")
            );
        }
      } else {
        var myNewLamp = {
          name: Name,
          token: Token,
          password: Password,
          screen: false,
        };
        getData(myNewLamp);
      }
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
        placeholder="Name"
        onChangeText={setNameInput}
      />
      <TextInput
        style={{
          margin: 10,
          color: colors.white,
          backgroundColor: colors.backgroundColor2,
          borderRadius: 10,
          height: 40,
          paddingHorizontal: 10,
        }}
        placeholderTextColor="#a6a6a6"
        placeholder="Token"
        onChangeText={setTokenInput}
      />
      <TextInput
        style={{
          marginHorizontal: 10,
          color: colors.white,
          backgroundColor: colors.backgroundColor2,
          borderRadius: 10,
          height: 40,
          paddingHorizontal: 10,
        }}
        placeholderTextColor="#a6a6a6"
        placeholder="Password"
        onChangeText={setPasswordInput}
      />
      <Text
        style={{
          color: colors.secondaryText,
          marginHorizontal: 10,
        }}
      >
        *Password is not required for basic usage
      </Text>
      <View style={{ flexDirection: "row", marginStart: 10 }}>
        <Text style={{ color: colors.white, textAlignVertical: "center" }}>
          Does this device has Screen?
        </Text>
        <Switch
          style={{ alignSelf: "flex-start" }}
          trackColor={{ false: "#767577", true: "#a3a3a3" }}
          thumbColor={isEnabled ? colors.tintRed : "#f4f3f4"}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <TouchableWithoutFeedback onPress={() => AddDevice()}>
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
            ADD DEVICE
          </Text>
        </View>
      </TouchableWithoutFeedback>
      {Error != "" ? (
        <View
          style={{
            backgroundColor: colors.errorRed,
            marginTop: 20,
            margin: 40,
            padding: 15,
            borderRadius: 10,
          }}
        >
          <Text
            style={{ color: colors.white, textAlign: "center", fontSize: 15 }}
          >
            {Error}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export default AddDeviceSreen;
