import { IPicto, IVariable } from "../types";
import { Pictos } from "../classes/Pictos";
import { Variables } from "../classes/Variables";

export const getNextVariableName = (
  baseStr: string,
  variables: Variables
): Pictos => {
  const lastNumUsed = variables.reduce((acc, { varName }) => {
    if (varName.slice(0, baseStr.length).toString() !== baseStr) {
      return acc;
    }

    const number = varName.slice(baseStr.length).toString();
    if (parseInt(number) > acc) {
      return parseInt(number);
    }

    return acc;
  }, 0) as unknown as number;

  // TODO move this and tests to array
  const newVarName = `${baseStr}${lastNumUsed + 1}`;
  const pictos = newVarName.split("").map(
    (char): IPicto => ({
      type: "string",
      nodes: char,
    })
  );

  return new Pictos(pictos);
};

export  const pictosFromSerializedString = (serializedPicto) => {
    const pictos = JSON.parse(serializedPicto);
    return new Pictos(pictos);
  };