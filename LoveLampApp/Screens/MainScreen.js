import React, { useEffect, useState } from "react";
import { TouchableWithoutFeedback, View, Text, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import colors from "../colors/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native-gesture-handler";
import LampItem from "../Objects/LampItem";
import { useIsFocused } from "@react-navigation/native";

function MainScreen({ navigation }) {
  const [lampList, setLampList] = useState([]);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("Devices");
      var data = jsonValue != null ? JSON.parse(jsonValue) : null;
      console.log(data);
      if (data != null) {
        setLampList(data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const isFocused = useIsFocused();

  useEffect(() => {
    getData();
  }, [isFocused]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
      <FlatList
        data={lampList}
        extraData={lampList}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => (
          <LampItem item={item} navigation={navigation} />
        )}
      />

      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate("AddDevice");
        }}
      >
        <View
          style={{
            backgroundColor: colors.tintRed,
            width: 60,
            height: 60,
            position: "absolute",
            right: 20,
            bottom: 20,
            borderRadius: 200,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              textAlignVertical: "center",
              lineHeight: 57,
              fontSize: 40,
            }}
          >
            +
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <StatusBar style="light" />
    </View>
  );
}

export default MainScreen;
