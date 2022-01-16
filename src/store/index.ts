import type { DeepReadonly } from 'utility-types';
import { Board, createShuffledBoard } from 'lib/sliding';

// ステートの型
export type RootState = {
  board: Board,
  shuffling: boolean,
};

// リデューサー（ステート変更関数）・ディスパッチャー（ステート変更関数の実行関数）
export type Reducer = (orig: DeepReadonly<RootState>) => RootState;
export type Dispatch = (fn: Reducer) => void;

// ステート変更を通知するためのコールバック登録・解除
export type StoreCallback = () => void;
const subscriber = (cbs: StoreCallback[]) => (fn: StoreCallback) => {
  cbs.push(fn);
  return () => { cbs.splice(cbs.indexOf(fn), 1) }; // 登録解除関数を返す
};
const unsubscriber = (cbs: StoreCallback[]) => (fn: StoreCallback) => {
  cbs.splice(cbs.indexOf(fn), cbs.includes(fn) ? 1 : 0);
};

// ステートストアオブジェクト
export type Store = {
  root: DeepReadonly<RootState>,
  dispatch: Dispatch,
  subscribe: ReturnType<typeof subscriber>,
  unsubscribe: ReturnType<typeof unsubscriber>,
};

// 指定のキーにストアを設定するためのグローバルオブジェクト（E2Eテストで使用）
declare global {
  interface Window {
    __stores__?: Record<string, Store>,
  }
}

/**
 * ステートストアを生成する。初期盤面は、シャッフルした盤面とする。
 * E2Eテストのため、開発環境に限り、window.__stores__にステートストアをグローバル参照を設定する。
 * @param code 省略可。E2Eテストでグローバル参照するためのキー。デフォルト値は"default"。
 * @returns 生成したステートストア
 */
export const createStore = (code = "default"): Store => {
  const root: Store["root"] = {
    board: createShuffledBoard(),
    shuffling: false,
  };
  const callbacks: StoreCallback[] = [];
  const store: Store = {
    root,
    dispatch: fn => {
      store.root = fn(store.root);
      callbacks.forEach(cb => cb());
    },
    subscribe: subscriber(callbacks),
    unsubscribe: unsubscriber(callbacks),
  };
  if (process.env.NODE_ENV === "development" && window) {
    window.__stores__ = {...(window.__stores__ ?? {}), [code]: store};
  }
  return store;
};
