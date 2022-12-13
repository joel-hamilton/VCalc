import Pictos from './Pictos';
import { ISelection, IVariable } from './types';

const testPictos = new Pictos([
  { type: "string", nodes: "t" },
  { type: "string", nodes: "e" },
  { type: "string", nodes: "s" },
  { type: "string", nodes: "t" },
]);

describe("backspaceAtSelection", () => {
  const cases: {
    name: string;
    displayPictos: Pictos;
    selection: ISelection;
    expected: [Pictos, ISelection];
  }[] = [
    {
      name: "does nothing if selection start/end is 0",
      displayPictos: testPictos,
      selection: { start: 0, end: 0 },
      expected: [testPictos, { start: 0, end: 0 }],
    },
    {
      name: "removes the last character if selection start is undefined",
      displayPictos: testPictos,
      selection: { start: undefined, end: undefined },
      expected: [
        testPictos.slice(0, testPictos.length - 1),
        { start: undefined, end: undefined },
      ],
    },
    {
      name: "removes the last character if selection start/end equals bastStr.length",
      displayPictos: testPictos,
      selection: { start: 4, end: 4 },
      expected: [
        testPictos.slice(0, testPictos.length - 1),
        { start: 3, end: 3 },
      ],
    },
    {
      name: "removes the correct character if selection start/end in middle of string",
      displayPictos: testPictos,
      selection: { start: 2, end: 2 },
      expected: [
        testPictos.slice(0, 1).concat(testPictos.slice(2)),
        { start: 1, end: 1 },
      ],
    },
    // {
    //   name: "removes the first character if selection start/end is 1",
    //   displayPictos: ["t", "e", "s", "t"],
    //   selection: { start: 1, end: 1 },
    //   expected: [["e", "s", "t"], { start: 0, end: 0 }],
    // },
    // {
    //   name: "removes the selected range at start",
    //   displayPictos: ["t", "e", "s", "t"],
    //   selection: { start: 0, end: 2 },
    //   expected: [["s", "t"], { start: 0, end: 0 }],
    // },
    {
      name: "removes the selected range in middle",
      displayPictos: testPictos,
      selection: { start: 1, end: 3 },
      expected: [
        testPictos.slice(0, 1).concat(testPictos.slice(3)),
        { start: 1, end: 1 },
      ],
    },
    // {
    //   name: "removes the selected range at end",
    //   displayPictos: ["t", "e", "s", "t"],
    //   selection: { start: 2, end: 4 },
    //   expected: [["t", "e"], { start: 2, end: 2 }],
    // },
  ];
  for (const c of cases) {
    it(c.name, () => {
      const [newPictos, newSelection] = c.displayPictos.backspaceAtSelection(
        c.selection
      );
      expect(newPictos.equals(c.expected[0])).toBe(true);
      expect(newSelection).toEqual(c.expected[1]);
    });
  }
});

describe("insertAtSelection", () => {
  const cases: {
    name: string;
    insertPictos: Pictos;
    displayPictos: Pictos;
    selection: ISelection;
    expected: [Pictos, ISelection];
  }[] = [
    {
      name: "does nothing and returns same selection if the str is empty",
      insertPictos: new Pictos([]),
      displayPictos: testPictos,
      selection: { start: 0, end: 0 },
      expected: [testPictos, { start: 0, end: 0 }],
    },
    {
      name: "inserts the correct string at the beginning if selection start/end is 0",
      insertPictos: new Pictos([{ type: "string", nodes: "b" }]),
      displayPictos: testPictos,
      selection: { start: 0, end: 0 },
      expected: [
        new Pictos([{ type: "string", nodes: "b" }]).concat(testPictos),
        { start: 1, end: 1 },
      ],
    },
    {
      name: "inserts multiple nodes correctly",
      insertPictos: new Pictos([
        { type: "string", nodes: "X" },
        { type: "string", nodes: "X" },
      ]),
      displayPictos: testPictos,
      selection: { start: 0, end: 0 },
      expected: [
        new Pictos([
          { type: "string", nodes: "X" },
          { type: "string", nodes: "X" },
        ]).concat(testPictos),
        { start: 2, end: 2 },
      ],
    },
    // {
    //   name: "inserts the correct string at the end if selection start/end at end of `displayPictos`",
    //   str: "a",
    //   displayPictos: ["b"],
    //   selection: { start: 1, end: 1 },
    //   expected: [["b", "a"], { start: 2, end: 2 }],
    // },
    // {
    //   name: "inserts groups of characters characters correctly in middle",
    //   str: "💁👌😍大-은 ",
    //   displayPictos: ["💥", "💥", "💥"],
    //   selection: { start: 2, end: 2 },
    //   expected: [["💥", "💥", "💁👌😍大-은 ", "💥"], { start: 3, end: 3 }],
    // },

    // {
    //   name: "inserts groups of characters characters correctly with range",
    //   str: "💁👌",
    //   displayPictos: ["💥", "💥", "💥", "💥"],
    //   selection: { start: 1, end: 3 },
    //   expected: [["💥", "💁👌", "💥"], { start: 2, end: 2 }],
    // },
  ];

  for (const c of cases) {
    it(c.name, () => {
      const [newPictos, newSelection] = c.displayPictos.insertAtSelection(
        c.insertPictos,
        c.selection
      );
      expect(newPictos.equals(c.expected[0])).toBe(true);
      expect(newSelection).toEqual(c.expected[1]);
    });
  }
});

describe("wrapAtSelection", () => {
  const cases: {
    name: string;
    displayPictos: Pictos;
    prependPictos: Pictos;
    appendPictos: Pictos;
    selection: ISelection;
    expected: [Pictos, ISelection];
  }[] = [
    // {
    //   name: "it does nothing if there is no before or after string",
    //   baseStrArr: baseDisplayNode,
    //   prependStr: "",
    //   appendStr: "",
    //   selection: { start: 2, end: 4 },
    //   expected: [baseDisplayNode, { start: 2, end: 4 }],
    // },
    {
      name: "it wraps nothing at the end if selection is undefined",
      displayPictos: testPictos,
      prependPictos: new Pictos([{ type: "string", nodes: "(" }]),
      appendPictos: new Pictos([{ type: "string", nodes: ")" }]),
      selection: { start: undefined, end: undefined },
      expected: [
        testPictos.concat(
          new Pictos([
            { type: "string", nodes: "(" },
            { type: "string", nodes: ")" },
          ])
        ),
        { start: 5, end: 5 },
      ],
    },
    // {
    //   name: "it wraps nothing at the beginning if selection start/end is 0",
    //   baseStrArr: ["t", "e", "s", "t"],
    //   prependStr: "(",
    //   appendStr: ")",
    //   selection: { start: 0, end: 0 },
    //   expected: [["(", ")", "t", "e", "s", "t"], { start: 1, end: 1 }],
    // },
    // {
    //   name: "it wraps a range",
    //   baseStrArr: ["t", "e", "s", "t"],
    //   prependStr: "~",
    //   appendStr: "*",
    //   selection: { start: 1, end: 3 },
    //   expected: [["t", "~", "e", "s", "*", "t"], { start: 4, end: 4 }],
    // },
    // {
    //   name: "it wraps nothing correctly when no baseStrArr exists and selection is undefined",
    //   baseStrArr: [],
    //   prependStr: "*",
    //   appendStr: "*",
    //   selection: { start: undefined, end: undefined },
    //   expected: [["*", "*"], { start: 1, end: 1 }],
    // },
    // {
    //   name: "it wraps nothing correctly when no baseStrArr exists and selection is at 0",
    //   baseStrArr: [],
    //   prependStr: "*",
    //   appendStr: "*",
    //   selection: { start: 0, end: 0 },
    //   expected: [["*", "*"], { start: 1, end: 1 }],
    // },
  ];

  for (const c of cases) {
    it(c.name, () => {
      const [newPictos, newSelection] = c.displayPictos.wrapAtSelection(
        c.prependPictos,
        c.appendPictos,
        c.selection
      );
      expect(newPictos.equals(c.expected[0])).toBe(true);
      expect(newSelection).toEqual(c.expected[1]);
    });
  }
});

describe("interpolate", () => {
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
    displayPictos: Pictos;
    variables: IVariable[];
    useDisplayValues?: boolean;
    expected: string;
  }[] = [
    // {
    //   name: "returns the original string if no interpolation variables",
    //   displayPictos: [
    //     { type: "string", nodes: "t" },
    //     { type: "string", nodes: "e" },
    //     { type: "string", nodes: "s" },
    //     { type: "string", nodes: "t" },
    //   ],
    //   variables: [],
    //   expected: "test",
    // },
    // {
    //   name: "returns the original string if interpolation variables don't exist",
    //   displayPictos: [
    //     { type: "string", nodes: "t" },
    //     { type: "string", nodes: "e" },
    //     { type: "string", nodes: "s" },
    //     { type: "string", nodes: "t" },
    //   ],
    //   variables: [{ varName: "var1", nodes: [{ type: "string", nodes: "5" }] }],
    //   expected: "test",
    // },
    {
      name: "interpolates at start of string",
      displayPictos: new Pictos([
        { type: "variable", nodes: TEST_KEY },
        { type: "string", nodes: "+" },
        { type: "string", nodes: "5" },
      ]),
      variables: [variablePictos],
      expected: "5+5",
    },
    {
      name: "interpolates spaces correctly",
      displayPictos: new Pictos([
        { type: "variable", nodes: TEST_KEY },
        { type: "string", nodes: " " },
        { type: "string", nodes: "+" },
        { type: "string", nodes: " " },
        { type: "string", nodes: "4" },
        { type: "string", nodes: "5" },
      ]),
      variables: [variablePictos],
      expected: "5 + 45",
    },
    // {
    //   name: "converts '*' to 'x' and '/' to '÷'",
    //   displayPictos: new Pictos([
    //     { type: "string", nodes: "2" },
    //     { type: "string", nodes: "*" },
    //     { type: "string", nodes: "4" },
    //     { type: "string", nodes: "/" },
    //     { type: "string", nodes: "5" },
    //   ]),
    //   useDisplayValues: true,
    //   variables: [],
    //   expected: "2x4÷5",
    // },
    // {
    //   name: "interpolates in middle of string",
    //   displayPictos: ["4", "5", " ", "+", " ", "var1", " ", "+", " ", "4", "5"],
    //   variables: [{ varName: "var1", nodes: [{ type: "string", nodes: "5" }] }],
    //   expected: "45 + 5 + 45",
    // },
    // {
    //   name: "interpolates at end of string",
    //   str: "45 + var1",
    //   variables: [{ varName: "var1", nodes: "5" }],
    //   expected: "45 + (5)",
    // },
    // {
    //   name: "interpolates multiple variables",
    //   str: "45 + var1var1var2",
    //   variables: [
    //     { varName: "var1", nodes: "5" },
    //     { varName: "var2", nodes: "2*3" },
    //   ],
    //   expected: "45 + (5)(5)(2*3)",
    // },
    // {
    //   name: "handles non-BMP variable names and values",
    //   str: "45 + 💥💥💥💥💥💥var2",
    //   variables: [
    //     { varName: "💥💥💥", nodes: "💁👌😍大-은 " },
    //     { varName: "var2", nodes: "2*3" },
    //   ],
    //   expected: "45 + (💁👌😍大-은 )(💁👌😍大-은 )(2*3)",
    // },

    {
      name: "interpolates nested variable",
      displayPictos: new Pictos([
        { type: "string", nodes: "0" },
        { type: "string", nodes: "+" },

        { type: "variable", nodes: TEST_KEY2 },
      ]),
      variables: [variablePictos, variablePictos2],
      expected: "0+5+10",
    },
    // {
    //   name: "interpolates deeply nested variable",
    //   str: "var1",
    //   variables: [
    //     { varName: "var4", nodes: "4" },
    //     { varName: "var3", nodes: "var4 + 3" },
    //     { varName: "var2", nodes: "var3 + 2" }, // order matters
    //     { varName: "var1", nodes: "var2 + 1" },
    //   ],
    //   expected: "((((4) + 3) + 2) + 1)",
    // },
  ];

  for (const c of cases) {
    it(c.name, () => {
      const str = c.displayPictos.toString(c.variables);
      expect(str).toBe(c.expected);
    });
  }
});
