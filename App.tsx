import * as React from "react";
import { StatusBar, useColorScheme } from "react-native";
import { NavigationContainer, Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Calculator from "./components/Calculator";
import { MyDarkTheme, MyDefaultTheme } from "./themes";
import HeaderRight from "./components/HeaderRight";

import { Context } from "./Context";
import Header from "./components/Header";

const Stack = createNativeStackNavigator();

const App = () => {
  const scheme = useColorScheme();
  const [theme, setTheme] = React.useState(MyDefaultTheme);
  const [context, setContext] = React.useState({ useDarkTheme: undefined });

  React.useEffect(() => {
    const loadUserPrefs = async () => {
      const userPrefs =
        JSON.parse(await AsyncStorage.getItem("@userPrefs")) || {};

      if (userPrefs.useDarkTheme !== undefined) {
        setContext({ useDarkTheme: userPrefs.useDarkTheme });
      } else if (context.useDarkTheme === undefined) {
        setContext({ useDarkTheme: scheme === "dark" });
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
    <Context.Provider value={[context, setContext]}>
      <NavigationContainer theme={theme as unknown as Theme}>
        <Stack.Navigator
          screenOptions={{
            header: Header,
          }}
        >
          <Stack.Screen name="VCalc" component={Calculator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>
  );
};

module.exports = App;
