import React from 'react';

import { IContext, IDimensions, IVariable } from './types';

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

const updateVariable =
  (setContext) => (variableUpdates: Partial<IVariable>, index: number) => {
    setContext((context: IContext) => ({
      ...context,
      variables: context.variables
        .slice(0, index)
        .concat({ ...context.variables[index], ...variableUpdates })
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

export const Context = React.createContext<[IContext, any]>([] as any);

export const createActions = (setContext) => ({
  ctxSetUseDarkMode: setUseDarkMode(setContext),
  ctxAddVariable: addVariable(setContext),
  ctxDeleteVariable: deleteVariable(setContext),
  ctxUpdateVariable: updateVariable(setContext),
  ctxSetDimensions: setDimensions(setContext),
  ctxSetIsEditMode: isEditMode(setContext),
});
