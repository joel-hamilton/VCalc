import React, { useState } from "react";
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
import {
  IContext,
  IDimensions,
  IInsertOptions,
  INode,
  ISelection,
  ITheme,
} from "../types";
import { Context } from "../Context";

import { useTheme } from "../themes";
import Display from "./Display";
import {
  backspaceAtSelection,
  insertAtSelection as arrayInsertAtSelection,
  wrapAtSelection,
} from "../utils/array";
import Operators from "./Operators";
import Pictos from "../utils/Pictos";

enum InputStateKeys {
  NAME = 0,
  VALUE = 1,
}

const createStyles = ({ colors }: ITheme, dimensions: IDimensions) =>
  StyleSheet.create<any>({
    wrapper: {
      height: dimensions.variableScrollViewH,
      backgroundColor: colors.card,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      // padding: 5,
    },
    wrapperEdit: {
      height: "100%",
    },
    variablesView: {
      justifyContent: "space-between",
      flexDirection: "row",
    },
    variables: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
    },
    variable: {
      border: colors.border,
      padding: 10,
      height: 30,
      borderRadius: 10,
      marginRight: 5,
      backgroundColor: colors.variableBackground,
    },
    variableEditing: {
      backgroundColor: colors.secondaryText,
    },
    variableText: {
      lineHeight: 13,
      color: colors.text,
    },
    editView: {
      // position:'relative',
      flex: 1,
      backgroundColor: "purple",
      marginBottom: dimensions.operatorEditModeH,
    },
  } as { [name: string]: ViewStyle });

const VariableScrollView = ({ onInsertVariable }) => {
  const theme = useTheme();
  const inputRef = React.createRef();
  const [context, { ctxSetIsEditMode, ctxUpdateVariable, ctxDeleteVariable }] =
    React.useContext(Context);
  const styles = createStyles(theme, context.dimensions);
  const [editingVariableIndex, setEditVariableIndex] = React.useState(-1);
  const [display, setDisplay] = React.useState<INode[]>([]);
  const [selection, setSelection] = React.useState<ISelection>({
    start: 0,
    end: 0,
  });

  interface InputState {
    name: string;
    display: Pictos;
    selection: ISelection;
  }

  const initialInputStates: InputState[] = [
    {
      name: "name",
      display: new Pictos(),
      selection: { start: undefined, end: undefined },
    },
    {
      name: "value",
      display: new Pictos(),
      selection: { start: undefined, end: undefined },
    },
  ];

  const [activeInputIndex, setActiveInputIndex] = React.useState(0);
  const [inputStates, setInputStates] = React.useState(initialInputStates);

  // set edit mode and show keyboard
  React.useEffect(() => {
    const isEditMode = editingVariableIndex >= 0;
    ctxSetIsEditMode(isEditMode ? true : false);

    if (inputRef.current === null) {
      return;
    }

    if (isEditMode) {
      // open keyboard
      inputRef.current.focus();

      // update display/selection
      const newDisplay =
        inputStates[activeInputIndex].name === "name"
          ? context.variables[editingVariableIndex].varName
          : context.variables[editingVariableIndex].nodes;
      const newSelection = { start: newDisplay.length, end: newDisplay.length };
      setInputStates([
        { name: "name", display: newDisplay, selection: newSelection },
      ]);
    } else {
      // close keyboard
      inputRef.current.blur();

      // reset focused elem
      setActiveInputIndex(0);
    }
  }, [editingVariableIndex]);

  React.useEffect(() => {
    if (context.isEditMode && !context.dimensions.keyboardVisible) {
      setEditVariableIndex(-1);
    }
  }, [context.dimensions.keyboardVisible]);

  const updateCurrentInputState = (inputState: Partial<InputState>) => {
    const newInputStates = inputStates
      .slice(0, activeInputIndex)
      .concat([{ ...inputStates[activeInputIndex], ...inputState }])
      .concat(inputStates.slice(activeInputIndex + 1));

    setInputStates(newInputStates);

    // ctxUpdateVariable(); // TODO
  };

  const insertAtSelection = (str: Pictos, options?: IInsertOptions) => {
    // TODO de-duplicate this logic
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

    const [newDisplay, newSelection] = inputStates[
      activeInputIndex
    ].display.insertAtSelection(
      new Pictos([
        {
          type: options.type,
          nodes: str,
          ...(options.varName ? { varName: options.varName } : {}),
        },
      ]),
      inputStates[activeInputIndex].selection
    );

    updateCurrentInputState({ display: newDisplay, selection: newSelection });
  };

  const backspace = () => {
    const [newDisplay, newSelection] = inputStates[
      activeInputIndex
    ].display.backspaceAtSelection(inputStates[activeInputIndex].selection);
    updateCurrentInputState({ display: newDisplay, selection: newSelection });
  };

  return (
    <View
      style={{
        ...styles.wrapper,
        ...(context.isEditMode ? styles.wrapperEdit : {}),
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        enabled={Platform.OS === "ios"}
      >
        <View style={styles.variablesView}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            horizontal={true}
            contentContainerStyle={styles.variables}
          >
            {context.variables.map(({ varName, nodes }, index) => (
              <Pressable
                key={index}
                style={{
                  ...styles.variable,
                  ...(context.isEditMode ? styles.variableEditing : {}),
                  ...(index === editingVariableIndex
                    ? { backgroundColor: theme.colors.variableBackground }
                    : {}),
                }}
                onLongPress={() => setEditVariableIndex(index)}
                onPress={() => {
                  if (context.isEditMode) {
                    if (
                      index !== editingVariableIndex &&
                      activeInputIndex !== InputStateKeys.NAME
                    ) {
                      // TODO insertAtSelecetion only handles chars, add an addPictosAtSelection fn
                      // insertAtSelection(varName, { type: "variable", varName });
                    }
                  } else {
                    onInsertVariable(varName, { type: "variable", varName });
                  }
                }}
              >
                <Text style={styles.variableText}>
                  {varName.toString()} {/* TODO add value preview too */}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable onPress={() => setEditVariableIndex(-1)}>
            <Text style={{ fontSize: 30 }}>x</Text>
          </Pressable>
        </View>
        {editingVariableIndex >= 0 /* not context.isEditMode on purpose*/ && (
          <View style={styles.editView}>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  position: "relative",
                  width: "100%",
                }}
              >
                <Display
                  baseZIndex={2}
                  displayNodes={inputStates[activeInputIndex].display}
                  selection={inputStates[activeInputIndex].selection}
                  onSelectionChange={(selection) => {
                    if (activeInputIndex !== InputStateKeys.NAME) {
                      setActiveInputIndex(InputStateKeys.NAME);
                    }
                    setTimeout(() =>
                      // TODO
                      setSelection(selection)
                    );
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  position: "relative",
                  width: "100%",
                }}
              >
                <Display
                  baseZIndex={2}
                  displayNodes={inputStates[activeInputIndex].display}
                  selection={inputStates[activeInputIndex].selection}
                  onSelectionChange={(selection) => {
                    if (activeInputIndex !== InputStateKeys.VALUE) {
                      setActiveInputIndex(InputStateKeys.VALUE);
                    }
                    setTimeout(() =>
                      // TODO
                      setSelection(selection)
                    );
                  }}
                />
              </View>

              <TextInput
                ref={inputRef}
                autoFocus={true}
                autoCorrect={false}
                autoComplete="off"
                spellCheck={false}
                style={{ position: "absolute", left: -99999 }}
                onKeyPress={({ nativeEvent: { key } }) => {
                  // This doesn't work on androids with hard keyboards!!
                  if (key === "Backspace") {
                    backspace();
                  } else if (key.length === 1) {
                    insertAtSelection(
                      new Pictos([{ type: "string", nodes: key }])
                    );
                  }
                }}
              />
            </View>

            <Operators
              setDisplay={setDisplay}
              insertAtSelection={insertAtSelection}
              backspace={backspace}
              wrapString={() => {
                /*TODO*/
              }}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default VariableScrollView;
