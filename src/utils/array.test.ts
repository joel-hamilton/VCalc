import { ISelection, IVariable } from "../types";
import {
  backspaceAtSelection,
  insertAtSelection,
  interpolate,
  wrapAtSelection,
} from "./array";

describe("backspaceAtSelection", () => {
  const cases: {
    name: string;
    strArr: string[];
    selection: ISelection;
    expected: [string[], ISelection];
  }[] = [
    {
      name: "does nothing if selection start/end is 0",
      strArr: ["t", "e", "s", "t"],
      selection: { start: 0, end: 0 },
      expected: [["t", "e", "s", "t"], { start: 0, end: 0 }],
    },
    {
      name: "removes the last character if selection start is undefined",
      strArr: ["t", "e", "s", "t"],
      selection: { start: undefined, end: undefined },
      expected: [["t", "e", "s"], { start: undefined, end: undefined }],
    },
    {
      name: "removes the last character if selection start/end equals bastStr.length",
      strArr: ["t", "e", "s", "t"],
      selection: { start: 4, end: 4 },
      expected: [["t", "e", "s"], { start: 3, end: 3 }],
    },
    {
      name: "removes the correct character if selection start/end in middle of string",
      strArr: ["t", "e", "s", "t"],
      selection: { start: 2, end: 2 },
      expected: [["t", "s", "t"], { start: 1, end: 1 }],
    },
    {
      name: "removes the first character if selection start/end is 1",
      strArr: ["t", "e", "s", "t"],
      selection: { start: 1, end: 1 },
      expected: [["e", "s", "t"], { start: 0, end: 0 }],
    },
    {
      name: "removes the selected range at start",
      strArr: ["t", "e", "s", "t"],
      selection: { start: 0, end: 2 },
      expected: [["s", "t"], { start: 0, end: 0 }],
    },
    {
      name: "removes the selected range in middle",
      strArr: ["t", "e", "s", "t"],
      selection: { start: 1, end: 3 },
      expected: [["t", "t"], { start: 1, end: 1 }],
    },
    {
      name: "removes the selected range at end",
      strArr: ["t", "e", "s", "t"],
      selection: { start: 2, end: 4 },
      expected: [["t", "e"], { start: 2, end: 2 }],
    },
  ];
  for (const c of cases) {
    it(c.name, () => {
      expect(backspaceAtSelection(c.strArr, c.selection)).toEqual(c.expected);
    });
  }
});

describe("insertAtSelection", () => {
  const cases: {
    name: string;
    str: string;
    strArr: string[];
    selection: ISelection;
    expected: [string[], ISelection];
  }[] = [
    {
      name: "does nothing and returns same selection if the str is empty",
      str: "",
      strArr: ["b"],
      selection: { start: 0, end: 0 },
      expected: [["b"], { start: 0, end: 0 }],
    },
    {
      name: "inserts the correct string at the beginning if selection start/end is 0",
      str: "a",
      strArr: ["b"],
      selection: { start: 0, end: 0 },
      expected: [["a", "b"], { start: 1, end: 1 }],
    },
    {
      name: "inserts the correct string at the end if selection start/end at end of `strArr`",
      str: "a",
      strArr: ["b"],
      selection: { start: 1, end: 1 },
      expected: [["b", "a"], { start: 2, end: 2 }],
    },
    {
      name: "inserts groups of characters characters correctly in middle",
      str: "💁👌😍大-은 ",
      strArr: ["💥", "💥", "💥"],
      selection: { start: 2, end: 2 },
      expected: [["💥", "💥", "💁👌😍大-은 ", "💥"], { start: 3, end: 3 }],
    },

    {
      name: "inserts groups of characters characters correctly with range",
      str: "💁👌",
      strArr: ["💥", "💥", "💥", "💥"],
      selection: { start: 1, end: 3 },
      expected: [["💥", "💁👌", "💥"], { start: 2, end: 2 }],
    },
  ];

  for (const c of cases) {
    it(c.name, () => {
      expect(insertAtSelection(c.str, c.strArr, c.selection)).toEqual(
        c.expected
      );
    });
  }
});

describe("wrapAtSelection", () => {
  const cases: {
    name: string;
    baseStrArr: string[];
    prependStr: string;
    appendStr: string;
    selection: ISelection;
    expected: [string[], ISelection];
  }[] = [
    {
      name: "it does nothing if there is no before or after string",
      baseStrArr: ["t", "e", "s", "t"],
      prependStr: "",
      appendStr: "",
      selection: { start: 2, end: 4 },
      expected: [["t", "e", "s", "t"], { start: 2, end: 4 }],
    },
    {
      name: "it wraps nothing at the end if selection is undefined",
      baseStrArr: ["t", "e", "s", "t"],
      prependStr: "(",
      appendStr: ")",
      selection: { start: undefined, end: undefined },
      expected: [["t", "e", "s", "t", "(", ")"], { start: 5, end: 5 }],
    },
    {
      name: "it wraps nothing at the beginning if selection start/end is 0",
      baseStrArr: ["t", "e", "s", "t"],
      prependStr: "(",
      appendStr: ")",
      selection: { start: 0, end: 0 },
      expected: [["(", ")", "t", "e", "s", "t"], { start: 1, end: 1 }],
    },
    {
      name: "it wraps a range",
      baseStrArr: ["t", "e", "s", "t"],
      prependStr: "~",
      appendStr: "*",
      selection: { start: 1, end: 3 },
      expected: [["t", "~", "e", "s", "*", "t"], { start: 4, end: 4 }],
    },
    {
      name: "it wraps nothing correctly when no baseStrArr exists and selection is undefined",
      baseStrArr: [],
      prependStr: "*",
      appendStr: "*",
      selection: { start: undefined, end: undefined },
      expected: [["*", "*"], { start: 1, end: 1 }],
    },
    {
      name: "it wraps nothing correctly when no baseStrArr exists and selection is at 0",
      baseStrArr: [],
      prependStr: "*",
      appendStr: "*",
      selection: { start: 0, end: 0 },
      expected: [["*", "*"], { start: 1, end: 1 }],
    },
  ];

  for (const c of cases) {
    it(c.name, () => {
      expect(
        wrapAtSelection(c.baseStrArr, c.prependStr, c.appendStr, c.selection)
      ).toEqual(c.expected);
    });
  }
});


describe("interpolate", () => {
  const cases: {
    name: string;
    strArr: string[];
    variables: IVariable[];
    expected: string;
  }[] = [
    {
      name: "returns the original string if no interpolation variables",
      strArr: ["t", "e", "s", "t"],
      variables: [],
      expected: "test",
    },
    {
      name: "returns the original string if interpolation variables don't exist",
      strArr: ["t", "e", "s", "t"],
      variables: [{ varName: "var1", value: "0" }],
      expected: "test",
    },
    {
      name: "interpolates at start of string",
      strArr: ["var1", "+", "4", "5"],
      variables: [{ varName: "var1", value: "5" }],
      expected: "5+45",
    },
    {
      name: "interpolates spaces correctly",
      strArr: ["var1", " ", "+", " ", "4", "5"],
      variables: [{ varName: "var1", value: "5" }],
      expected: "5 + 45",
    },
    // {
    //   name: "interpolates in middle of string",
    //   str: "45 + var1 + 45",
    //   variables: [{ varName: "var1", value: "5" }],
    //   expected: "45 + (5) + 45",
    // },
    // {
    //   name: "interpolates at end of string",
    //   str: "45 + var1",
    //   variables: [{ varName: "var1", value: "5" }],
    //   expected: "45 + (5)",
    // },
    // {
    //   name: "interpolates multiple variables",
    //   str: "45 + var1var1var2",
    //   variables: [
    //     { varName: "var1", value: "5" },
    //     { varName: "var2", value: "2*3" },
    //   ],
    //   expected: "45 + (5)(5)(2*3)",
    // },
    // {
    //   name: "handles non-BMP variable names and values",
    //   str: "45 + 💥💥💥💥💥💥var2",
    //   variables: [
    //     { varName: "💥💥💥", value: "💁👌😍大-은 " },
    //     { varName: "var2", value: "2*3" },
    //   ],
    //   expected: "45 + (💁👌😍大-은 )(💁👌😍大-은 )(2*3)",
    // },

    // {
    //   name: "interpolates nested variable",
    //   str: "var1 + 1",
    //   variables: [
    //     { varName: "var2", value: "1" }, // order matters
    //     { varName: "var1", value: "var2 + 1" },
    //   ],
    //   expected: "((1) + 1) + 1",
    // },
    // {
    //   name: "interpolates deeply nested variable",
    //   str: "var1",
    //   variables: [
    //     { varName: "var4", value: "4" },
    //     { varName: "var3", value: "var4 + 3" },
    //     { varName: "var2", value: "var3 + 2" }, // order matters
    //     { varName: "var1", value: "var2 + 1" },
    //   ],
    //   expected: "((((4) + 3) + 2) + 1)",
    // },
  ];

  for (const c of cases) {
    it(c.name, () => {
      expect(interpolate(c.strArr, c.variables)).toBe(c.expected);
    });
  }
});
