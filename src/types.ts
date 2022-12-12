import Pictos from "./utils/Pictos";

export enum OperatorsWithExtraSpace {
  "*" = "*",
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
  displayValue?: string;
  varName?: INode[];
}

export interface IPicto {
  type: "string" | "variable";
  nodes: string | Pictos;
  varName?: Pictos; // variables will have
}

export interface ILayout {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface IVariable {
  varName: Pictos;
  nodes: Pictos;
  key: string;
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

export interface IDimensions {
  screenH: number;
  screenW: number;
  headerH: number;
  displayH: number;
  inputH: number;
  variableScrollViewH: number;
  keyboardH: number;
  keyboardVisible: boolean;
  operatorEditModeH: number;
}
export interface IContext {
  useDarkTheme: boolean;
  variables: IVariable[];
  dimensions: IDimensions;
  isEditMode: boolean;
}

export interface IInsertOptions {
  type?: "string" | "variable";
  varName?: Pictos;
}
