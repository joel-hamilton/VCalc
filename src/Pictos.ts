import { cloneDeep } from "lodash";
import { IPicto, ISelection, IVariable } from "src/types";

export default class Pictos {
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
    variables?: IVariable[], // interpolate if this is present
    originalNodes?: IPicto[]
  ): string => {
    if (variables === undefined) {
      variables = [];
    }

    if (originalNodes === undefined) {
      originalNodes = this.pictos;
    }

    const nodes = cloneDeep(originalNodes);

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if (node.type === "variable") {
        if (variables.length) {
          const variableValue = this.getVariableNodes(
            node.nodes as string,
            variables
          );

          nodes[i] = {
            type: "string",
            nodes: variableValue.toString(variables),
          };
        }
      }
    }

    return nodes.map((n) => n.nodes).join("");
  };

  private getVariableNodes = (
    varKey: string,
    variables: IVariable[]
  ): Pictos => {
    const variable = variables.find((v) => v.key === varKey);
    if (!variable) {
      return;
    }

    return variable.nodes;
  };
}
