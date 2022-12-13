import React, { useContext } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { IContext, IDimensions, ITheme } from "../types";
import { Context } from "../Context";

import { useTheme } from "../themes";

const createStyles = ({ colors }: ITheme, dimensions: IDimensions) =>
  StyleSheet.create<any>({
    operators: {
      flex: 1,
      backgroundColor: colors.buttonHighlight,
    },
    operatorsEditMode: {
      // position: "absolute",
      // bottom: 0,
      // left: 0,
      // right: 0,
      flexDirection: "row",
      height: dimensions.operatorEditModeH,
      width: "100%",
      backgroundColor: colors.buttonHighlight,
      // marginBottom:
      //   Platform.OS === "ios" ? dimensions.operatorEditModeH - 5 : 0,
    },
    operatorsItem: ({ pressed }) => ({
      backgroundColor: pressed
        ? colors.buttonHighlightPressed
        : colors.buttonHighlight,
      height: "20%",
      alignItems: "center",
      justifyContent: "center",
    }),
    operatorsItemEditMode: ({ pressed }) => ({
      backgroundColor: pressed
        ? colors.buttonHighlightPressed
        : colors.buttonHighlight,
      height: "100%",
      width: "20%",
      alignItems: "center",
      justifyContent: "center",
    }),
  } as { [name: string]: ViewStyle });

const createOperators = ({
  setDisplay,
  insertAtSelection,
  backspace,
  wrapString,
}) => [
  {
    text: "DEL",
    secondaryText: "CLR",
    onLongPress: () => setDisplay([]),
    onPress: backspace,
  },
  {
    text: "÷",
    secondaryText: "√",
    onPress: () => insertAtSelection("/", { displayValue: "÷" }),
    onLongPress: () => insertAtSelection("√"),
  },
  {
    text: "x",
    secondaryText: "^",
    onPress: () => insertAtSelection("*", { displayValue: "x" }),
    onLongPress: () => insertAtSelection("^"),
  },
  {
    text: "-",
    secondaryText: "!",
    onPress: () => insertAtSelection("-"),
    onLongPress: () => insertAtSelection("!"),
  },
  {
    text: "+",
    secondaryText: "()",
    onPress: () => insertAtSelection("+"),
    onLongPress: () => wrapString("(", ")"),
  },
];

const Operators = ({
  setDisplay,
  insertAtSelection,
  backspace,
  wrapString,
}) => {
  const [context] = useContext(Context);
  const theme = useTheme();
  const styles = createStyles(theme, context.dimensions);
  const operators = createOperators({
    setDisplay,
    insertAtSelection,
    backspace,
    wrapString,
  });

  return (
    <View
      style={context.isEditMode ? styles.operatorsEditMode : styles.operators}
    >
      {operators.map((operator) => (
        <Pressable
          key={operator.text}
          style={({ pressed }) =>
            context.isEditMode
              ? styles.operatorsItemEditMode({ pressed })
              : styles.operatorsItem({ pressed })
          }
          onLongPress={operator.onLongPress}
          onPress={operator.onPress}
        >
          {!!operator.secondaryText && (
            <Text style={styles.buttonSecondaryText}>
              {operator.secondaryText}
            </Text>
          )}
          <Text style={styles.buttonText}>{operator.text}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default Operators;
