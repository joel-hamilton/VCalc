import { merge } from 'lodash';

import { DarkTheme, DefaultTheme, useTheme as reactUseTheme } from '@react-navigation/native';

import { ITheme } from './types';

export const MyDefaultTheme: ITheme = merge(DefaultTheme, {
  colors: {
    primary: "#e99535",
    danger: "red",
    background: "#fff",
    border: "#ccc",
    card: "#f9f9f9",
    text: "#222",
    secondaryText: "#aaa",
    variableBackground: "#e1ac6e",
    button: "#eee",
    buttonPressed: "#ddd",
    buttonHighlight: "#ff941a",
    buttonHighlightPressed: "#d77c15",
    buttonVariable: "#777",
    buttonVariablePressed: "#888",
  },
});

export const MyDarkTheme: ITheme = merge(DarkTheme, {
  colors: {
    primary: "#e99535",
    danger: "red",
    background: "#444",
    border: "#222",
    card: "#545454",
    text: "#fafafa",
    secondaryText: "#aaa",
    variableBackground: "#e1ac6e",
    button: "#333",
    buttonPressed: "#222",
    buttonHighlight: "#01243c",
    buttonHighlightPressed: "#011e32",
    buttonVariable: "#666",
    buttonVariablePressed: "#555",
  },
});

export const useTheme = () => reactUseTheme() as unknown as ITheme;
