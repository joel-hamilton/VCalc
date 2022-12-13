import { cloneDeep } from 'lodash';
import React from 'react';
import {
    KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
    ViewStyle
} from 'react-native';

import { Context } from '../Context';
import Pictos from '../Pictos';
import { useTheme } from '../themes';
import { IBackspace, IDimensions, IInsertAtSelection, ISelection, ITheme } from '../types';
import Display from './Display';
import Operators from './Operators';

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
      alignItems: "center",
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
    inputWrapper: {
      alignItems: "flex-end",
      padding: 10,
    },
    inputLabel: {
      fontWeight: "bold",
    },
    input: {
      flexDirection: "row",
      justifyContent: "flex-end",
      position: "relative",
      width: "100%",
      borderWidth: 1,
      borderColor: colors.primary,
      marginTop: 5,
      marginBottom: 10,
      paddingLeft: 10,
      paddingRight: 10,
    },
  } as { [name: string]: ViewStyle });

const VariableScrollView = ({ onInsertVariable }) => {
  const theme = useTheme();
  const inputRef = React.createRef();
  const [context, { ctxSetIsEditMode, ctxUpdateVariable, ctxDeleteVariable }] =
    React.useContext(Context);
  const styles = createStyles(theme, context.dimensions);
  const [editingVariableIndex, setEditVariableIndex] = React.useState(-1);
  const [display, setDisplay] = React.useState<Pictos>(new Pictos([]));
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

  const [activeInputIndex, _setActiveInputIndex] = React.useState(0);
  const [inputStates, setInputStates] = React.useState(initialInputStates);

  const setActiveInputIndex = (index: number) => {
    _setActiveInputIndex(index);
  };

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
      const nameDisplay = context.variables[editingVariableIndex].varName;
      const valueDisplay = context.variables[editingVariableIndex].nodes;

      setInputStates([
        {
          name: "name",
          display: nameDisplay,
          selection: { start: nameDisplay.length, end: nameDisplay.length },
        },
        {
          name: "value",
          display: valueDisplay,
          selection: { start: undefined, end: undefined },
        },
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

  const setSelectionOnInput = (selection: ISelection, inputIndex: number) => {
    console.log({ selection, inputIndex });
    const inputStatesClone = cloneDeep(inputStates);
    inputStatesClone[inputIndex].selection = selection;
    inputStatesClone[Math.abs(inputIndex - 1)].selection = {
      start: undefined,
      end: undefined,
    };

    console.log({
      inputStatesCloneSelections: inputStatesClone.map((i) => i.selection),
    });
    setInputStates(inputStatesClone);
    setActiveInputIndex(inputIndex);
  };

  /**
   * Do a partial update of input states
   * @param inputState
   * @param forceInputIndex sometimes necessary to force update of the non-current input
   */
  const updateCurrentInputState = (
    inputState: Partial<InputState>,
    forceInputIndex?: number
  ) => {
    const useIndex = forceInputIndex || activeInputIndex;

    const newInputStates = inputStates
      .slice(0, useIndex)
      .concat([{ ...inputStates[useIndex], ...inputState }])
      .concat(inputStates.slice(useIndex + 1));

    setInputStates(newInputStates);

    // TODO re-enable and test this
    // ctxUpdateVariable(newInputStates[useIndex], editingVariableIndex); 
  };

  const insertAtSelection:IInsertAtSelection = (str: string, isVariable: boolean = false) => {
    const [newDisplay, newSelection] = inputStates[
      activeInputIndex
    ].display.insertAtSelection(
      new Pictos([
        {
          type: isVariable ? "variable" : "string",
          nodes: str,
        },
      ]),
      inputStates[activeInputIndex].selection
    );

    updateCurrentInputState({ display: newDisplay, selection: newSelection });
  };

  const backspace:IBackspace = () => {
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
            {context.variables.map(({ varName, nodes, key }, index) => (
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
                      insertAtSelection(key, true);
                    }
                  } else {
                    onInsertVariable(key, true);
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
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Name</Text>
                <View style={styles.input}>
                  <Display
                    baseZIndex={2}
                    displayNodes={inputStates[InputStateKeys.NAME].display}
                    selection={inputStates[InputStateKeys.NAME].selection}
                    onSelectionChange={(selection) =>
                      setSelectionOnInput(selection, InputStateKeys.NAME)
                    }
                  />
                </View>
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Value</Text>
                <View style={styles.input}>
                  <Display
                    baseZIndex={2}
                    displayNodes={inputStates[InputStateKeys.VALUE].display}
                    selection={inputStates[InputStateKeys.VALUE].selection}
                    onSelectionChange={(selection) =>
                      setSelectionOnInput(selection, InputStateKeys.VALUE)
                    }
                  />
                </View>
              </View>

              <TextInput
                ref={inputRef}
                autoFocus={true}
                autoCorrect={false}
                autoComplete="off"
                spellCheck={false}
                style={{ position: "absolute", left: -99999 }}
                onKeyPress={({ nativeEvent: { key } }) => {
                  console.log({ key });
                  // This doesn't work on androids with hard keyboards!!
                  if (key === "Backspace") {
                    backspace();
                  } else {
                    insertAtSelection(key);
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
