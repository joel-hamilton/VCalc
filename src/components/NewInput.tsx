import React from "react";
import { Text, View } from "react-native";
import { ISelection } from "../types";
import { useTheme } from "../themes";
const runes = require("runes");

const NewInput = ({
  display,
  selection,
  onSelectionChange,
}: {
  display: string;
  selection: ISelection;
  onSelectionChange: (sel: ISelection) => void;
}) => {
  // const textContainerRef = React.useRef(null);
  // const textsRef = React.useRef([]);
  const [displayRunes, setDisplayRunes] = React.useState([]);

  // const [layout, setLayout] = React.useState([]);
  const theme = useTheme();

  React.useEffect(() => setDisplayRunes(runes(display)), [display]);

  // layout only used for the character width (to see which side to put caret on
  // this is causing problems as it's sometimes undefined, not very reliable.
  // React.useEffect(() => {
  //   textsRef.current = textsRef.current.slice(0, displayRunes.length);
  //   const charLayouts = [];
  //   if (textsRef.current.length && textContainerRef.current) {
  //     setTimeout(() => {
  //       textsRef.current.forEach((textRef, index) =>
  //         textRef.measureLayout(
  //           textContainerRef.current,
  //           (left, top, width, height) => {
  //             console.log({ CHAR: "true", left, time: Date.now() });
  //             charLayouts.push({ left, top, width, height });
  //             if (index === displayRunes.length - 1) {
  //               setLayout(charLayouts);
  //             }
  //           }
  //         )
  //       );
  //     });
  //   } else {
  //     setLayout([]);
  //   }
  // }, [display]);

  return (
    <>
      <View
        // onLayout={() => console.log('view layout changed')}
        // ref={textContainerRef}
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          backgroundColor: "rgba(100, 100, 200, 0.3)",
        }}
        // onStartShouldSetResponder={(evt) => true}
        // // onResponderReject={() => console.log("rejected")}
        // // onResponderGrant={() => console.log("granted!")}
        // onResponderMove={({ nativeEvent }) =>
        //   console.log({
        //     type: "touch ",
        //     x: nativeEvent.locationX,
        //     y: nativeEvent.locationY,
        //   })
        // }
        // onResponderRelease={({ nativeEvent }) =>
        //   console.log({
        //     type: "release",
        //     x: nativeEvent.locationX,
        //     y: nativeEvent.locationY,
        //   })
        // }
        // onResponderTerminate={() => console.log("terminated!")}
      >
        {displayRunes.map((char, index) => (
          <React.Fragment key={index}>
            {selection.start === selection.end && index === selection.start && (
              <Text
                onLongPress={() =>
                  onSelectionChange({ start: 0, end: displayRunes.length })
                }
                style={{ fontSize: 100, color: theme.colors.primary }}
              >
                |
              </Text>
            )}
            <View
            // onStartShouldSetResponder={(evt) => true}
            // onResponderMove={({ nativeEvent }) =>
            //   console.log({
            //     type: "touch ",
            //     x: nativeEvent.locationX,
            //     y: nativeEvent.locationY,
            //   })
            // }
            >
              <Text
                onLongPress={() =>
                  onSelectionChange({ start: 0, end: displayRunes.length })
                }
                onPress={({ nativeEvent }) => {
                  console.log(nativeEvent.target)
                  const charWidth = 50; // TODO more precise estimate
                  const touchX = nativeEvent.locationX;
                  const caretPos = touchX < charWidth / 2 ? index : index + 1;
                  onSelectionChange({ start: caretPos, end: caretPos });
                }}
                // ref={index === display.length - 1 ? textRef : null}
                // ref={(el) => (textsRef.current[index] = el)}
                // onLayout={({ nativeEvent }) =>
                //   setCharLayout(nativeEvent.layout, index)
                // }
                style={{
                  fontSize: 100,
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
            <Text
              onLongPress={() =>
                onSelectionChange({ start: 0, end: displayRunes.length })
              }
              style={{ fontSize: 100, color: theme.colors.primary }}
            >
              |
            </Text>
          )}
      </View>
    </>
  );
};

export default NewInput;
