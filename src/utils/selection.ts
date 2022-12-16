import { ISelection } from "../types";

export const isCaretAtIndex = (selection: ISelection, index: number) => {
  return selection.start === selection.end && index === selection.start;
};
