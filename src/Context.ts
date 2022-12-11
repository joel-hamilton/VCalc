import React from "react";
import { IContext, IDimensions, INode, IVariable } from "./types";

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

const setDimensions = (setContext) => (dimensions: IDimensions) => {
  setContext((context: IContext) => ({
    ...context,
    dimensions,
  }));
};

const isEditMode = (setContext) => (isEditMode) => {
  console.log(`SETTING EDITING TO ${isEditMode}`);
  setContext(
    (context): IContext => ({
      ...context,
      isEditMode,
    })
  );
};

export const Context = React.createContext([]);

export const createActions = (setContext) => ({
  ctxSetUseDarkMode: setUseDarkMode(setContext),
  ctxAddVariable: addVariable(setContext),
  ctxDeleteVariable: deleteVariable(setContext),
  ctxSetDimensions: setDimensions(setContext),
  ctxSetIsEditMode: isEditMode(setContext),
});
