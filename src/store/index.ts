import type { DeepReadonly } from 'utility-types';
import EventEmitter from 'eventemitter3';
import { createShuffledBoard } from 'lib/sliding';

export const initialState = {
  board: createShuffledBoard(),
  shuffling: false,
};

export type RootState = typeof initialState;
export type Reducer = (orig: DeepReadonly<RootState>) => RootState;
export type Dispatch = (fn: Reducer) => void;
export type EventTypes = "update";
export type Store = {
  root: DeepReadonly<RootState>,
  dispatch: Dispatch,
  emitter: EventEmitter<EventTypes>
};

// E2Eテストで使用する。
// 指定のキーにストアを設定する。
declare global {
  interface Window {
    __stores__?: Record<string, Store>,
  }
}

export const createStore = (code = "default"): Store => {
  const root: Store["root"] = JSON.parse(JSON.stringify(initialState));
  const emitter: Store["emitter"] = new EventEmitter<EventTypes>();
  const store: Store = {
    root,
    emitter,
    dispatch: fn => {
      store.root = fn(store.root);
      emitter.emit("update");
    },
  };

  // E2Eテストで使用する
  if (process.env.NODE_ENV === "development" && window) {
    window.__stores__ = {...(window.__stores__ ?? {}), [code]: store};
  }

  return store;
};
