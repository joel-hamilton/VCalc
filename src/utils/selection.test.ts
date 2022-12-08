import { ISelection } from "../types";
import { convertSelection, unconvertSelection } from "./selection";

describe("convertSelection", () => {
  const cases: {
    name: string;
    baseStr: string;
    selection: ISelection;
    expectedSelection: ISelection;
  }[] = [
    {
      name: "it returns the same selection when no non-BMP chars exist",
      baseStr: "testing",
      selection: { start: 2, end: 2 },
      expectedSelection: { start: 2, end: 2 },
    },
    {
      name: "it returns the same selection when non-BMP chars exist and selection is at start",
      baseStr: "🥕🥕🥕",
      selection: { start: 0, end: 0 },
      expectedSelection: { start: 0, end: 0 },
    },
    {
      name: "it returns the correct selection when non-BMP chars exist and caret is not at start",
      baseStr: "🥕🥕🥕",
      selection: { start: 4, end: 4 },
      expectedSelection: { start: 2, end: 2 },
    },
    {
      name: "it returns the correct selection when non-BMP chars exist and selection is not at start",
      baseStr: "🥕🥕4🥕",
      selection: { start: 4, end: 7 },
      expectedSelection: { start: 2, end: 4 },
    },
  ];

  for (const c of cases) {
    it(c.name, () => {
      expect(convertSelection(c.baseStr, c.selection)).toEqual(
        c.expectedSelection
      );
    });
  }
});

describe("unconvertSelection", () => {
  const cases: {
    name: string;
    baseStr: string;
    convertedSelection: ISelection;
    expectedNativeSelection: ISelection;
  }[] = [
    {
      name: "it returns the same selection when no non-BMP chars exist",
      baseStr: "testing",
      convertedSelection: { start: 2, end: 2 },
      expectedNativeSelection: { start: 2, end: 2 },
    },
    {
      name: "it returns the same selection when non-BMP chars exist and selection is at start",
      baseStr: "🥕🥕🥕",
      convertedSelection: { start: 0, end: 0 },
      expectedNativeSelection: { start: 0, end: 0 },
    },
    {
      name: "it returns the correct selection when non-BMP chars exist and caret is not at start",
      baseStr: "🥕🥕🥕",
      convertedSelection: { start: 2, end: 2 },
      expectedNativeSelection: { start: 4, end: 4 },
    },
    {
      name: "it returns the correct selection when non-BMP chars exist and selection is not at start",
      baseStr: "🥕🥕4🥕",
      convertedSelection: { start: 2, end: 3 },
      expectedNativeSelection: { start: 4, end: 5 },
    },
  ];

  for (const c of cases) {
    it(c.name, () => {
      expect(unconvertSelection(c.baseStr, c.convertedSelection)).toEqual(
        c.expectedNativeSelection
      );
    });
  }
});
