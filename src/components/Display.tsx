import { isEqual } from "lodash";
import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

import { useTheme } from "../themes";
import { ILayout, INode, ISelection, OperatorsWithExtraSpace } from "../types";
import Caret from "./Caret";
import VariableNode from "./VariableNode";

const fontSize = 32;
const textHeight = 40;
const xAdjust = -1;
const yAdjust = 3;
const caretHeight = fontSize + 4;
const initialCaretLayout = {
  width: 2,
  height: caretHeight,
  left: xAdjust,
  top: yAdjust,
};

const createStyles = ({ colors }) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      flexWrap: "wrap",
      minHeight: textHeight,
    },
    text: {
      fontSize,
    },
    caret: {
      position: "absolute",
      color: colors.primary,
      zIndex: 1,
    },
  } as { [name: string]: ViewStyle });

const Display = ({
  displayNodes,
  selection,
  onSelectionChange,
}: {
  displayNodes: INode[];
  selection: ISelection;
  onSelectionChange: (sel: ISelection) => void;
}) => {
  const textContainerRef = React.useRef(null);
  const textsRef = React.useRef([]);
  const [repositioningCaret, setRepositioningCaret] = React.useState(false);
  const [layout, setLayout] = React.useState<ILayout[]>([]);
  const [caretLayout, setCaretLayout] =
    React.useState<ILayout>(initialCaretLayout);

  const theme = useTheme();
  const styles = createStyles(theme);

  React.useEffect(() => {
    if (!layout.length || selection.start === 0) {
      return setCaretLayout(initialCaretLayout);
    }

    const charLayout = layout[selection.start - 1];
    const nextCharLayout = layout[selection.start];
    if (charLayout === undefined) {
      console.log({
        Problem: "UNDEFINED charLayout",
        layout,
        selectionStart: selection.start,
        displayNodes,
      });
      return;
    }

    const charRight = charLayout.left + charLayout.width;
    const spaceUntilNextChar = nextCharLayout
      ? nextCharLayout.left - charRight
      : 10;
    const left = charRight + xAdjust + spaceUntilNextChar / 2;
    const charTop = charLayout.top + yAdjust;
    const newCaretLayout = { ...caretLayout, left, top: charTop };
    if (!isEqual(caretLayout, newCaretLayout)) {
      console.log({ newCaretLayout });
      setCaretLayout(newCaretLayout);
    }
  }, [selection, layout]);

  // Prevent caret flickering during reposition
  React.useEffect(() => {
    setRepositioningCaret(true);
    const timeout = setTimeout(() => setRepositioningCaret(false), 100);
    return () => clearTimeout(timeout);
  }, [caretLayout]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      textsRef.current = textsRef.current.slice(0, displayNodes.length);
      const charLayouts = [];
      if (textsRef.current.length && textContainerRef.current) {
        textsRef.current.forEach((textRef, index) => {
          if(textRef === null) {
            console.log({
              Problem: "null text ref",
              textsRef: textsRef.current,
            });
            return;
          }

          textRef.measureLayout(
            textContainerRef.current,
            (left, top, width, height) => {
              const charLayout = { left, top, width, height };
              charLayouts.push(charLayout);
              if (index === displayNodes.length - 1) {
                setLayout((layout) => {
                  return layout.length === charLayouts.length
                    ? layout
                    : charLayouts;
                });
              }
            },
            (e) => {
              console.error(e);
            }
          );
        });
      } else {
        setLayout([]);
      }
    });

    return () => clearInterval(interval);
  }, [displayNodes, textsRef, textContainerRef]);

  const selectAll = () => {
    onSelectionChange({ start: 0, end: displayNodes.length });
  };

  const getTextNodeProps = (index) => {
    return {
      ref: (el) => (textsRef.current[index] = el),
      onLongPress: selectAll,
      onPress: ({ nativeEvent }) => {
        const charWidth = layout[index].width;
        const touchX = nativeEvent.locationX;
        const caretPos = touchX < charWidth / 2 ? index : index + 1;
        onSelectionChange({ start: caretPos, end: caretPos });
      },
    };
  };

  return (
    <View ref={textContainerRef} style={styles.wrapper}>
      {displayNodes.map((node, index) => (
        <React.Fragment key={index}>
          {selection.start === selection.end && index === selection.start && (
            <Caret
              visible={!repositioningCaret}
              style={{ ...styles.text, ...styles.caret, ...caretLayout }}
              onLongPress={selectAll}
            />
          )}

          <Pressable
            // this will pick up events that don't land exactly on the Text/VariableNode components
            onPress={getTextNodeProps(index).onPress}
            onLongPress={getTextNodeProps(index).onLongPress}
          >
            {node.type === "string" && (
              <Text
                {...getTextNodeProps(index)}
                style={{
                  ...styles.text,
                  height: textHeight,
                  paddingRight:
                    (node.nodes as string) in OperatorsWithExtraSpace ? 5 : 0,
                  paddingLeft:
                    (node.nodes as string) in OperatorsWithExtraSpace ? 5 : 0,
                  backgroundColor:
                    selection.start !== selection.end &&
                    index >= selection.start &&
                    index < selection.end
                      ? theme.colors.primary
                      : "transparent",
                }}
              >
                {node.nodes as string}
              </Text>
            )}
            {node.type === "variable" && (
              <VariableNode
                textNodeProps={getTextNodeProps(index)}
                fontSize={(styles.text as any).fontSize}
                defaultTextHeight={textHeight}
                variableNode={node}
                isSelected={
                  selection.start !== selection.end &&
                  index >= selection.start &&
                  index < selection.end
                }
              />
            )}
          </Pressable>
        </React.Fragment>
      ))}
      {selection.start === selection.end &&
        selection.start === displayNodes.length && (
          <Caret
            visible={!repositioningCaret}
            style={{ ...styles.text, ...styles.caret, ...caretLayout }}
            onLongPress={selectAll}
          />
        )}
    </View>
  );
};

export default Display;
