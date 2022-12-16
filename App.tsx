import * as React from "react";
import { SafeAreaView, StatusBar, useColorScheme } from "react-native";
import { NavigationContainer, Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useKeyboard, useDimensions } from "@react-native-community/hooks";

import Calculator from "./src/components/Calculator";
import { MyDarkTheme, MyDefaultTheme } from "./src/themes";

import { Context, createActions } from "./src/Context";
import Header from "./src/components/Header";
import { IContext, IDimensions } from "./src/types";

const Stack = createNativeStackNavigator();

const getDimensions = ({ width, height }, { keyboardShown }): IDimensions => {
  const headerH = 40;
  const variablesViewVisibleH = 40;

  return {
    screenH: height,
    screenW: width,
    headerH,
    displayH: height / 2,
    inputH: height / 2 - variablesViewVisibleH,
    variablesViewH: height / 2,
    keyboardVisible: keyboardShown,
    operatorEditModeH: 70,
  };
};

const App = () => {
  const scheme = useColorScheme();
  const dimensions = useDimensions().window;
  const keyboard = useKeyboard();
  const [theme, setTheme] = React.useState(MyDefaultTheme);
  const [context, setContext] = React.useState<IContext>({
    useDarkTheme: undefined,
    variables: [],
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

    loadUserPrefs();
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
    </Context.Provider>
  );
};

module.exports = App;
