import { Context } from '../Context';
import { IActions, IContext } from '../types';

const WrapWithContext = ({children}) => {
  const context = {};
  const setContext = jest.fn() as unknown as IActions;

  return (
    <Context.Provider value={[context as IContext, setContext]}>{children}</Context.Provider>
  );
};

export default WrapWithContext;