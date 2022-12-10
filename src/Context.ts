import React from "react";
import { IContext, INode, IVariable } from "./types";

const setUseDarkMode = (setContext) => (useDarkTheme) =>
  setContext((context: IContext) => ({ ...context, useDarkTheme }));

const addVariable = (setContext) => (variable: IVariable) => {
  setContext((context: IContext) => ({
    ...context,
    variables: context.variables.concat(variable),
  }));
};

const deleteVariable = (setContext) => (index: number) => {
  setContext((context: IContext) => ({
    ...context,
    variables: context.variables
      .slice(0, index)
      .concat(context.variables.slice(index + 1)),
  }));
};

export const Context = React.createContext([]);
export const createActions = (setContext) => ({
  ctxSetUseDarkMode: setUseDarkMode(setContext),
  ctxAddVariable: addVariable(setContext),
  ctxDeleteVariable: deleteVariable(setContext)
});
