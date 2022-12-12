import { INode, IPicto, IVariable } from "../types";
import Pictos from "./Pictos";

export const generateHex = (length: number = 32) => {
  return Array.from({ length }, () => "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))).join('');
}

export const getNextVariableName = (
  baseStr: string,
  variables: IVariable[]
):Pictos => {
  // TODO
  // const lastNumUsed = variables.reduce((acc, { varName }) => {
  //   if (varName.substring(0, baseStr.length) !== baseStr) {
  //     return acc;
  //   }

  //   const number = varName.substring(baseStr.length);
  //   if (parseInt(number) > acc) {
  //     return parseInt(number);
  //   }

  //   return acc;
  // }, 0);
  const lastNumUsed = Date.now();

  // TODO move this and tests to array
  const newVarName = `${baseStr}${lastNumUsed + 1}`;
  const pictos = newVarName.split("").map(
    (char):IPicto => ({
      type: "string",
      nodes: char
    })
  );

  return new Pictos(pictos);
};
