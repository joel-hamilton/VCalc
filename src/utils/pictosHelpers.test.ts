import Pictos from '../Pictos';
import { IVariable } from '../types';
import { getNextVariableName } from './pictosHelpers';

describe("getNextVariableName", () => {
  const TEST_KEY = "testkey";
  const variablePictos: IVariable = {
    key: TEST_KEY,
    varName: new Pictos([
      { type: "string", nodes: "v" },
      { type: "string", nodes: "a" },
      { type: "string", nodes: "r" },
      { type: "string", nodes: "1" },
    ]),
    nodes: new Pictos([{ type: "string", nodes: "5" }]),
  };

  const TEST_KEY2 = "testkey2";
  const variablePictos2 = {
    key: TEST_KEY2,
    varName: new Pictos([
      { type: "string", nodes: "v" },
      { type: "string", nodes: "a" },
      { type: "string", nodes: "r" },
      { type: "string", nodes: "2" },
    ]),
    nodes: new Pictos([
      {
        type: "variable",
        nodes: TEST_KEY,
      },
      { type: "string", nodes: "+" },
      { type: "string", nodes: "10" },
    ]),
  };

  const cases: {
    name: string;
    baseStr: string;
    variables: IVariable[];
    expected: string;
  }[] = [
    {
      name: "returns `${baseStr}1` if no variables exist",
      baseStr: "var",
      variables: [],
      expected: "var1",
    },
    {
      name: "correctly generates next variable name",
      baseStr: "var",
      variables: [variablePictos],
      expected: "var2",
    },
  ];

  for (const c of cases) {
    it(c.name, () => {
      expect(getNextVariableName(c.baseStr, c.variables).toString()).toBe(
        c.expected
      );
    });
  }
});
