import { IPicto, IVariable } from "../types";
import { Pictos, Variables } from "../classes";

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
