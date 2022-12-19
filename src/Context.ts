import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { IContext, IDimensions, IVariable, IActions } from "./types";
import { Variables } from "./classes";

const setUseDarkMode = (setContext) => (useDarkTheme) =>
  setContext((context: IContext) => ({ ...context, useDarkTheme }));

const addVariable =
  (setContext) =>
  (variable: Variables, storeInAsyncStorage = true) => {
    setContext((context: IContext) => {
      const newContext = {
        ...context,
        variables: context.variables.concat(variable),
      };

      if (storeInAsyncStorage) {
        const serializedVars = newContext.variables.map((v) => {
          return { ...v, nodes: v.nodes.serialize(), varName: v.varName.serialize() };
        });
        console.log({ SAVING: serializedVars });
        AsyncStorage.setItem(
          "@variables",
          JSON.stringify(serializedVars)
        );
      }

      return newContext;
    });
  };

const setVariables =
  (setContext) =>
  (variables: Variables, storeInAsyncStorage = false) => {
    setContext((context: IContext) => {
      if (storeInAsyncStorage) {
        AsyncStorage.setItem("@variables", JSON.stringify(context.variables));
      }
      return {
        ...context,
        variables,
      };
    });
  };

const deleteVariable =
  (setContext) =>
  (index: number, storeInAsyncStorage = true) => {
    setContext((context: IContext) => {
      if (storeInAsyncStorage) {
        AsyncStorage.setItem("@variables", JSON.stringify(context.variables));
      }
      return {
        ...context,
        variables: context.variables
          .slice(0, index)
          .concat(context.variables.slice(index + 1)),
      };
    });
  };

const updateVariable =
  (setContext) =>
  (
    variableUpdates: Partial<IVariable>,
    index: number,
    storeInAsyncStorage = true
  ) => {
    setContext((context: IContext) => {
      if (storeInAsyncStorage) {
        AsyncStorage.setItem("@variables", JSON.stringify(context.variables));
      }

      return {
        ...context,
        variables: context.variables
          .slice(0, index)
          .concat(new Variables([{ ...context.variables.getVariableAt(index), ...variableUpdates }]))
          .concat(context.variables.slice(index + 1)),
      };
    });
  };

const setDimensions = (setContext) => (dimensions: IDimensions) => {
  setContext((context: IContext) => ({
    ...context,
    dimensions,
  }));
};

const isEditMode = (setContext) => (isEditMode) => {
  setContext(
    (context): IContext => ({
      ...context,
      isEditMode,
    })
  );
};

export const Context = React.createContext<[IContext, IActions]>([] as any);

export const createActions = (setContext): IActions => ({
  ctxSetUseDarkMode: setUseDarkMode(setContext),
  ctxAddVariable: addVariable(setContext),
  ctxSetVariables: setVariables(setContext),
  ctxDeleteVariable: deleteVariable(setContext),
  ctxUpdateVariable: updateVariable(setContext),
  ctxSetDimensions: setDimensions(setContext),
  ctxSetIsEditMode: isEditMode(setContext),
});
