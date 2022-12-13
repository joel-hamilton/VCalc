import React, { useContext } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Context } from '../Context';
import { useTheme } from '../themes';

const createStyles = ({ colors }, fontSize) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.variableBackground,
      color: colors.text,
      borderRadius: 5,
      marginLeft: 5,
      marginRight: 5,
    },
    text: {
      paddingTop: 5,
      paddingBottom: 5,
      paddingRight: 10,
      paddingLeft: 10,
      fontSize: fontSize - 10,
      height: fontSize + 2,
      lineHeight: fontSize - 8,
    },
  } as { [name: string]: ViewStyle });

const VariableNode = ({
  variableKey,
  textNodeProps,
  fontSize,
  defaultTextHeight,
  isSelected,
}: {
  variableKey: string;
  textNodeProps: any;
  fontSize: number;
  defaultTextHeight: number;
  isSelected: boolean;
}) => {
  const [context] = useContext(Context);
  const findVariable = (key) => context.variables.find(v => v.key === key);
  const theme = useTheme();
  const styles = createStyles(theme, fontSize);
  const [variable, setVariable] = React.useState(findVariable(variableKey));

  return (
    <View
      style={{
        ...styles.wrapper,
        ...(isSelected
          ? {
              backgroundColor: theme.colors.primary,
              borderRadius: 0,
              marginLeft: 0,
              paddingLeft: 5,
              marginRight: 0,
              paddingRight: 5,
              height: defaultTextHeight,
              justifyContent: 'center'
            }
          : {}),
      }}
    >
      <Text {...textNodeProps} style={styles.text}>
        {variable.varName.toString()}
      </Text>
    </View>
  );
};

export default VariableNode;
