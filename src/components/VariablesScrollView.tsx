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
import { IContext, IDimensions, ITheme } from "../types";
import { Context } from "../Context";

import { useTheme } from "../themes";

const createStyles = ({ colors }: ITheme, dimensions: IDimensions) =>
  StyleSheet.create<any>({
    wrapper: {
      height: dimensions.variableScrollViewH,
      backgroundColor: colors.card,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 5,
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
      flex: 1,
      backgroundColor: "purple",
      marginBottom: dimensions.operatorEditModeH,
    },
  } as { [name: string]: ViewStyle });

const VariableScrollView = ({ onInsertVariable }) => {
  const theme = useTheme();
  const inputRef = React.createRef();
  const [context, { ctxAddVariable, ctxDeleteVariable, ctxSetIsEditMode }] =
    React.useContext(Context);
  const styles = createStyles(theme, context.dimensions);
  const [editingVariableIndex, setEditVariableIndex] = React.useState(-1);

  React.useEffect(() => {
    const isEditMode = editingVariableIndex >= 0;
    ctxSetIsEditMode(isEditMode ? true : false);

    if (inputRef.current === null) {
      return;
    }

    if (isEditMode) {
      inputRef.current.focus();
    } else {
      inputRef.current.blur();
    }
  }, [editingVariableIndex]);

  React.useEffect(() => {
    if (context.isEditMode && !context.dimensions.keyboardVisible) {
      setEditVariableIndex(-1);
    }
  }, [context.dimensions.keyboardVisible]);

  return (
    <View
      style={{
        ...styles.wrapper,
        ...(context.isEditMode ? styles.wrapperEdit : {}),
      }}
    >
      <View style={styles.variablesView}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          horizontal={true}
          contentContainerStyle={styles.variables}
        >
          {context.variables.map(({ varName, nodes }, index) => (
            <Pressable
              key={varName}
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
                  setEditVariableIndex(index);
                } else {
                  onInsertVariable(varName, { type: "variable", varName });
                }
              }}
            >
              <Text style={styles.variableText}>
                {varName} {/* TODO add value preview too */}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <Pressable onPress={() => setEditVariableIndex(-1)}>
          <Text style={{ fontSize: 30 }}>x</Text>
        </Pressable>
      </View>
      {context.isEditMode && (
        <View style={styles.editView}>
          <TextInput
            ref={inputRef}
            autoFocus={true}
            // style={{ position: "absolute", left: -99999 }}
          />
        </View>
      )}
    </View>
  );
};

export default VariableScrollView;
