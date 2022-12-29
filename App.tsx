import * as React from "react";
import { SafeAreaView, StatusBar, useColorScheme } from "react-native";
import { NavigationContainer, Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useKeyboard, useDimensions } from "@react-native-community/hooks";

import Calculator from "./src/components/Calculator";
import { MyDarkTheme, MyDefaultTheme } from "./src/themes";
import { variablesFromSerializedString } from "./src/utils/variablesHelpers";
import { Context, createActions } from "./src/Context";
import Header from "./src/components/Header";
import { IContext, IDimensions, IVariable } from "./src/types";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {Variables} from "./src/classes/Variables"
import { Pictos } from "./src/classes/Pictos";

const Stack = createNativeStackNavigator();

const getDimensions = ({ width, height }, { keyboardShown }): IDimensions => {
  const headerH = 40;
  const variablesViewPeek = 40;
  const displayH = height / 2;
  const inputH = height / 2 - variablesViewPeek;

  return {
    screenH: height,
    screenW: width,
    headerH,
    displayH,
    inputH,
    variablesViewH: height / 2,
    keyboardVisible: keyboardShown,
    operatorsHorizontalH: 70,
    variablesViewPeek,
    translateYEditMode: -1 * (inputH - variablesViewPeek),
  };
};

const App = () => {
  const scheme = useColorScheme();
  const dimensions = useDimensions().window;
  const keyboard = useKeyboard();
  const [theme, setTheme] = React.useState(MyDefaultTheme);
  const [context, setContext] = React.useState<IContext>({
    useDarkTheme: undefined,
    variables: new Variables(),
    currentValue: new Pictos(),
    dimensions: getDimensions(dimensions, keyboard),
    isEditMode: false,
  });

  const actions = createActions(setContext);

  React.useEffect(() => {
    actions.ctxSetDimensions(getDimensions(dimensions, keyboard));
  }, [dimensions, keyboard.keyboardShown]);

  React.useEffect(() => {
    const loadUserPrefs = async () => {
      const userPrefs =
        JSON.parse(await AsyncStorage.getItem("@userPrefs")) || {};

      if (userPrefs.useDarkTheme !== undefined) {
        actions.ctxSetUseDarkMode(userPrefs.useDarkTheme);
      } else if (context.useDarkTheme === undefined) {
        actions.ctxSetUseDarkMode(scheme === "dark");
      }
    };

    const loadVariables = async () => {
      await AsyncStorage.removeItem('@variables');
      const variablesSerialized = (await AsyncStorage.getItem("@variables")) || "[]";
      const variables = variablesFromSerializedString(variablesSerialized);
      actions.ctxSetVariables(variables);
    };

    loadUserPrefs();
    // loadVariables();
  }, []);

  React.useEffect(() => {
    AsyncStorage.setItem(
      "@userPrefs",
      JSON.stringify({ useDarkTheme: context.useDarkTheme })
    );
    setTheme(context.useDarkTheme ? MyDarkTheme : MyDefaultTheme);
    StatusBar.setBarStyle(
      context.useDarkTheme ? "light-content" : "dark-content"
    );
  }, [context.useDarkTheme]);

  return (
    <Context.Provider value={[context, actions]}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
          <NavigationContainer theme={theme as unknown as Theme}>
            <Stack.Navigator
              screenOptions={{
                header: Header,
              }}
            >
              <Stack.Screen name="VCalc" component={Calculator} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </GestureHandlerRootView>
    </Context.Provider>
  );
};

module.exports = App;
