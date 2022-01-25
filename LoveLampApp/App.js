import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import MainScreen from "./Screens/MainScreen";
import colors from "./colors/colors";
import AddDeviceSreen from "./Screens/AddDeviceSreen";
import DeviceScreen from "./Screens/DeviceScreen";
import AddColor from "./Screens/AddColor";
import SendMessage from "./Screens/SendMessage";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{
            title: "Love Lamp",
            headerShown: true,
            headerTintColor: colors.white,
            headerStyle: {
              backgroundColor: colors.backgroundColor2,
            },
            presentation: "transparentModal",
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Stack.Screen
          name="AddDevice"
          component={AddDeviceSreen}
          options={{
            title: "Add Love Lamp",
            headerShown: true,
            headerTintColor: colors.white,
            headerStyle: {
              backgroundColor: colors.backgroundColor2,
            },
            presentation: "transparentModal",
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
        <Stack.Screen
          name="AddColor"
          component={AddColor}
          options={{
            title: "AddColor",
            headerShown: true,
            headerTintColor: colors.white,
            headerStyle: {
              backgroundColor: colors.backgroundColor2,
            },
            presentation: "transparentModal",
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Stack.Screen
          name="ShowDevice"
          component={DeviceScreen}
          options={({ route }) => ({
            title: route.params.device.name,
            headerShown: true,
            headerTintColor: colors.white,
            headerStyle: {
              backgroundColor: colors.backgroundColor2,
            },
            presentation: "transparentModal",
            ...TransitionPresets.SlideFromRightIOS,
          })}
        />
        <Stack.Screen
          name="sendMessage"
          component={SendMessage}
          options={({ route }) => ({
            title: route.params.device.name,
            headerShown: true,
            headerTintColor: colors.white,
            headerStyle: {
              backgroundColor: colors.backgroundColor2,
            },
            ...TransitionPresets.ModalTransition,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
