export interface ISelection {
  start: number | undefined;
  end: number | undefined;
}

export interface IDisplayNode {
  type: "string" | "variable";
  value: string | IDisplayNode[]; // value exists only if it's `type: string`
}
export interface ILayout {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface IVariable {
  varName: string;
  value: IDisplayNode[];
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
    button: string;
    buttonPressed: string;
    buttonHighlight: string;
    buttonHighlightPressed: string;
    buttonVariable: string;
    buttonVariablePressed: string;
  };
}
