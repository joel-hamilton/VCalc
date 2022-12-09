import React from "react";
import { Pressable, Text, View, StyleSheet, ViewStyle } from "react-native";
import { ILayout, INode, ISelection, IVariable } from "../types";
import { useTheme } from "../themes";
import Caret from "./Caret";
import { isEqual } from "lodash";

const createStyles = ({ colors }, fontSize) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.primary,
      color: colors.text,
      borderRadius: 5,
      marginLeft: 10,
      marginRight: 10,
    },
    text: {
      paddingTop: 5,
      paddingBottom: 5,
      paddingRight: 10,
      paddingLeft: 10,
      lineHeight: fontSize - 10,
      fontSize: fontSize - 10,
    },
  } as { [name: string]: ViewStyle });

const VariableNode = (
  { variableNode, textNodeProps, fontSize, isSelected }
) => {
  const theme = useTheme();
  const styles = createStyles(theme, fontSize);

  return (
    <Pressable onPress={textNodeProps.onPress} onLongPress={textNodeProps.onLongPress}>
      <View style={styles.wrapper}>
        <Text {...textNodeProps} style={styles.text}>
          {variableNode.varName}
        </Text>
      </View>
    </Pressable>
  );
};

export default VariableNode;
