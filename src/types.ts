import Pictos from "./Pictos";

export interface IPicto {
  type: "string" | "variable";

  // STRING_VARIABLE_KEY if type is 'variable'
  // PICTOS if type is string and we're not at leaf node
  // STRING_LITERAL if type is 'string' anbd we're at leaf node
  nodes: string | Pictos;
}

export interface IVariable {
  varName: Pictos;
  nodes: Pictos;
  key: string;
}

export interface ILayout {
  left: number;
  top: number;
  width: number;
  height: number;
}

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
  variablesViewH: number;
  keyboardVisible: boolean;
  operatorEditModeH: number;
  variablesViewPeek: number;
  translateYEditMode:number;
}
export interface IContext {
  useDarkTheme: boolean;
  variables: IVariable[];
  dimensions: IDimensions;
  isEditMode: boolean;
}

export type IInsertAtSelection = (
  charOrVariableKeyString: string,
  isVariable?: boolean
) => void;

export type ISetDisplay = (pictos: Pictos) => void;
export type IBackspace = () => void;
export type IWrapString = (prependPictos: Pictos, appendPictos: Pictos) => void;
type ISetDarkMode = (useDarkTheme: boolean) => void;
type IAddVariable = (variable: IVariable) => void;
type IDeleteVariable = (variableIndex: number) => void;
type IUpdateVariable = (
  variableUpdates: Partial<IVariable>,
  index: number
) => void;
type ISetDimensions = (dimensions: IDimensions) => void;
type ISetIsEditMode = (isEditmode: boolean) => void;
export interface IActions {
  ctxSetUseDarkMode: ISetDarkMode;
  ctxAddVariable: IAddVariable;
  ctxDeleteVariable: IDeleteVariable;
  ctxUpdateVariable: IUpdateVariable;
  ctxSetDimensions: ISetDimensions;
  ctxSetIsEditMode: ISetIsEditMode;
}

export type ICreateActions = (setContext: any) => IActions;
