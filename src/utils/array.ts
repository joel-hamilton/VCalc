import { cloneDeep } from "lodash";
import { IDisplayNode, ISelection, IVariable } from "../types";



export const backspaceAtSelection = (
  displayNodes: IDisplayNode[],
  selection: ISelection
): [IDisplayNode[], ISelection] => {
  // if no selection, just remove the last char
  if (selection.start === undefined) {
    const newDisplayNodes = displayNodes.slice(0, displayNodes.length - 1);
    return [newDisplayNodes, selection];
  }

  // just remove selection if there are actual chars selected, delete prev char otherwise
  const additionalCharsToRemove = selection.start === selection.end ? 1 : 0;
  const deleteFrom = Math.max(0, selection.start - additionalCharsToRemove);
  const deleteTo = selection.end;

  const newDisplayNodes = displayNodes.slice(0, deleteFrom).concat(displayNodes.slice(deleteTo));
  const distanceToMoveCaret = selection.start === selection.end ? 1 : 0;
  const newCaretPos = Math.max(0, selection.start - distanceToMoveCaret);
  const newSelection = { start: newCaretPos, end: newCaretPos };
  return [newDisplayNodes, newSelection];
};

export const insertAtSelection = (
  insertNodes: IDisplayNode[],
  displayNodes: IDisplayNode[],
  selection: ISelection
): [IDisplayNode[], ISelection] => {
  if (!insertNodes.length) {
    return [displayNodes, selection];
  }

  const newStrArr = displayNodes
    .slice(0, selection.start)
    .concat(insertNodes)
    .concat(displayNodes.slice(selection.end));

  const newCaretPos = Math.min(selection.start + 1, newStrArr.length);
  const newSelection = { start: newCaretPos, end: newCaretPos };

  return [newStrArr, newSelection];
};

export const wrapAtSelection = (
  baseStrArr: IDisplayNode[],
  prependStr: IDisplayNode[],
  appendStr: IDisplayNode[],
  selection: ISelection
): [IDisplayNode[], ISelection] => {
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
  const newStrArr = before.concat(prependStr, middle, appendStr, after);

  const newCaretPos = selection.start + 1 + middle.length;
  return [newStrArr, { start: newCaretPos, end: newCaretPos }];
};

const findVariableValue = (variableName, variables):IDisplayNode[] => {
  const variable = variables.find((v) => v.varName === variableName);
  if (!variable) {
    return;
  }

  return variable.value;
};

export const interpolate = (
  originalNodes: IDisplayNode[],
  variables: IVariable[]
): string => {
  const nodes = cloneDeep(originalNodes);

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.type === "variable") {
      const variableValue = findVariableValue(node.value, variables);

      nodes[i] = {
        type: "string",
        value: interpolate(variableValue, variables),
      };
    }
  }

  return nodes.map(n => n.value).join("");
};