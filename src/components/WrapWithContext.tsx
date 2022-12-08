import { ReactElement } from 'react';

import { Context } from '../Context';

const WrapWithContext = ({children}) => {
  const context = {};
  const setContext = jest.fn();

  return (
    <Context.Provider value={[context, setContext]}>{children}</Context.Provider>
  );
};

export default WrapWithContext;