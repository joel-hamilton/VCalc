import React, { useContext } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { Context } from "../Context";
import Pictos from "../Pictos";
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
    buttonText: {
      fontSize: 24,
      color: colors.text,
    },
    buttonSecondaryText: {
      color: colors.text,
      position: "absolute",
      top: 5,
      right: 10,
    },
  } as { [name: string]: ViewStyle });

const createOperators = ({
  setDisplay,
  insertAtSelection,
  backspace,
  wrapString,
}: {
  setDisplay: ISetDisplay;
  insertAtSelection: IInsertAtSelection;
  backspace: IBackspace;
  wrapString: IWrapString;
}) => [
  {
    text: "DEL",
    secondaryText: "CLR",
    onLongPress: () => setDisplay(new Pictos([])),
    onPress: backspace,
  },
  {
    text: "÷",
    secondaryText: "√",
    onPress: () => insertAtSelection("/"),
    onLongPress: () => insertAtSelection("√"),
  },
  {
    text: "x",
    secondaryText: "^",
    onPress: () => insertAtSelection("*"),
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
    onLongPress: () =>
      wrapString(
        new Pictos([{ type: "string", nodes: "(" }]),
        new Pictos([{ type: "string", nodes: ")" }])
      ),
  },
];

const Operators = ({
  setDisplay,
  insertAtSelection,
  backspace,
  wrapString,
}: {
  setDisplay: ISetDisplay;
  insertAtSelection: IInsertAtSelection;
  backspace: IBackspace;
  wrapString: IWrapString;
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
