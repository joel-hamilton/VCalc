import runes from 'runes';

import { ISelection } from '../types';

/**
 * TextInput's `selection` doesn't work well with non-BMP chars. This function
 * converts the native selection values to 'visual' selection values, which correspond
 * to the number of chars on the screen.
 *
 * Eg: "🥕🥕🥕<CARET>🥕" has a native selection of `{start: 6, end: 6}`, which is converted
 * by this function to `{start: 3, end: 3}`
 */
export const convertSelection = (baseStr: string, selection: ISelection) => {
  // get start chars (native)
  const r1 = runes(baseStr.substring(0, selection.start));

  // get end chart (native)
  const r2 =
    selection.end === selection.start
      ? r1
      : runes(baseStr.substring(0, selection.end));

  return { start: r1.length, end: r2.length };
};
