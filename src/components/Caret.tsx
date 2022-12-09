import React from "react";
import { Text, View } from "react-native";
import { ILayout } from "src/types";

const Caret = ({
  visible,
  style,
  onLongPress,
}: {
  visible: boolean
  style: any;
  onLongPress: () => void;
}) => {
  const [caretBlinkOn, setCaretBlinkOn] = React.useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCaretBlinkOn((caretBlinkOn) => !caretBlinkOn);
    }, 750);

    return () => clearInterval(interval);
  }, []);

  // React.useEffect(() => {
  // TODO style changing constantly, although `setCaretLayout` being called correctly
  // console.log({ caretStyles: style });
  // }, [style]);

  return (
    <View style={style}>
      {visible && caretBlinkOn && (
        <View
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: style.color,
          }}
        />
      )}
    </View>
  );
};

export default Caret;
