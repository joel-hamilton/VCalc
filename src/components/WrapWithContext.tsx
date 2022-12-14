import React from "react";
import { Pictos } from "../classes/Pictos";
import { Variables } from "../classes/Variables";
import { Context, createActions } from "../Context";
import { IContext } from "../types";

export const initialContext: IContext = {
  useDarkTheme: undefined,
  variables: new Variables(),
  currentValue: new Pictos(),
  dimensions: {
    screenH: 500,
    screenW: 300,
    headerH: 50,
    displayH: 60,
    inputH: 40,
    variablesViewH: 400,
    keyboardVisible: false,
    translateYEditMode: 400,
    variablesViewPeek: 40,
    operatorsHorizontalH: 100,
  },
  isEditMode: false,
};

const WrapWithContext = ({ children }) => {
  const [context, setContext] = React.useState<IContext>(initialContext);

  return (
    <Context.Provider value={[context, createActions(setContext)]}>
      {children}
    </Context.Provider>
  );
};

export default WrapWithContext;
