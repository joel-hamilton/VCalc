import { evaluate } from "mathjs";
import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Context } from "../Context";
import {Pictos} from "../classes";
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
import VariablesView from "./VariablesView";
import Keypad from "./Keypad";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Variables } from "../classes";

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
  const variablesTranslateY = useSharedValue(0);

  React.useEffect(() => {
    try {
      const res = doEvaluate();
      const interpolationString = display.toString();
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

    ctxAddVariable(new Variables([{ varName, nodes, key: generateHex(8) }]));
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

  const animatedSwiperStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withSpring(variablesTranslateY.value, {
          overshootClamping: true,
        }),
      },
    ],
    backgroundColor: interpolateColor(
      variablesTranslateY.value,
      [0, context.dimensions.translateYEditMode],
      [theme.colors.card, theme.colors.background]
    ),
  }));

  const animatedEditorStyles = useAnimatedStyle(() => ({
    opacity: interpolate(variablesTranslateY.value, [0, context.dimensions.translateYEditMode], [0, 1])
  }));

  const animatedInputStyles = useAnimatedStyle(() => ({
    opacity: interpolate(
      variablesTranslateY.value,
      [context.dimensions.translateYEditMode, 0],
      [0, 1]
    ),
  }));

  return (
    <View style={styles.main}>
      <View style={styles.display}>
        <View style={{ alignItems: "flex-end" }}>
          <View style={{ height: 50 }}>
            {!!display.length && (
              <Pressable
                testID="add-variable"
                hitSlop={15}
                style={styles.addVariableButton}
                onPress={() => addVariable()}
              >
                <MaterialCommunityIcons
                  name="plus-circle-outline"
                  size={32}
                  color={theme.colors.primary}
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
            marginBottom: context.dimensions.variablesViewPeek
          }}
        >
          <View>
            <Text
              testID="interpolation-preview"
              style={styles.secondaryDisplay}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {interpolationPreview}
            </Text>
          </View>
          <Text
            testID="preview"
            style={{ ...styles.secondaryDisplay, paddingLeft: 50 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {preview}
          </Text>
        </View>
      </View>
      <VariablesView
        onInsertVariable={insertAtSelection}
        variablesTranslateY={variablesTranslateY}
        animatedEditorStyles={animatedEditorStyles}
        animatedSwiperStyles={animatedSwiperStyles}
      />
      {/* {!context.isEditMode && ( */}
      <Animated.View style={[styles.inputWrapper, animatedInputStyles]}>
        <Keypad setTotal={setTotal} insertAtSelection={insertAtSelection} />
        <Operators
          setDisplay={setDisplay}
          insertAtSelection={insertAtSelection}
          backspace={backspace}
          wrapString={wrapString}
        />
      </Animated.View>
      {/* )} */}
    </View>
  );
};

export default Calculator;
