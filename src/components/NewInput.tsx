import React from "react";
import { Text, View } from "react-native";
import { ISelection } from "../types";
import { useTheme } from "../themes";
const runes = require("runes");

const NewInput = ({
  display,
  selection,
}: {
  display: string;
  selection: ISelection;
}) => {
  const theme = useTheme();

  return (
    <View style={{ position: "relative", height: 200 }}>
      <View
        style={{
          position: "absolute",
          zIndex: 0,
          right: 0,
          flexDirection: "row",
          justifyContent: "flex-end",
          backgroundColor: "rgba(100, 100, 200, 0.3)",
        }}
      >
        {(runes(display) as string[]).map((char, index) => (
          <React.Fragment key={index}>
            {index === selection.start && <Text>|</Text>}
            <Text>{char}</Text>
          </React.Fragment>
        ))}
      </View>

      <Text
        selectable={true}
        selectionColor={theme.colors.primary}
        style={{
          position: "absolute",
          zIndex: 1,
          right: 0,
          backgroundColor: "rgba(200, 100, 100, 0.3)",
        }}
      >
        {(runes(display) as string[]).map((char, index) => (
          <React.Fragment key={index}>
            {index === selection.start && "|"}
            {char}
          </React.Fragment>
        ))}
      </Text>
    </View>
  );
};

export default NewInput;