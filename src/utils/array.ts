import { cloneDeep } from "lodash";
import { ISelection, IVariable } from "../types";

export const insertAtSelection = (
  str: string,
  strArr: string[],
  selection: ISelection
): [string[], ISelection] => {
  if (!str) {
    return [strArr, selection];
  }

  const newStrArr = strArr
    .slice(0, selection.start)
    .concat([str])
    .concat(strArr.slice(selection.end));

  const newCaretPos = Math.min(selection.start + 1, newStrArr.length);
  const newSelection = { start: newCaretPos, end: newCaretPos };

  return [newStrArr, newSelection];
};

export const backspaceAtSelection = (
  strArr: string[],
  selection: ISelection
): [string[], ISelection] => {
  // if no selection, just remove the last char
  if (selection.start === undefined) {
    const newStrArr = strArr.slice(0, strArr.length - 1);
    return [newStrArr, selection];
  }

  // just remove selection if there are actual chars selected, delete prev char otherwise
  const additionalCharsToRemove = selection.start === selection.end ? 1 : 0;
  const deleteFrom = Math.max(0, selection.start - additionalCharsToRemove);
  const deleteTo = selection.end;

  const newStrArr = strArr.slice(0, deleteFrom).concat(strArr.slice(deleteTo));
  const distanceToMoveCaret = selection.start === selection.end ? 1 : 0;
  const newCaretPos = Math.max(0, selection.start - distanceToMoveCaret);
  const newSelection = { start: newCaretPos, end: newCaretPos };
  return [newStrArr, newSelection];
};

export const wrapAtSelection = (
  baseStrArr: string[],
  prependStr: string,
  appendStr: string,
  selection: ISelection
): [string[], ISelection] => {
  if (!prependStr && !appendStr) {
    return [baseStrArr, selection];
  }

  if (selection.start === undefined) {
    selection.start = baseStrArr.length;
    selection.end = baseStrArr.length;
  }

  const before = baseStrArr.slice(0, selection.start);
  const middle = baseStrArr.slice(selection.start, selection.end);
  const after = baseStrArr.slice(selection.end);
  const newStrArr = before.concat([prependStr], middle, [appendStr], after);

  const newCaretPos = selection.start + 1 + middle.length;
  return [newStrArr, { start: newCaretPos, end: newCaretPos }];
};

export const interpolate = (
  originalStrArr: string[],
  variables: IVariable[]
): string => {
  const strArr = cloneDeep(originalStrArr);
  let hasChanges = false;

  const findVariableValue = (variableName) => {
    const variable = variables.find((v) => v.varName === variableName);
    if (!variable) {
      return;
    }

    return variable.value;
  };

  // loop through all strArr
  for (let i = 0; i < strArr.length; i++) {
    const str = strArr[i];
    const variableValue = findVariableValue(str);
    if (variableValue !== undefined) {
      strArr[i] = variableValue;
    }
  }

  console.log({ strArr });
  return strArr.join("");

  // for (const { varName, value } of variables) {
  //   // avoid regex to prevent malicious var names
  //   let index = 0;
  //   do {
  //     const oldStr = str;
  //     str = str.replace(varName, `(${value})`);
  //     if (oldStr !== str) {
  //       hasChanges = true;
  //     }
  //   } while ((index = str.indexOf(varName, index + 1)) > -1);
  // }

  // if (hasChanges) {
  //   return interpolateString(str, variables);
  // }

  return str;
};
