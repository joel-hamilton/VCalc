import { Pictos } from "./classes/Pictos";
import { Variables } from "./classes/Variables";

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
    primaryPressed: string;
    danger: string;
    background: string;
    border: string;
    card: string;
    text: string;
    secondaryText: string;
    button: string;
    buttonPressed: string;
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
  operatorsHorizontalH: number;
  variablesViewPeek: number;
  translateYEditMode: number;
}
export interface IContext {
  useDarkTheme: boolean;
  variables: Variables;
  currentValue: Pictos;
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
type ISetCurrentValue = (currentValue: Pictos) => void;
type IAddVariable = (variable: Variables) => void;
type ISetVariables = (variable: Variables) => void;
type IDeleteVariable = (variableIndex: number) => true | string;
type IUpdateVariable = (
  variableUpdates: Partial<IVariable>,
  index: number
) => void;
type ISetDimensions = (dimensions: IDimensions) => void;
type ISetIsEditMode = (isEditmode: boolean) => void;
export interface IActions {
  ctxSetUseDarkMode: ISetDarkMode;
  ctxSetCurrentValue: ISetCurrentValue;
  ctxAddVariable: IAddVariable;
  ctxSetVariables: ISetVariables;
  ctxDeleteVariable: IDeleteVariable;
  ctxUpdateVariable: IUpdateVariable;
  ctxSetDimensions: ISetDimensions;
  ctxSetIsEditMode: ISetIsEditMode;
}

export type ICreateActions = (setContext: any) => IActions;
