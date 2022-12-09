import { cloneDeep } from "lodash";
import { INode, ISelection, IVariable } from "../types";



export const backspaceAtSelection = (
  displayNodes: INode[],
  selection: ISelection
): [INode[], ISelection] => {
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
  insertNodes: INode[],
  displayNodes: INode[],
  selection: ISelection
): [INode[], ISelection] => {
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
  baseStrArr: INode[],
  prependStr: INode[],
  appendStr: INode[],
  selection: ISelection
): [INode[], ISelection] => {
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

const getVariableNodes = (variableName, variables):INode[] => {
  const variable = variables.find((v) => v.varName === variableName);
  if (!variable) {
    return;
  }

  return variable.nodes;
};

export const interpolate = (
  originalNodes: INode[],
  variables: IVariable[]
): string => {
  const nodes = cloneDeep(originalNodes);

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.type === "variable") {
      const variableValue = getVariableNodes(node.nodes, variables);

      nodes[i] = {
        type: "string",
        nodes: interpolate(variableValue, variables),
      };
    }
  }

  return nodes.map(n => n.nodes).join("");
};