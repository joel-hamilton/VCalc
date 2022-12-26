import { IVariable } from "../types";

export class Variables {
  public variables: IVariable[];

  constructor(variables: IVariable[] = []) {
    this.variables = variables;
  }

  get length() {
    return this.variables.length;
  }

  concat = (otherVariables: Variables) => {
    return new Variables(this.variables.concat(otherVariables.variables));
  };

  slice = (from: number, to?: number) => {
    return new Variables(this.variables.slice(from, to));
  };

  find = (findFn) => {
    return this.variables.find(findFn);
  };

  map = (mapFn) => {
    return this.variables.map(mapFn);
  };

  reduce = (reduceFn, start) => {
    return this.variables.reduce(reduceFn, start);
  };

  getVariableAt = (index): IVariable => {
    return this.variables[index];
  };

  serialize = () => {
    const withWithSerializedPictos = this.variables.map((v) => ({
      ...v,
      varName: v.varName.serialize(),
      nodes: v.nodes.serialize(),
    }));

    return JSON.stringify(withWithSerializedPictos);
  };
}
