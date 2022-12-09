export interface ISelection {
  start: number | undefined;
  end: number | undefined;
}

export interface ILayout {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface IVariable {
  varName: string;
  value: string;
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
