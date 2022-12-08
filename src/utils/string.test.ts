import { ISelection, IVariable } from '../types';
import {
    backspaceAtSelection, getNextVariableName, insertAtSelection, interpolateString, wrapAtSelection
} from './string';

describe("getNextVariableName", () => {
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
      variables: [{ varName: "test1", value: "0" }],
      expected: "test2",
    },
    {
      name: "works if there are skipped variables names",
      baseStr: "test",
      variables: [
        { varName: "test1", value: "0" },
        { varName: "test3", value: "0" },
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

describe("backspaceAtSelection", () => {
  const cases: {
    name: string;
    baseStr: string;
    selection: ISelection;
    expected: [string, ISelection];
  }[] = [
    {
      name: "does nothing if selection start/end is 0",
      baseStr: "test",
      selection: { start: 0, end: 0 },
      expected: ["test", { start: 0, end: 0 }],
    },
    {
      name: "removes the last character if selection start is undefined",
      baseStr: "test",
      selection: { start: undefined, end: undefined },
      expected: ["tes", { start: undefined, end: undefined }],
    },
    {
      name: "removes the last character if selection start/end equals bastStr.length",
      baseStr: "test",
      selection: { start: 4, end: 4 },
      expected: ["tes", { start: 3, end: 3 }],
    },
    {
      name: "removes the correct character if selection start/end in middle of string",
      baseStr: "test",
      selection: { start: 2, end: 2 },
      expected: ["tst", { start: 1, end: 1 }],
    },
    {
      name: "removes the first character if selection start/end is 1",
      baseStr: "test",
      selection: { start: 1, end: 1 },
      expected: ["est", { start: 0, end: 0 }],
    },
    {
      name: "removes the selected range at start",
      baseStr: "test",
      selection: { start: 0, end: 2 },
      expected: ["st", { start: 0, end: 0 }],
    },
    {
      name: "removes the selected range in middle",
      baseStr: "test",
      selection: { start: 1, end: 3 },
      expected: ["tt", { start: 1, end: 1 }],
    },
    {
      name: "removes the selected range at end",
      baseStr: "test",
      selection: { start: 2, end: 4 },
      expected: ["te", { start: 2, end: 2 }],
    },
    {
      name: "correctly removes non-BMP chars at end",
      baseStr: "💁👌😍大-은",
      selection: { start: undefined, end: undefined },
      expected: ["💁👌😍大-", { start: undefined, end: undefined }],
    },
    {
      name: "correctly removes non-BMP chars in middle",
      baseStr: "💁👌😍大-은",
      selection: { start: 2, end: 5 },
      expected: ["💁👌은", { start: 2, end: 2 }],
    },
    {
      name: "correctly removes non-BMP chars at start",
      baseStr: "💁👌😍大-은",
      selection: { start: 0, end: 2 },
      expected: ["😍大-은", { start: 0, end: 0 }],
    },
  ];
  for (const c of cases) {
    it(c.name, () => {
      expect(backspaceAtSelection(c.baseStr, c.selection)).toEqual(c.expected);
    });
  }
});

describe("insertAtSelection", () => {
  const cases: {
    name: string;
    str: string;
    baseStr: string;
    selection: ISelection;
    expected: [string, ISelection];
  }[] = [
    {
      name: "inserts the correct string at the beginning if selection start/end is 0",
      str: "a",
      baseStr: "b",
      selection: { start: 0, end: 0 },
      expected: ["ab", { start: 1, end: 1 }],
    },
    {
      name: "inserts the correct string at the end if selection start/end at end of `baseStr`",
      str: "a",
      baseStr: "b",
      selection: { start: 1, end: 1 },
      expected: ["ba", { start: 2, end: 2 }],
    },
    {
      name: "inserts the correct string at the end if selection start/end is greater than `baseStr` length",
      str: "a",
      baseStr: "b",
      selection: { start: 3, end: 3 },
      expected: ["ba", { start: 2, end: 2 }],
    },
    {
      name: "inserts the correct string at the end if selection start/end undefined",
      str: "a",
      baseStr: "b",
      selection: { start: undefined, end: undefined },
      expected: ["ba", { start: undefined, end: undefined }],
    },
    {
      name: "inserts the correct string in the middle",
      str: "a",
      baseStr: "bb",
      selection: { start: 1, end: 1 },
      expected: ["bab", { start: 2, end: 2 }],
    },
    {
      name: "replaces selection with the correct string",
      str: "a",
      baseStr: "bcb",
      selection: { start: 1, end: 2 },
      expected: ["bab", { start: 2, end: 2 }],
    },
    {
      name: "inserts non-BMP characters correctly at start",
      str: "💁👌😍大-은 ",
      baseStr: "💥💥💥",
      selection: { start: 0, end: 0 },
      expected: ["💁👌😍大-은 💥💥💥", { start: 7, end: 7 }],
    },

    {
      name: "inserts non-BMP characters correctly in middle",
      str: "💁👌😍大-은 ",
      baseStr: "💥💥💥",
      selection: { start: 2, end: 2 },
      expected: ["💥💥💁👌😍大-은 💥", { start: 9, end: 9 }],
    },
    {
      name: "inserts non-BMP characters correctly at end",
      str: "💁👌😍大-은 ",
      baseStr: "💥💥💥",
      selection: { start: undefined, end: undefined },
      expected: ["💥💥💥💁👌😍大-은 ", { start: undefined, end: undefined }],
    },
  ];

  for (const c of cases) {
    it(c.name, () => {
      expect(insertAtSelection(c.str, c.baseStr, c.selection)).toEqual(
        c.expected
      );
    });
  }
});

describe("wrapAtSelection", () => {
  const cases: {
    name: string;
    baseStr: string;
    prependStr: string;
    appendStr: string;
    selection: ISelection;
    expected: [string, ISelection];
  }[] = [
    {
      name: "it does nothing if there is no before or after string",
      baseStr: "test",
      prependStr: "",
      appendStr: "",
      selection: { start: 2, end: 4 },
      expected: ["test", { start: 2, end: 4 }],
    },
    {
      name: "it wraps nothing at the end if selection is undefined",
      baseStr: "test",
      prependStr: "(",
      appendStr: ")",
      selection: { start: undefined, end: undefined },
      expected: ["test()", { start: 5, end: 5 }],
    },
    {
      name: "it wraps nothing at the beginning if selection start/end is 0",
      baseStr: "test",
      prependStr: "(",
      appendStr: ")",
      selection: { start: 0, end: 0 },
      expected: ["()test", { start: 1, end: 1 }],
    },
    {
      name: "it wraps a range",
      baseStr: "test",
      prependStr: "~",
      appendStr: "*",
      selection: { start: 1, end: 3 },
      expected: ["t~es*t", { start: 4, end: 4 }],
    },
    {
      name: "it wraps nothing correctly when no baseStr exists and selection is undefined",
      baseStr: "",
      prependStr: "*",
      appendStr: "*",
      selection: { start: undefined, end: undefined },
      expected: ["**", { start: 1, end: 1 }],
    },
    {
      name: "it wraps nothing correctly when no baseStr exists and selection is at 0",
      baseStr: "",
      prependStr: "*",
      appendStr: "*",
      selection: { start: 0, end: 0 },
      expected: ["**", { start: 1, end: 1 }],
    },
    {
      name: "it wraps a range of non-BMP chars",
      baseStr: "💥💥💥💥",
      prependStr: "👌",
      appendStr: "👌",
      selection: { start: 1, end: 3 },
      expected: ["💥👌💥💥👌💥", { start: 4, end: 4 }],
    },
  ];

  for (const c of cases) {
    it(c.name, () => {
      expect(
        wrapAtSelection(c.baseStr, c.prependStr, c.appendStr, c.selection)
      ).toEqual(c.expected);
    });
  }
});

describe("interpolateString", () => {
  const cases: {
    name: string;
    str: string;
    variables: IVariable[];
    expected: string;
  }[] = [
    {
      name: "returns the original string if no interpolation variables",
      str: "test",
      variables: [],
      expected: "test",
    },
    {
      name: "returns the original string if interpolation variables don't exist",
      str: "test",
      variables: [{ varName: "var1", value: "0" }],
      expected: "test",
    },
    {
      name: "interpolates at start of string",
      str: "var1 + 45",
      variables: [{ varName: "var1", value: "5" }],
      expected: "(5) + 45",
    },
    {
      name: "interpolates in middle of string",
      str: "45 + var1 + 45",
      variables: [{ varName: "var1", value: "5" }],
      expected: "45 + (5) + 45",
    },
    {
      name: "interpolates at end of string",
      str: "45 + var1",
      variables: [{ varName: "var1", value: "5" }],
      expected: "45 + (5)",
    },
    {
      name: "interpolates multiple variables",
      str: "45 + var1var1var2",
      variables: [
        { varName: "var1", value: "5" },
        { varName: "var2", value: "2*3" },
      ],
      expected: "45 + (5)(5)(2*3)",
    },
    {
      name: "handles non-BMP variable names and values",
      str: "45 + 💥💥💥💥💥💥var2",
      variables: [
        { varName: "💥💥💥", value: "💁👌😍大-은 " },
        { varName: "var2", value: "2*3" },
      ],
      expected: "45 + (💁👌😍大-은 )(💁👌😍大-은 )(2*3)",
    },

    {
      name: "interpolates nested variable",
      str: "var1 + 1",
      variables: [
        { varName: "var2", value: "1" }, // order matters
        { varName: "var1", value: "var2 + 1" },
      ],
      expected: "((1) + 1) + 1",
    },
    {
      name: "interpolates deeply nested variable",
      str: "var1",
      variables: [
        { varName: "var4", value: "4" },
        { varName: "var3", value: "var4 + 3" },
        { varName: "var2", value: "var3 + 2" }, // order matters
        { varName: "var1", value: "var2 + 1" },
      ],
      expected: "((((4) + 3) + 2) + 1)",
    },
  ];

  for (const c of cases) {
    it(c.name, () => {
      expect(interpolateString(c.str, c.variables)).toBe(c.expected);
    });
  }
});
