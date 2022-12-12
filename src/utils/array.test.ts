// import { INode, ISelection, IVariable } from "../types";
// import {
//   backspaceAtSelection,
//   insertAtSelection,
//   interpolate,
//   wrapAtSelection,
// } from "./array";

// const testDisplayNodes: INode[] = [
//   { type: "string", nodes: "t" },
//   { type: "string", nodes: "e" },
//   { type: "string", nodes: "s" },
//   { type: "string", nodes: "t" },
// ];

// describe("backspaceAtSelection", () => {
//   const cases: {
//     name: string;
//     displayNodes: INode[];
//     selection: ISelection;
//     expected: [INode[], ISelection];
//   }[] = [
//     {
//       name: "does nothing if selection start/end is 0",
//       displayNodes: testDisplayNodes,
//       selection: { start: 0, end: 0 },
//       expected: [testDisplayNodes, { start: 0, end: 0 }],
//     },
//     {
//       name: "removes the last character if selection start is undefined",
//       displayNodes: testDisplayNodes,
//       selection: { start: undefined, end: undefined },
//       expected: [
//         testDisplayNodes.slice(0, testDisplayNodes.length - 1),
//         { start: undefined, end: undefined },
//       ],
//     },
//     {
//       name: "removes the last character if selection start/end equals bastStr.length",
//       displayNodes: testDisplayNodes,
//       selection: { start: 4, end: 4 },
//       expected: [
//         testDisplayNodes.slice(0, testDisplayNodes.length - 1),
//         { start: 3, end: 3 },
//       ],
//     },
//     {
//       name: "removes the correct character if selection start/end in middle of string",
//       displayNodes: testDisplayNodes,
//       selection: { start: 2, end: 2 },
//       expected: [
//         testDisplayNodes.slice(0, 1).concat(testDisplayNodes.slice(2)),
//         { start: 1, end: 1 },
//       ],
//     },
//     // {
//     //   name: "removes the first character if selection start/end is 1",
//     //   displayNodes: ["t", "e", "s", "t"],
//     //   selection: { start: 1, end: 1 },
//     //   expected: [["e", "s", "t"], { start: 0, end: 0 }],
//     // },
//     // {
//     //   name: "removes the selected range at start",
//     //   displayNodes: ["t", "e", "s", "t"],
//     //   selection: { start: 0, end: 2 },
//     //   expected: [["s", "t"], { start: 0, end: 0 }],
//     // },
//     {
//       name: "removes the selected range in middle",
//       displayNodes: testDisplayNodes,
//       selection: { start: 1, end: 3 },
//       expected: [
//         testDisplayNodes.slice(0, 1).concat(testDisplayNodes.slice(3)),

//         { start: 1, end: 1 },
//       ],
//     },
//     // {
//     //   name: "removes the selected range at end",
//     //   displayNodes: ["t", "e", "s", "t"],
//     //   selection: { start: 2, end: 4 },
//     //   expected: [["t", "e"], { start: 2, end: 2 }],
//     // },
//   ];
//   for (const c of cases) {
//     it(c.name, () => {
//       expect(backspaceAtSelection(c.displayNodes, c.selection)).toEqual(
//         c.expected
//       );
//     });
//   }
// });

// describe("insertAtSelection", () => {
//   const cases: {
//     name: string;
//     insertNodes: INode[];
//     displayNodes: INode[];
//     selection: ISelection;
//     expected: [INode[], ISelection];
//   }[] = [
//     {
//       name: "does nothing and returns same selection if the str is empty",
//       insertNodes: [],
//       displayNodes: testDisplayNodes,
//       selection: { start: 0, end: 0 },
//       expected: [testDisplayNodes, { start: 0, end: 0 }],
//     },
//     {
//       name: "inserts the correct string at the beginning if selection start/end is 0",
//       insertNodes: [{ type: "string", nodes: "b" }],
//       displayNodes: testDisplayNodes,
//       selection: { start: 0, end: 0 },
//       expected: [
//         [{ type: "string", nodes: "b" } as INode].concat(testDisplayNodes),
//         { start: 1, end: 1 },
//       ],
//     },
//     {
//       name: "inserts multiple nodes correctly",
//       insertNodes: [
//         { type: "string", nodes: "X" },
//         { type: "string", nodes: "X" },
//       ],
//       displayNodes: testDisplayNodes,
//       selection: { start: 0, end: 0 },
//       expected: [
//         (
//           [
//             { type: "string", nodes: "X" },
//             { type: "string", nodes: "X" },
//           ] as INode[]
//         ).concat(testDisplayNodes),
//         { start: 2, end: 2 },
//       ],
//     },
//     // {
//     //   name: "inserts the correct string at the end if selection start/end at end of `displayNodes`",
//     //   str: "a",
//     //   displayNodes: ["b"],
//     //   selection: { start: 1, end: 1 },
//     //   expected: [["b", "a"], { start: 2, end: 2 }],
//     // },
//     // {
//     //   name: "inserts groups of characters characters correctly in middle",
//     //   str: "💁👌😍大-은 ",
//     //   displayNodes: ["💥", "💥", "💥"],
//     //   selection: { start: 2, end: 2 },
//     //   expected: [["💥", "💥", "💁👌😍大-은 ", "💥"], { start: 3, end: 3 }],
//     // },

//     // {
//     //   name: "inserts groups of characters characters correctly with range",
//     //   str: "💁👌",
//     //   displayNodes: ["💥", "💥", "💥", "💥"],
//     //   selection: { start: 1, end: 3 },
//     //   expected: [["💥", "💁👌", "💥"], { start: 2, end: 2 }],
//     // },
//   ];

//   for (const c of cases) {
//     it(c.name, () => {
//       expect(
//         insertAtSelection(c.insertNodes, c.displayNodes, c.selection)
//       ).toEqual(c.expected);
//     });
//   }
// });

// describe("wrapAtSelection", () => {
//   const cases: {
//     name: string;
//     displayNodes: INode[];
//     prependNodes: INode[];
//     appendNodes: INode[];
//     selection: ISelection;
//     expected: [INode[], ISelection];
//   }[] = [
//     // {
//     //   name: "it does nothing if there is no before or after string",
//     //   baseStrArr: baseDisplayNode,
//     //   prependStr: "",
//     //   appendStr: "",
//     //   selection: { start: 2, end: 4 },
//     //   expected: [baseDisplayNode, { start: 2, end: 4 }],
//     // },
//     {
//       name: "it wraps nothing at the end if selection is undefined",
//       displayNodes: testDisplayNodes,
//       prependNodes: [{ type: "string", nodes: "(" }],
//       appendNodes: [{ type: "string", nodes: ")" }],
//       selection: { start: undefined, end: undefined },
//       expected: [
//         testDisplayNodes.concat([
//           { type: "string", nodes: "(" },
//           { type: "string", nodes: ")" },
//         ]),
//         { start: 5, end: 5 },
//       ],
//     },
//     // {
//     //   name: "it wraps nothing at the beginning if selection start/end is 0",
//     //   baseStrArr: ["t", "e", "s", "t"],
//     //   prependStr: "(",
//     //   appendStr: ")",
//     //   selection: { start: 0, end: 0 },
//     //   expected: [["(", ")", "t", "e", "s", "t"], { start: 1, end: 1 }],
//     // },
//     // {
//     //   name: "it wraps a range",
//     //   baseStrArr: ["t", "e", "s", "t"],
//     //   prependStr: "~",
//     //   appendStr: "*",
//     //   selection: { start: 1, end: 3 },
//     //   expected: [["t", "~", "e", "s", "*", "t"], { start: 4, end: 4 }],
//     // },
//     // {
//     //   name: "it wraps nothing correctly when no baseStrArr exists and selection is undefined",
//     //   baseStrArr: [],
//     //   prependStr: "*",
//     //   appendStr: "*",
//     //   selection: { start: undefined, end: undefined },
//     //   expected: [["*", "*"], { start: 1, end: 1 }],
//     // },
//     // {
//     //   name: "it wraps nothing correctly when no baseStrArr exists and selection is at 0",
//     //   baseStrArr: [],
//     //   prependStr: "*",
//     //   appendStr: "*",
//     //   selection: { start: 0, end: 0 },
//     //   expected: [["*", "*"], { start: 1, end: 1 }],
//     // },
//   ];

//   for (const c of cases) {
//     it(c.name, () => {
//       expect(
//         wrapAtSelection(
//           c.displayNodes,
//           c.prependNodes,
//           c.appendNodes,
//           c.selection
//         )
//       ).toEqual(c.expected);
//     });
//   }
// });

// describe("interpolate", () => {
//   const cases: {
//     name: string;
//     displayNodes: INode[];
//     variables: IVariable[];
//     useDisplayValues?: boolean;
//     expected: string;
//   }[] = [
//     // {
//     //   name: "returns the original string if no interpolation variables",
//     //   displayNodes: [
//     //     { type: "string", nodes: "t" },
//     //     { type: "string", nodes: "e" },
//     //     { type: "string", nodes: "s" },
//     //     { type: "string", nodes: "t" },
//     //   ],
//     //   variables: [],
//     //   expected: "test",
//     // },
//     // {
//     //   name: "returns the original string if interpolation variables don't exist",
//     //   displayNodes: [
//     //     { type: "string", nodes: "t" },
//     //     { type: "string", nodes: "e" },
//     //     { type: "string", nodes: "s" },
//     //     { type: "string", nodes: "t" },
//     //   ],
//     //   variables: [{ varName: "var1", nodes: [{ type: "string", nodes: "5" }] }],
//     //   expected: "test",
//     // },
//     {
//       name: "interpolates at start of string",
//       displayNodes: [
//         { type: "variable", nodes: "var1" },
//         { type: "string", nodes: "+" },
//         { type: "string", nodes: "5" },
//       ],
//       variables: [{ varName: "var1", nodes: [{ type: "string", nodes: "5" }] }],
//       expected: "5+5",
//     },
//     {
//       name: "interpolates spaces correctly",
//       displayNodes: [
//         { type: "variable", nodes: "var1" },
//         { type: "string", nodes: " " },
//         { type: "string", nodes: "+" },
//         { type: "string", nodes: " " },
//         { type: "string", nodes: "4" },
//         { type: "string", nodes: "5" },
//       ],
//       variables: [{ varName: "var1", nodes: [{ type: "string", nodes: "5" }] }],
//       expected: "5 + 45",
//     },
//     {
//       name: "converts '*' to 'x' and '/' to '÷'",
//       displayNodes: [
//         { type: "string", nodes: "2" },
//         { type: "string", nodes: "*", displayValue: "x" },
//         { type: "string", nodes: "4" },
//         { type: "string", nodes: "/", displayValue: "÷" },
//         { type: "string", nodes: "5" },
//       ],
//       useDisplayValues: true,
//       variables: [],
//       expected: "2x4÷5",
//     },
//     // {
//     //   name: "interpolates in middle of string",
//     //   displayNodes: ["4", "5", " ", "+", " ", "var1", " ", "+", " ", "4", "5"],
//     //   variables: [{ varName: "var1", nodes: [{ type: "string", nodes: "5" }] }],
//     //   expected: "45 + 5 + 45",
//     // },
//     // {
//     //   name: "interpolates at end of string",
//     //   str: "45 + var1",
//     //   variables: [{ varName: "var1", nodes: "5" }],
//     //   expected: "45 + (5)",
//     // },
//     // {
//     //   name: "interpolates multiple variables",
//     //   str: "45 + var1var1var2",
//     //   variables: [
//     //     { varName: "var1", nodes: "5" },
//     //     { varName: "var2", nodes: "2*3" },
//     //   ],
//     //   expected: "45 + (5)(5)(2*3)",
//     // },
//     // {
//     //   name: "handles non-BMP variable names and values",
//     //   str: "45 + 💥💥💥💥💥💥var2",
//     //   variables: [
//     //     { varName: "💥💥💥", nodes: "💁👌😍大-은 " },
//     //     { varName: "var2", nodes: "2*3" },
//     //   ],
//     //   expected: "45 + (💁👌😍大-은 )(💁👌😍大-은 )(2*3)",
//     // },

//     {
//       name: "interpolates nested variable",
//       displayNodes: [
//         { type: "variable", nodes: "var1" },
//         { type: "string", nodes: "+" },
//         { type: "string", nodes: "1" },
//       ],
//       variables: [
//         { varName: "var2", nodes: [{ type: "string", nodes: "3" }] }, // order matters
//         {
//           varName: "var1",
//           nodes: [
//             { type: "variable", nodes: "var2" },
//             { type: "string", nodes: "+" },
//             { type: "string", nodes: "2" },
//           ],
//         },
//       ],
//       expected: "3+2+1",
//     },
//     // {
//     //   name: "interpolates deeply nested variable",
//     //   str: "var1",
//     //   variables: [
//     //     { varName: "var4", nodes: "4" },
//     //     { varName: "var3", nodes: "var4 + 3" },
//     //     { varName: "var2", nodes: "var3 + 2" }, // order matters
//     //     { varName: "var1", nodes: "var2 + 1" },
//     //   ],
//     //   expected: "((((4) + 3) + 2) + 1)",
//     // },
//   ];

//   for (const c of cases) {
//     it(c.name, () => {
//       expect(interpolate(c.displayNodes, c.variables, c.useDisplayValues)).toBe(
//         c.expected
//       );
//     });
//   }
// });
