import { columnTransformDependencies } from "mathjs";
import React from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { Context } from "../Context";

import { useTheme } from "../themes";
import { IVariable } from "../types";

const createStyles = ({ colors }) =>
  StyleSheet.create<any>({
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
  } as { [name: string]: ViewStyle });

const VariableScrollView = ({ onInsertVariable }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [context, { ctxAddVariable, ctxDeleteVariable }] =
    React.useContext(Context);
  const [editingVariableIndex, setEditingVariableIndex] = React.useState(-1);

  return (
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
            onInsertVariable(varName, { type: "variable", varName });
          }}
        >
          <Text style={styles.variableText}>
            {varName} {/* TODO add value preview too */}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default VariableScrollView;
