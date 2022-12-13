import { Context } from '../Context';
import { IContext } from '../types';

const WrapWithContext = ({children}) => {
  const context = {};
  const setContext = jest.fn();

  return (
    <Context.Provider value={[context as IContext, setContext]}>{children}</Context.Provider>
  );
};

export default WrapWithContext;