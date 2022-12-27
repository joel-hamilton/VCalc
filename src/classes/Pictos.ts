import { cloneDeep } from "lodash";
import { IPicto, ISelection, IVariable } from "../types";
import { Variables } from "./Variables";

/**
 * Why Pictos?
 *
 * As non-bmp characters aren't counted consistently (`"🥕".length === 2`, for example), Pictos
 * provides an array-like solution where each element in the array is an IPicto representing
 * either a string character (`{type: string, nodes: "🥕"}`) or a variable
 * (`{type: 'variable', nodes: VAR_NAME}`).
 *
 * Storing each 'character' as an object in an array complicates outputting and comparing, and
 * Pictos exposes `equals` and `toString` methods.
 */
export class Pictos {
  public pictos: IPicto[];
  constructor(pictos: IPicto[] = []) {
    this.pictos = pictos;
  }

  get length() {
    return this.pictos.length;
  }

  equals = (otherPictos: Pictos) => {
    return this.toString() === otherPictos.toString();
  };

  concat = (...otherPictos: Pictos[]) => {
    return new Pictos(
      this.pictos.concat(...otherPictos.map((op) => op.pictos))
    );
  };

  slice = (from: number, to?: number) => {
    return new Pictos(this.pictos.slice(from, to));
  };

  map = (mapFn) => {
    return this.pictos.map(mapFn);
  };

  backspaceAtSelection = (selection: ISelection): [Pictos, ISelection] => {
    // if no selection, just remove the last char
    if (selection.start === undefined) {
      const newDisplayNodes = this.pictos.slice(0, this.pictos.length - 1);
      return [new Pictos(newDisplayNodes), selection];
    }

    // just remove selection if there are actual chars selected, delete prev char otherwise
    const additionalCharsToRemove = selection.start === selection.end ? 1 : 0;
    const deleteFrom = Math.max(0, selection.start - additionalCharsToRemove);
    const deleteTo = selection.end;

    const newDisplayNodes = this.pictos
      .slice(0, deleteFrom)
      .concat(this.pictos.slice(deleteTo));
    const distanceToMoveCaret = selection.start === selection.end ? 1 : 0;
    const newCaretPos = Math.max(0, selection.start - distanceToMoveCaret);
    const newSelection = { start: newCaretPos, end: newCaretPos };
    return [new Pictos(newDisplayNodes), newSelection];
  };

  insertAtSelection = (
    insertPictos: Pictos,
    selection: ISelection
  ): [Pictos, ISelection] => {
    const insertNodes = insertPictos.pictos;

    const newStrArr = this.pictos
      .slice(0, selection.start)
      .concat(insertNodes)
      .concat(this.pictos.slice(selection.end));

    const newCaretPos = Math.min(
      selection.start + insertNodes.length,
      newStrArr.length
    );
    const newSelection = { start: newCaretPos, end: newCaretPos };

    return [new Pictos(newStrArr), newSelection];
  };

  wrapAtSelection = (
    prependPictos: Pictos,
    appendPictos: Pictos,
    selection: ISelection
  ): [Pictos, ISelection] => {
    const baseStrArr = this.pictos;
    if (!prependPictos && !appendPictos) {
      return [this, selection];
    }

    if (selection.start === undefined) {
      selection.start = baseStrArr.length;
      selection.end = baseStrArr.length;
    }

    const before = baseStrArr.slice(0, selection.start);
    const middle = baseStrArr.slice(selection.start, selection.end);
    const after = baseStrArr.slice(selection.end);
    const newStrArr = before.concat(
      prependPictos.pictos,
      middle,
      appendPictos.pictos,
      after
    );

    const newCaretPos = selection.start + 1 + middle.length;
    return [new Pictos(newStrArr), { start: newCaretPos, end: newCaretPos }];
  };

  toString = (
    variables?: Variables, // interpolate if this is present
    originalNodes?: IPicto[]
  ): string => {
    if (variables === undefined) {
      variables = new Variables();
    }

    if (originalNodes === undefined) {
      originalNodes = this.pictos;
    }

    const nodes = cloneDeep(originalNodes);

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if (node.type === "variable") {
        if (variables.length) {
          const variable = this.getVariable(
            node.nodes as string,
            variables
          );

          nodes[i] = {
            type: "string",
            nodes: variable.nodes.toString(variables),
          };
        }
      }
    }

    return nodes.map((n) => n.nodes).join("");
  };

  // are any of these picto nodes (recursive) of type: 'variable' and node: varName?
  containsVariable = (
    varKey: string,
    variables: Variables,
    nodes?: IPicto[]
  ) => {
    if (!nodes) {
      nodes = this.pictos;
    }

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.type === "variable") {
        if (node.nodes === varKey) {
          return true;
        } else {
          const variable = this.getVariable(varKey, variables);
          if(variable.key === varKey) {
            return true;
          }
          
          return variable.nodes.containsVariable(varKey, variables);
        }
      } else if (typeof node.nodes !== "string") {
        return node.nodes.containsVariable(varKey, variables);
      }
    }

    return false;
  };

  serialize = () => {
    return JSON.stringify(this.pictos);
  };

  private getVariable = (varKey: string, variables: Variables): IVariable => {
    const variable = variables.find((v) => v.key === varKey);
    if (!variable) {
      return;
    }

    return variable;
  };
}
