import { cloneDeep } from "lodash";
import { ISelection, IVariable } from "../types";

const runes = require("runes");

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

export const backspaceAtSelection = (str: string, selection: ISelection) => {
  // if no selection, just remove the last char
  if (selection.start === undefined) {
    const r = runes(str);
    const newStr = r.slice(0, r.length - 1).join("");
    return [newStr, selection];
  }

  // just remove selection if there are actual chars selected, delete prev char otherwise
  const additionalCharsToRemove = selection.start === selection.end ? 1 : 0;
  const deleteFrom = Math.max(0, selection.start - additionalCharsToRemove);
  const deleteTo = selection.end;
  const r = runes(str);
  const newStr = r.slice(0, deleteFrom).concat(r.slice(deleteTo)).join("");
  const distanceToMoveCaret = selection.start === selection.end ? 1 : 0;
  const newCaretPos = Math.max(0, selection.start - distanceToMoveCaret);
  const newSelection = { start: newCaretPos, end: newCaretPos };
  return [newStr, newSelection];
};

export const insertAtSelection = (
  str: string,
  baseStr: string,
  selection: ISelection
) => {
  let newBaseString;

  if (selection.start === undefined) {
    // append to string if no selection
    newBaseString = `${baseStr}${str}`;
    return [newBaseString, selection];
  }

  const r = runes(baseStr);
  newBaseString = r
    .slice(0, selection.start)
    .concat(runes(str))
    .concat(r.slice(selection.end))
    .join("");

  // selection should normally be selection.start + length of new string
  //     - to a max of r.length
  const newCaretPos = Math.min(
    selection.start + runes(str).length,
    runes(newBaseString).length
  );
  const newSelection = { start: newCaretPos, end: newCaretPos };

  return [newBaseString, newSelection];
};

export const wrapAtSelection = (
  baseStr: string,
  prependStr: string,
  appendStr: string,
  sel: ISelection
): [newString: string, newSelection: ISelection] => {
  const selection = cloneDeep(sel);
  if (!prependStr && !appendStr) {
    return [baseStr, selection];
  }

  const r = runes(baseStr);

  if (selection.start === undefined) {
    selection.start = r.length;
    selection.end = r.length;
  }

  const rBefore = r.slice(0, selection.start);
  const rMiddle = r.slice(selection.start, selection.end);
  const rAfter = r.slice(selection.end);

  const newStr = `${rBefore.join("")}${prependStr}${rMiddle.join(
    ""
  )}${appendStr}${rAfter.join("")}`;
  const newCaretPos = selection.start + runes(prependStr).length + rMiddle.length;
  return [newStr, { start: newCaretPos, end: newCaretPos }];
};

export const interpolateString = (str: string, variables: IVariable[]) => {
  let hasChanges = false;

  for (const { varName, value } of variables) {
    // avoid regex to prevent malicious var names
    let index = 0;
    do {
      const oldStr = str;
      str = str.replace(varName, `(${value})`);
      if (oldStr !== str) {
        hasChanges = true;
      }
    } while ((index = str.indexOf(varName, index + 1)) > -1);
  }

  if (hasChanges) {
    return interpolateString(str, variables);
  }

  return str;
};
