import { cloneDeep } from "lodash";
import { evaluate } from "mathjs";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";

import NewInput from './NewInput';

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "../themes";
import { ISelection, IVariable } from "../types";
import {
  backspaceAtSelection,
  getNextVariableName,
  insertAtSelection,
  interpolateString,
  wrapAtSelection,
} from "../utils";
import { convertSelection, unconvertSelection } from "../utils/selection";
import EditVariableModal from "./EditVariableModal";

const createStyles = ({ colors }) =>
  StyleSheet.create<any>({
    main: {
      flex: 1,
    },
    display: {
      padding: 20,
      flex: 8,
      alignItems: "flex-end",
      justifyContent: "space-between",
    },
    addVariableButton: ({ pressed }) => ({
      //
    }),
    primaryDisplay: {
      fontSize: 36,
      color: colors.text,
    },
    secondaryDisplay: {
      fontSize: 18,
      color: colors.secondaryText,
    },
    variablesScrollView: {
      height: 20,
    },
    variables: {
      minWidth: "100%",
      backgroundColor: colors.card,
      flexDirection: "row",
      alignItems: "center",
      padding: 5,
    },
    variable: ({ pressed }) => ({
      border: colors.border,
      padding: 10,
      height: 40,
      borderRadius: 10,
      backgroundColor: pressed
        ? colors.buttonVariablePressed
        : colors.buttonVariable,
      marginRight: 5,
    }),
    variableText: {
      color: colors.text,
    },
    inputWrapper: {
      flex: 12,
      flexDirection: "row",
    },
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
    keypad: {
      flex: 3,
      flexDirection: "row",
      flexWrap: "wrap",
      backgroundColor: colors.button,
    },
    keypadItem: ({ pressed }) => ({
      backgroundColor: pressed ? colors.buttonPressed : colors.button,
      height: "25%",
      flexBasis: "33.333333%",
      alignItems: "center",
      justifyContent: "center",
    }),
    operators: {
      flex: 1,
      backgroundColor: colors.buttonHighlight,
    },
    operatorsItem: ({ pressed }) => ({
      backgroundColor: pressed
        ? colors.buttonHighlightPressed
        : colors.buttonHighlight,
      height: "20%",
      alignItems: "center",
      justifyContent: "center",
    }),
  } as { [name: string]: ViewStyle });

const Calculator = () => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const [variables, setVariables] = React.useState<IVariable[]>([]);
  const [editingVariableIndex, setEditingVariableIndex] = React.useState(-1);
  const [display, setDisplay] = React.useState("");
  const [preview, setPreview] = React.useState("");
  const [interpolationPreview, setInterpolationPreview] = React.useState("");
  const [selection, setSelection] = React.useState<ISelection>({
    start: undefined,
    end: undefined,
  });

  React.useEffect(() => {
    try {
      const res = doEvaluate();
      const interpolationString = interpolateString(display, variables);
      setInterpolationPreview(interpolationString);
      if (res) {
        setPreview(res + "");
      } else {
        setPreview("");
      }
    } catch (e) {
      setPreview("");
    }
  }, [display, variables]);

  const insertString = (str) => {
    const [newDisplay, newSelection] = insertAtSelection(
      str,
      display,
      selection
    );
    setDisplay(newDisplay);
    setSelection(newSelection);
  };

  const wrapString = (prependStr, appendStr) => {
    const [newDisplay, newSelection] = wrapAtSelection(
      display,
      prependStr,
      appendStr,
      selection
    );
    setDisplay(newDisplay);
    setSelection(newSelection);
  };

  const backspace = () => {
    const [newDisplay, newSelection] = backspaceAtSelection(display, selection);
    setDisplay(newDisplay);
    setSelection(newSelection);
  };

  const addVariable = (varName = null, value = null) => {
    if (varName && !isNaN(varName)) {
      alert("Cannot use number as a variable name");
      return;
    }

    if (varName === null) {
      varName = getNextVariableName("var", variables);
    }

    if (value === null) {
      value = display; // TODO allow adding selection as value
    }

    setVariables(variables.concat({ varName, value }));
  };

  const updateVariable = (variableIndex, updates) => {
    const tempVariables = cloneDeep(variables);
    tempVariables[variableIndex] = {
      ...tempVariables[variableIndex],
      ...updates,
    };

    setVariables(tempVariables);
  };

  const deleteVariable = (variableIndex) => {
    setVariables(
      variables
        .slice(0, variableIndex)
        .concat(variables.slice(variableIndex + 1))
    );
  };

  const doEvaluate = () => {
    try {
      const interpolatedDisplay = interpolateString(display, variables);
      const result = evaluate(interpolatedDisplay);
      if (result === undefined) {
        return "";
      }

      return result + "";
    } catch (e) {
      //
    }
  };

  const keypad = [
    { text: 7, onPress: () => insertString("7") },
    { text: 8, onPress: () => insertString("8") },
    { text: 9, onPress: () => insertString("9") },
    { text: 4, onPress: () => insertString("4") },
    { text: 5, onPress: () => insertString("5") },
    { text: 6, onPress: () => insertString("6") },
    { text: 1, onPress: () => insertString("1") },
    { text: 2, onPress: () => insertString("2") },
    { text: 3, onPress: () => insertString("3") },
    { text: 0, onPress: () => insertString("0") },
    {
      text: ".",
      onPress: () => insertString("."),
    },
    {
      text: "=",
      onPress: () => {
        const val = doEvaluate();
        setDisplay(val);
      },
    },
  ];

  const operators = [
    {
      text: "DEL",
      secondaryText: "CLR",
      onLongPress: () => setDisplay(""),
      onPress: backspace,
    },
    {
      text: "÷",
      secondaryText: "√",
      onPress: () => insertString("/"),
      onLongPress: () => insertString("√"),
    },
    {
      text: "x",
      secondaryText: "^",
      onPress: () => insertString("*"),
      onLongPress: () => insertString("^"),
    },
    {
      text: "-",
      secondaryText: "!",
      onPress: () => insertString("-"),
      onLongPress: () => insertString("!"),
    },
    {
      text: "+",
      secondaryText: "()",
      onPress: () => insertString("+"),
      onLongPress: () => wrapString("(", ")"),
    },
  ];

  return (
    <>
      <View style={styles.main}>
        <View style={styles.display}>
          <View style={{ alignItems: "flex-end" }}>
            <View style={{ height: 50 }}>
              {!!display && (
                <Pressable
                  hitSlop={15}
                  style={styles.addVariableButton}
                  onPress={() => addVariable()}
                >
                  <MaterialCommunityIcons
                    name="plus-circle-outline"
                    size={32}
                    color={theme.colors.buttonHighlight}
                  />
                </Pressable>
              )}
            </View>
            <NewInput display={display} selection={selection} onSelectionChange={setSelection} />
            {/* <View>
              <TextInput
                // autoFocus={true}
                autoCorrect={false}
                spellCheck={false}
                selectionColor={theme.colors.primary}
                textAlignVertical="top"
                multiline={true}
                showSoftInputOnFocus={false}
                style={styles.primaryDisplay}
                onSelectionChange={({ nativeEvent: { selection } }) =>
                  setSelection(convertSelection(display, selection))
                }
              >
                {display}
              </TextInput>
            </View> */}
          </View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              {!!variables.length && (
                <Text
                  style={styles.secondaryDisplay}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {interpolationPreview}
                </Text>
              )}
            </View>
            <Text
              style={{ ...styles.secondaryDisplay, paddingLeft: 50 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {preview}
            </Text>
          </View>
        </View>
        {!!Object.keys(variables).length && (
          <ScrollView
            keyboardShouldPersistTaps="always"
            horizontal={true}
            style={styles.variablesScrollView}
            contentContainerStyle={styles.variables}
          >
            {variables.map(({ varName, value }, index) => (
              <Pressable
                key={varName}
                style={styles.variable}
                onLongPress={() => setEditingVariableIndex(index)}
                onPress={() => {
                  insertString(varName);
                }}
              >
                <Text style={styles.variableText}>
                  {varName} ({value})
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
        <View style={styles.inputWrapper}>
          <View style={styles.keypad}>
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
          <View style={styles.operators}>
            {operators.map((operator) => (
              <Pressable
                key={operator.text}
                style={styles.operatorsItem}
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
        </View>
      </View>
      <EditVariableModal
        variable={
          editingVariableIndex >= 0
            ? variables[editingVariableIndex]
            : undefined
        }
        onUpdate={(updates) => updateVariable(editingVariableIndex, updates)}
        onDelete={() => deleteVariable(editingVariableIndex)}
        onClose={() => setEditingVariableIndex(-1)}
      />
    </>
  );
};

export default Calculator;
