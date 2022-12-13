import Pictos from '../Pictos';
import { IPicto, IVariable } from '../types';

export const getNextVariableName = (
  baseStr: string,
  variables: IVariable[]
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
  }, 0);

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
