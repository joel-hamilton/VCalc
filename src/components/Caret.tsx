import React from "react";
import { Text, View } from "react-native";
import { ILayout } from "src/types";

const Caret = ({
  style,
  onLongPress,
}: {
  style: any;
  onLongPress: () => void;
}) => {
  const [caretVisible, setCaretVisible] = React.useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCaretVisible((caretVisible) => !caretVisible);
    }, 750);

    return () => clearInterval(interval);
  }, []);

  // React.useEffect(() => {
    // TODO style changing constantly, although `setCaretLayout` being called correctly
    // console.log({ caretStyles: style });
  // }, [style]);

  return (
    <View style={style}>
      <View
        style={{ height: "100%", width: "100%", backgroundColor: style.color }}
      />
    </View>
  );
  return (
    <Text style={style} onLongPress={onLongPress}>
      {caretVisible && "|"}
      {!caretVisible && ""}
    </Text>
  );
};

export default Caret;
