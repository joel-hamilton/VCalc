import runes from "runes";

import { ISelection } from "../types";

/**
 * TextInput's `selection` doesn't work well with non-BMP chars. This function
 * converts the native selection values to 'visual' selection values, which correspond
 * to the number of chars on the screen.
 *
 * Eg: "🥕🥕🥕<CARET>🥕" has a native selection of `{start: 6, end: 6}`, which is converted
 * by this function to `{start: 3, end: 3}`
 */
export const convertSelection = (baseStr: string, selection: ISelection) => {
  const runesUntilStart = runes(baseStr.substring(0, selection.start)).length;

  const runesUntilEnd =
    selection.end === selection.start
      ? runesUntilStart
      : runes(baseStr.substring(0, selection.end)).length;

  return { start: runesUntilStart, end: runesUntilEnd };
};

/**
 * Reverse the calculation in `convertSelection`
 *
 *  * Eg: "🥕🥕🥕<CARET>🥕" has a converted selection of `{start: 3, end: 3}`, which is converted
 * by this function to `{start: 6, end: 6}`
 */
export const unconvertSelection = (
  baseStr: string,
  convertedSelection: ISelection
) => {
  const r = runes(baseStr);
  const runesUntilStart = r.slice(0, convertedSelection.start);
  const runesUntilEnd = r.slice(0, convertedSelection.end);

  const nativeCharsUntilStart = runesUntilStart.join("").length;
  const nativeCharsUntilEnd = runesUntilEnd.join("").length;

  return { start: nativeCharsUntilStart, end: nativeCharsUntilEnd };
};
