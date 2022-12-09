import { IVariable } from "../types";
import { getNextVariableName } from "./string";

describe.skip("getNextVariableName", () => {
  const cases: {
    name: string;
    baseStr: string;
    variables: IVariable[];
    expected: string;
  }[] = [
    {
      name: "returns `${baseStr}1` if no variables exist",
      baseStr: "test",
      variables: [],
      expected: "test1",
    },
    {
      name: "correctly generates next variable name",
      baseStr: "test",
      variables: [
        { varName: "test1", nodes: [{ type: "string", nodes: "0" }] },
      ],
      expected: "test2",
    },
    {
      name: "works if there are skipped variables names",
      baseStr: "test",
      variables: [
        { varName: "test1", nodes: [{ type: "string", nodes: "0" }] },
        { varName: "test3", nodes: [{ type: "string", nodes: "0" }] },
      ],
      expected: "test4",
    },
  ];

  for (const c of cases) {
    it(c.name, () => {
      expect(getNextVariableName(c.baseStr, c.variables)).toBe(c.expected);
    });
  }
});
