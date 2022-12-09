import React from "react";
import { Pressable, Text, View, StyleSheet, ViewStyle } from "react-native";
import { ILayout, ISelection } from "../types";
import { useTheme } from "../themes";
import Caret from "./Caret";
import { isEqual } from "lodash";
const runes = require("runes");

const fontSize = 32;
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
      alignItems: 'center',
      flexWrap: "wrap",
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

const NewInput = ({
  display,
  selection,
  onSelectionChange,
}: {
  display: string;
  selection: ISelection;
  onSelectionChange: (sel: ISelection) => void;
}) => {
  const textContainerRef = React.useRef(null);
  const textsRef = React.useRef([]);
  const [layout, setLayout] = React.useState<ILayout[]>([]);
  const [displayRunes, setDisplayRunes] = React.useState<string[]>([]);
  const [caretLayout, setCaretLayout] =
    React.useState<ILayout>(initialCaretLayout);

  const theme = useTheme();
  const styles = createStyles(theme);

  React.useEffect(() => {
    if (!layout.length || selection.start === 0) {
      return setCaretLayout(initialCaretLayout);
    }

    const charLayout = layout[selection.start - 1];
    if (charLayout === undefined) {
      console.log({
        Problem: "UNDEFINED charLayout",
        layout,
        selectionStart: selection.start,
        display,
      });
      return;
    }

    const charRight = charLayout.left + charLayout.width + xAdjust;
    const charTop = charLayout.top + yAdjust;
    const newCaretLayout = { ...caretLayout, left: charRight, top: charTop };
    if(!isEqual(caretLayout, newCaretLayout)) {
      console.log({ newCaretLayout });
      setCaretLayout(newCaretLayout);
    }
  }, [selection, layout]);

  React.useEffect(() => setDisplayRunes(runes(display)), [display]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      textsRef.current = textsRef.current.slice(0, displayRunes.length);
      const charLayouts = [];
      if (textsRef.current.length && textContainerRef.current) {
        textsRef.current.forEach((textRef, index) => {
          textRef.measureLayout(
            textContainerRef.current,
            (left, top, width, height) => {
              const charLayout = { left, top, width, height };
              charLayouts.push(charLayout);
              if (index === displayRunes.length - 1) {
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
  }, [displayRunes, textsRef, textContainerRef]);

  const selectAll = () => {
    onSelectionChange({ start: 0, end: displayRunes.length });
  };

  return (
    <View
      onLayout={() => console.log("view layout changed")}
      ref={textContainerRef}
      style={styles.wrapper}
    >
      {displayRunes.map((char, index) => (
        <React.Fragment key={index}>
          {selection.start === selection.end && index === selection.start && (
            <Caret
              style={{ ...styles.text, ...styles.caret, ...caretLayout }}
              onLongPress={selectAll}
            />
          )}
          <View>
            <Text
              ref={(el) => (textsRef.current[index] = el)}
              onLongPress={selectAll}
              onPress={({ nativeEvent }) => {
                const charWidth = layout[index].width;
                const touchX = nativeEvent.locationX;
                const caretPos = touchX < charWidth / 2 ? index : index + 1;

                console.log({ SELCHANGE: caretPos });
                onSelectionChange({ start: caretPos, end: caretPos });
              }}
              style={{
                ...styles.text,
                backgroundColor:
                  selection.start !== selection.end &&
                  index >= selection.start &&
                  index < selection.end
                    ? theme.colors.primary
                    : "transparent",
              }}
            >
              {char}
            </Text>
          </View>
        </React.Fragment>
      ))}
      {selection.start === selection.end &&
        selection.start === displayRunes.length && (
          <Caret
            style={{ ...styles.text, ...styles.caret, ...caretLayout }}
            onLongPress={selectAll}
          />
        )}
    </View>
  );
};

export default NewInput;
