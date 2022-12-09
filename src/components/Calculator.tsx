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

import NewInput from "./NewInput";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "../themes";
import { INode, ISelection, IVariable } from "../types";
import { getNextVariableName } from "../utils";
import {
  backspaceAtSelection,
  insertAtSelection as arrayInsertAtSelection,
  wrapAtSelection,
  interpolate,
} from "../utils/array";
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
  const [display, setDisplay] = React.useState<INode[]>([]);
  const [preview, setPreview] = React.useState("");
  const [interpolationPreview, setInterpolationPreview] = React.useState("");
  const [selection, setSelection] = React.useState<ISelection>({
    start: 0,
    end: 0,
  });

  React.useEffect(() => {
    try {
      const res = doEvaluate();
      const interpolationString = interpolate(display, variables);
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

  const insertAtSelection = (
    str: string,
    type: "string" | "variable" = "string",
    varName: string = null
  ) => {
    if (type === 'string' && str.length > 1) {
      console.error(">1 length strings not implemented yet!");
      return;
    }

    if(type === 'variable' && !varName) {
      console.error('Variable name required');
      return;
    }

    const [newDisplay, newSelection] = arrayInsertAtSelection(
      [{ type, nodes: str, ...(varName ? { varName } : {}) }],
      display,
      selection
    );
    console.log({ str, newDisplay });
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

  const addVariable = (varName: string = null, nodes: INode[] = null) => {
    if (varName && !isNaN(varName as any)) {
      alert("Cannot use number as a variable name");
      return;
    }

    if (varName === null) {
      varName = getNextVariableName("var", variables);
    }

    if (nodes === null) {
      nodes = display; // TODO allow adding selection as value
    }

    setVariables(variables.concat({ varName, nodes }));
  };

  // TODO does this work with nested vars?
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
      const interpolatedDisplay = interpolate(display, variables);
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
      onPress: () => {
        // TODO
        // const val = doEvaluate();
        // setDisplay(val.split(""));
      },
    },
  ];

  const operators = [
    {
      text: "DEL",
      secondaryText: "CLR",
      onLongPress: () => setDisplay([]),
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
      onLongPress: () => wrapString("(", ")"),
    },
  ];

  return (
    <>
      <View style={styles.main}>
        <View style={styles.display}>
          <View style={{ alignItems: "flex-end" }}>
            <View style={{ height: 50 }}>
              {!!display.length && (
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
            <NewInput
              displayNodes={display}
              selection={selection}
              onSelectionChange={setSelection}
            />
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
            {variables.map(({ varName, nodes }, index) => (
              <Pressable
                key={varName}
                style={styles.variable}
                onLongPress={() => setEditingVariableIndex(index)}
                onPress={() => {
                  insertAtSelection(varName, "variable", varName);
                }}
              >
                <Text style={styles.variableText}>
                  {varName} {/* TODO add value preview too */}
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
