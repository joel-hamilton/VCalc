import React, { useContext } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

import { Context } from "../Context";
import { useTheme } from "../themes";
import {
  IBackspace,
  IDimensions,
  IInsertAtSelection,
  ISetDisplay,
  ITheme,
  IWrapString,
} from "../types";

const createStyles = ({ colors }: ITheme, dimensions: IDimensions) =>
  StyleSheet.create<any>({
    keypad: {
      flex: 3,
      flexDirection: "row",
      flexWrap: "wrap",
      backgroundColor: colors.button,
    },
    keypadEditMode: {
      display: "none",
    },
    keypadItem: ({ pressed }) => ({
      backgroundColor: pressed ? colors.buttonPressed : colors.button,
      height: "25%",
      flexBasis: "33.333333%",
      alignItems: "center",
      justifyContent: "center",
    }),
    buttonText: {
      fontSize: 24,
      color: colors.text,
    },
  } as { [name: string]: ViewStyle });

const Keypad = ({ insertAtSelection, setTotal }) => {
  const [context] = useContext(Context);
  const theme = useTheme();
  const styles = createStyles(theme, context.dimensions);
  const keypad = [
    { text: 7, onPress: () => insertAtSelection("7") },
    { text: 8, onPress: () => insertAtSelection("8") },
    { text: 9, onPress: () => insertAtSelection("9") },
    { text: 4, onPress: () => insertAtSelection("4") },
    { text: 5, onPress: () => insertAtSelection("5") },
    { text: 6, onPress: () => insertAtSelection("6") },
    { text: 1, onPress: () => insertAtSelection("1") },
    { text: 2, onPress: () => insertAtSelection("2") },
    { text: 3, onPress: () => insertAtSelection("3") },
    { text: 0, onPress: () => insertAtSelection("0") },
    {
      text: ".",
      onPress: () => insertAtSelection("."),
    },
    {
      text: "=",
      onPress: setTotal,
    },
  ];

  return (
    <View
      style={{
        ...styles.keypad,
        // ...(context.isEditMode ? styles.keypadEditMode : {}),
      }}
    >
      {keypad.map((key) => (
        <Pressable
          key={key.text}
          style={styles.keypadItem}
          onPress={key.onPress}
        >
          <Text style={styles.buttonText}>{key.text}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default Keypad;
