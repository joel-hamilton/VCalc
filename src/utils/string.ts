import { IVariable } from "../types";

export const getNextVariableName = (
  baseStr: string,
  variables: IVariable[]
) => {
  const lastNumUsed = variables.reduce((acc, { varName }) => {
    if (varName.substring(0, baseStr.length) !== baseStr) {
      return acc;
    }

    const number = varName.substring(baseStr.length);
    if (parseInt(number) > acc) {
      return parseInt(number);
    }

    return acc;
  }, 0);

  return `${baseStr}${lastNumUsed + 1}`;
};
