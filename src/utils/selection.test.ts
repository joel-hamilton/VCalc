import { ISelection } from "../types";
import { isCaretAtIndex } from "./selection";

describe("isCaretAtIndex", () => {
  const cases: {
    name: string;
    selection: ISelection;
    index: number;
    expected: boolean;
  }[] = [
    {
      name: "is true when start/end selection are the same and match the index",
      selection: { start: 0, end: 0 },
      index: 0,
      expected: true,
    },
    {
      name: "if false when start/end selection are different",
      selection: { start: 0, end: 2 },
      index: 0,
      expected: false,
    }
  ];

  for (const c of cases) {
    it(c.name, () => {
      expect(isCaretAtIndex(c.selection, c.index)).toBe(c.expected);
    });
  }
});
