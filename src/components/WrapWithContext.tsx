import React from "react";
import { Context, createActions } from "../Context";
import { IActions, IContext, ICreateActions } from "../types";


  const initialContext: IContext = {
    useDarkTheme: undefined,
    variables: [],
    dimensions: {
      screenH: 500,
      screenW: 300,
      headerH: 50,
      displayH: 60,
      inputH: 40,
      variableScrollViewH: 400,
      keyboardH: 300,
      keyboardVisible: false,
      operatorEditModeH: 60,
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
