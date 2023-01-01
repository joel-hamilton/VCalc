import { Variables } from "../classes/Variables";
import { pictosFromSerializedString } from "./pictosHelpers";

export const variablesFromSerializedString = (serializedVariables) => {
  const withWithSerializedPictos = JSON.parse(serializedVariables);
  const deserializedVariables = withWithSerializedPictos.map((v) => ({
    ...v,
    varName: pictosFromSerializedString(v.varName),
    nodes: pictosFromSerializedString(v.nodes),
  }));

  return new Variables(deserializedVariables);
};
