import { merge } from 'lodash';

import { DarkTheme, DefaultTheme, useTheme as reactUseTheme } from '@react-navigation/native';

import { ITheme } from './types';

export const MyDefaultTheme: ITheme = merge(DefaultTheme, {
  colors: {
    primary: "#e99535",
    primaryPressed: "#d77c15",
    danger: "red",
    background: "#fff",
    border: "#ccc",
    card: "#f9f9f9",
    text: "#222",
    secondaryText: "#aaa",
    button: "#eee",
    buttonPressed: "#ddd",
  },
});

export const MyDarkTheme: ITheme = merge(DarkTheme, {
  colors: {
    primary: "#e99535",
    primaryPressed: "#011e32",
    danger: "red",
    background: "#444",
    border: "#222",
    card: "#545454",
    text: "#fafafa",
    secondaryText: "#aaa",
    button: "#333",
    buttonPressed: "#222",
  },
});

export const useTheme = () => reactUseTheme() as unknown as ITheme;
