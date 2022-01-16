import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import shallowEqual from 'shallowequal';
import { createStore, Store } from "store";

export const StoreContext = createContext<Store | null>(null);
export const useStoreContext = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("No StoreContext provided.");
  }
  return ctx;
}
export const useSelector = <T extends unknown>(fn: (root: Store["root"]) => T, compare?: (a: T, b: T) => boolean): T => {
  const store = useStoreContext();
  const [current, setCurrent] = useState<T>(()=>fn(store.root));
  // コールバックの登録。store.subscribeは登録解除用の関数を返すため、
  // アンマウント時にストアから登録解除される。
  useEffect(() => store.subscribe(() => {
    const value = fn(store.root);
    if (compare ? compare(current, value) : current !== value) {
      setCurrent(value);
    }
  }), []);
  return current;
};
export const useSelectorShallow = <T extends unknown>(fn: (root: Store["root"]) => T) => useSelector(fn, shallowEqual);

type Props = {
  children: ReactNode | ReactNode[],
};

const StoreProvider: FC<Props> = ({ children }) => {
  const store = useRef(createStore()).current;
  return <StoreContext.Provider value={store}>
    {children}
  </StoreContext.Provider>
};

export default StoreProvider;
