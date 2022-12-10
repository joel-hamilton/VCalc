import { evaluate } from "mathjs";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import Display from "./Display";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "../themes";
import { INode, ISelection, IVariable } from "../types";
import { getNextVariableName } from "../utils/string";
import {
  backspaceAtSelection,
  insertAtSelection as arrayInsertAtSelection,
  wrapAtSelection,
  interpolate,
} from "../utils/array";
import EditVariableModal from "./EditVariableModal";
import { Context } from "../Context";

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
      backgroundColor: colors.variableBackground,
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
  const [context, { ctxAddVariable, ctxDeleteVariable }] =
    React.useContext(Context);
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  // const [variables, setVariables] = React.useState<IVariable[]>([]);
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
      const interpolationString = interpolate(display, context.variables, true);
      console.log({ interpolationString, display });
      setInterpolationPreview(interpolationString);
      if (res) {
        setPreview(res + "");
      } else {
        setPreview("");
      }
    } catch (e) {
      setPreview("");
    }
  }, [display, context.variables]);

  interface IInsertOptions {
    type?: "string" | "variable";
    varName?: string;
    displayValue?: string;
  }

  const setTotal = (total: string) => {
    const res = doEvaluate();
    const nodes = res.split("").map(
      (char): INode => ({
        type: "string",
        nodes: char,
      })
    );

    const [newDisplay, newSelection] = arrayInsertAtSelection(nodes, display, {
      start: 0,
      end: display.length,
    });
    setDisplay(newDisplay);
    setSelection(newSelection);
  };

  const insertAtSelection = (str: string, options?: IInsertOptions) => {
    if (!options) {
      options = {};
    }

    if (!options.type) {
      options.type = "string";
    }

    if (options.type === "string" && str.length > 1) {
      console.error(">1 length strings not implemented yet!");
      return;
    }

    if (options.type === "variable" && !options.varName) {
      console.error("Variable name required");
      return;
    }

    const [newDisplay, newSelection] = arrayInsertAtSelection(
      [
        {
          type: options.type,
          nodes: str,
          ...(options.varName ? { varName: options.varName } : {}),
          ...(options.displayValue
            ? { displayValue: options.displayValue }
            : {}),
        },
      ],
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

  const addVariable = (varName: string = null, nodes: INode[] = null) => {
    if (varName && !isNaN(varName as any)) {
      alert("Cannot use number as a variable name");
      return;
    }

    if (varName === null) {
      varName = getNextVariableName("var", context.variables);
    }

    if (nodes === null) {
      nodes = display; // TODO allow adding selection as value
    }

    ctxAddVariable({ varName, nodes });
  };

  const doEvaluate = () => {
    try {
      const interpolatedDisplay = interpolate(display, context.variables);
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
      onPress: setTotal,
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
            <Display
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
              {!!context.variables
                .length /* TODO this should show only when a variable exists in the current display */ && (
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
        {!!Object.keys(context.variables).length && (
          <ScrollView
            keyboardShouldPersistTaps="always"
            horizontal={true}
            style={styles.variablesScrollView}
            contentContainerStyle={styles.variables}
          >
            {context.variables.map(({ varName, nodes }, index) => (
              <Pressable
                key={varName}
                style={styles.variable}
                onLongPress={() => setEditingVariableIndex(index)}
                onPress={() => {
                  insertAtSelection(varName, { type: "variable", varName });
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
            ? context.variables[editingVariableIndex]
            : undefined
        }
        onUpdate={(updates) => {}}
        // onUpdate={(updates) => updateVariable(editingVariableIndex, updates)}
        onDelete={() => ctxDeleteVariable(editingVariableIndex)}
        onClose={() => setEditingVariableIndex(-1)}
      />
    </>
  );
};

export default Calculator;
