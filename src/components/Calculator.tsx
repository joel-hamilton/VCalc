import { evaluate } from "mathjs";
import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Context } from "../Context";
import Pictos from "../Pictos";
import { useTheme } from "../themes";
import {
  IBackspace,
  IDimensions,
  IInsertAtSelection,
  IPicto,
  ISelection,
  ITheme,
  IWrapString,
} from "../types";
import { getNextVariableName } from "../utils/pictosHelpers";
import { generateHex } from "../utils/string";
import Display from "./Display";
import Operators from "./Operators";
import VariableScrollView from "./VariablesScrollView";

const createStyles = ({ colors }: ITheme, dimensions: IDimensions) =>
  StyleSheet.create<any>({
    main: {
      flex: 1,
    },
    display: {
      padding: 20,
      flex: 1,
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

    inputWrapper: {
      height: dimensions.inputH,
      flexDirection: "row",
    },
    buttonText: {
      fontSize: 24,
      color: colors.text,
    },
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
  } as { [name: string]: ViewStyle });

const Calculator = () => {
  const theme = useTheme();
  const [context, { ctxAddVariable, ctxDeleteVariable }] =
    React.useContext(Context);
  const styles = React.useMemo(
    () => createStyles(theme, context.dimensions),
    [theme]
  );
  const [display, setDisplay] = React.useState<Pictos>(new Pictos());
  const [preview, setPreview] = React.useState("");
  const [interpolationPreview, setInterpolationPreview] = React.useState("");
  const [selection, setSelection] = React.useState<ISelection>({
    start: 0,
    end: 0,
  });

  React.useEffect(() => {
    try {
      const res = doEvaluate();
      const interpolationString = display.toString();
      console.log({ interpolationPreview });
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

  const setTotal = () => {
    const res = doEvaluate();
    const nodes = res.split("").map(
      (char): IPicto => ({
        type: "string",
        nodes: char,
      })
    );

    const total = new Pictos(nodes);

    const [newDisplay, newSelection] = display.insertAtSelection(total, {
      start: 0,
      end: display.length,
    });
    setDisplay(newDisplay);
    setSelection(newSelection);
  };

  const insertAtSelection: IInsertAtSelection = (
    str: string,
    isVariable: boolean = false
  ) => {
    const pictos = new Pictos([
      {
        type: isVariable ? "variable" : "string",
        nodes: str,
      },
    ]);

    const [newDisplay, newSelection] = display.insertAtSelection(
      pictos,
      selection
    );

    setDisplay(newDisplay);
    setSelection(newSelection);
  };

  const wrapString: IWrapString = (prependStr, appendStr) => {
    const [newDisplay, newSelection] = display.wrapAtSelection(
      prependStr,
      appendStr,
      selection
    );
    setDisplay(newDisplay);
    setSelection(newSelection);
  };

  const backspace: IBackspace = () => {
    const [newDisplay, newSelection] = display.backspaceAtSelection(selection);
    setDisplay(newDisplay);
    setSelection(newSelection);
  };

  const addVariable = (varName?: Pictos, nodes?: Pictos) => {
    if (varName && !isNaN(varName as any)) {
      alert("Cannot use number as a variable name");
      return;
    }

    if (varName === undefined) {
      varName = getNextVariableName("var", context.variables);
    }

    if (nodes === undefined) {
      nodes = display; // TODO allow adding selection as value
    }

    ctxAddVariable({ varName, nodes, key: generateHex(8) });
  };

  const doEvaluate = () => {
    try {
      const interpolatedDisplay = display.toString(context.variables);
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

  return (
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
            baseZIndex={1}
          />
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 30 // TODO get rid of magic number, this should be based the visible height of variables bove keyboard
          }}
        >
          <View>
            <Text
              style={styles.secondaryDisplay}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {interpolationPreview}
            </Text>
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
      <VariableScrollView onInsertVariable={insertAtSelection} />
      {!context.isEditMode && (
        <View style={styles.inputWrapper}>
          <View
            style={{
              ...styles.keypad,
              ...(context.isEditMode ? styles.keypadEditMode : {}),
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
          <Operators
            setDisplay={setDisplay}
            insertAtSelection={insertAtSelection}
            backspace={backspace}
            wrapString={wrapString}
          />
        </View>
      )}
    </View>
  );
};

export default Calculator;
