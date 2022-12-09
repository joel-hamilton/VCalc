export enum OperatorsWithExtraSpace {
  "*" = '*',
  "+" = "+",
  "-" = "-",
  "/" = "/",
}
export interface ISelection {
  start: number | undefined;
  end: number | undefined;
}

export interface INode {
  type: "string" | "variable";
  nodes: string | INode[];
  varName?: string;
}
export interface ILayout {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface IVariable {
  varName: string;
  nodes: INode[];
}

export interface ITheme {
  dark: boolean;
  colors: {
    primary: string;
    danger: string;
    background: string;
    border: string;
    card: string;
    text: string;
    secondaryText: string;
    variableBackground: string;
    button: string;
    buttonPressed: string;
    buttonHighlight: string;
    buttonHighlightPressed: string;
    buttonVariable: string;
    buttonVariablePressed: string;
  };
}
