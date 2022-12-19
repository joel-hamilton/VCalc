import { isEqual } from "lodash";
import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

import {Pictos} from "../classes";
import { useTheme } from "../themes";
import { ILayout, ISelection, ITheme, OperatorsWithExtraSpace } from "../types";
import Caret from "./Caret";
import VariableNode from "./VariableNode";
import { isCaretAtIndex } from "../utils/selection";

const fontSize = 32;
const textHeight = 40;
const spacerWidth = 20;
const xAdjust = -1;
const yAdjust = 3;
const caretHeight = fontSize + 4;
const initialCaretLayout = {
  width: 2,
  height: caretHeight,
  left: xAdjust,
  top: yAdjust,
};

const createStyles = ({ colors }: ITheme, baseZIndex: number) =>
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
      color: colors.text,
    },
    caret: {
      position: "absolute",
      color: colors.primary,
      zIndex: baseZIndex + 1,
    },
  } as { [name: string]: ViewStyle });

const Display = ({
  displayNodes,
  selection,
  onSelectionChange,
  baseZIndex,
}: {
  displayNodes: Pictos;
  selection: ISelection;
  onSelectionChange: (sel: ISelection) => void;
  baseZIndex: number;
}) => {
  const textContainerRef = React.useRef(null);
  const textsRef = React.useRef([]);
  const [repositioningCaret, setRepositioningCaret] = React.useState(false);
  const [layout, setLayout] = React.useState<ILayout[]>([]);
  const [caretLayout, setCaretLayout] =
    React.useState<ILayout>(initialCaretLayout);

  const theme = useTheme();
  const styles = createStyles(theme, baseZIndex);

  React.useEffect(() => {
    if (!layout.length || selection.start === 0) {
      return setCaretLayout(initialCaretLayout);
    }

    const charLayout = layout[selection.start - 1];
    const nextCharLayout = layout[selection.start];
    if (charLayout === undefined) {
      return;
    }

    const charRight = charLayout.left + charLayout.width;
    const spaceUntilNextChar = nextCharLayout
      ? nextCharLayout.left - charRight
      : 3;
    const left = charRight + xAdjust + spaceUntilNextChar / 2;
    const charTop = charLayout.top + yAdjust;
    const newCaretLayout = { ...caretLayout, left, top: charTop };

    if (!isEqual(caretLayout, newCaretLayout)) {
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
      textsRef.current = textsRef.current.slice(0, displayNodes.pictos.length);
      const charLayouts = [];
      if (textsRef.current.length && textContainerRef.current) {
        textsRef.current.forEach((textRef, index) => {
          if (textRef === null) {
            console.log({
              Problem: "null text ref",
              textsRef: textsRef.current,
            });
            setLayout([]);
            return;
          }

          textRef.measureLayout(
            textContainerRef.current,
            (left, top, width, height) => {
              const charLayout = { left, top, width, height };
              charLayouts.push(charLayout);
              if (index === displayNodes.pictos.length - 1) {
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
    onSelectionChange({ start: 0, end: displayNodes.pictos.length });
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
    <View
      testID="display"
      accessibilityHint={displayNodes.toString()}
      ref={textContainerRef}
      style={styles.wrapper}
    >
      {
        displayNodes.map((node, index) => (
          <React.Fragment key={index}>
            {isCaretAtIndex(selection, index) && (
              <Caret
                visible={!repositioningCaret}
                style={{ ...styles.text, ...styles.caret, ...caretLayout }}
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
                  style={[
                    styles.text,
                    {
                      height: textHeight,
                      paddingRight:
                        (node.nodes as string) in OperatorsWithExtraSpace
                          ? 5
                          : 0,
                      paddingLeft:
                        (node.nodes as string) in OperatorsWithExtraSpace
                          ? 5
                          : 0,
                      backgroundColor:
                        selection.start !== selection.end &&
                        index >= selection.start &&
                        index < selection.end
                          ? theme.colors.primary
                          : "transparent",
                    },
                  ]}
                >
                  {node.nodes.toString()}
                </Text>
              )}
              {node.type === "variable" && (
                <VariableNode
                  textNodeProps={getTextNodeProps(index)}
                  fontSize={(styles.text as any).fontSize}
                  defaultTextHeight={textHeight}
                  variableKey={node.nodes as string}
                  isSelected={
                    selection.start !== selection.end &&
                    index >= selection.start &&
                    index < selection.end
                  }
                />
              )}
            </Pressable>
          </React.Fragment>
        )) as React.ReactNode
      }
      {isCaretAtIndex(selection, displayNodes.length) && (
        <Caret
          visible={!repositioningCaret}
          style={[styles.text, styles.caret, caretLayout]}
        />
      )}

      <>
        {/**
         * These help position the caret at start and end of selection, but it's not a gooe long-term
         * solution and doesn't handle multi-line text without making it really complicated. A
         * better solution likely involves setting a listener on the parent rather than on all the
         * children.
         *
         * Current solution has each child set selection on its index, and then a selection useEffect
         * updates the x/y position of the caret. Need to flip this, and use the x/y coordinates to
         * set selection.
         */}
        <Pressable
          style={{
            height: textHeight,
            width: spacerWidth,
            position: "absolute",
            top: 0,
            left: -spacerWidth,
          }}
          onPress={() => onSelectionChange({ start: 0, end: 0 })}
        />

        <Pressable
          style={{
            height: textHeight,
            width: spacerWidth,
            position: "absolute",
            top: 0,
            right: -spacerWidth,
          }}
          onPress={() =>
            onSelectionChange({
              start: displayNodes.length,
              end: displayNodes.length,
            })
          }
        />
      </>
    </View>
  );
};

export default Display;
