import { createContext, FC, ReactNode, useContext, ComponentType, useRef, useState, useReducer, ComponentProps } from 'react';
import MessageDialog from "components/Dialogs/MessageDialog";
import TransparentBlocker from "components/Dialogs/TransparentBlocker";

const DialogComponents = {
  message: MessageDialog,
  blocker: TransparentBlocker,
};

type HandlerType<T extends { onClose: (...args: any[]) => any }> = (
  (props: Omit<T, "onClose">) => Promise<Parameters<T["onClose"]>>
);

type ContextType = {
  [K in keyof typeof DialogComponents]: HandlerType<ComponentProps<(typeof DialogComponents)[K]>>
};

export const DialogContext = createContext<ContextType | null>(null);
export const useDialogContext = () => {
  const ctx = useContext(DialogContext)
  if (!ctx) {
    throw new Error("No DialogContext provided.")
  }
  return ctx
};

const handler = <T extends { onClose: (...args: any[]) => any }>(
  Component: ComponentType<T>,
  shownDialogs: ReactNode[],
  forceUpdate: () => void,
): HandlerType<T> => props => {
  const key = new Date().getTime().toString(16) + "-" + shownDialogs.length; // IMPROVEME: to UUIDv1
  return new Promise<Parameters<T["onClose"]>>((resolve, reject) => {
    const element = <Component
      key={key}
      {...(props as any)}
      onClose={(...ret) => {
        const idx = shownDialogs.indexOf(element);
        if (idx >= 0) {
          shownDialogs.splice(idx, 1);
          forceUpdate();
          resolve(ret as Parameters<T["onClose"]>);
        } else {
          reject("Illegal dialog close.")
        }
      }}
    />;
    shownDialogs.push(element);
    forceUpdate();
  });
};

type Props = {
  children: ReactNode | ReactNode[],
};

const DialogProvider: FC<Props> = ({ children }) => {
  const shownDialogs = useRef<ReactNode[]>([]).current;
  const [, forceUpdate] = useReducer(() => [], []);
  const [ctx] = useState(() => Object.fromEntries(Object.entries(DialogComponents).map(
    ([k, c]) => [k as any, handler(c as any, shownDialogs, forceUpdate)]
  )));
  return <DialogContext.Provider value={ctx}>
    {children}
    {shownDialogs.map(item => item)}
  </DialogContext.Provider>
};

export default DialogProvider;
