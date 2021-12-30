import produce from 'immer';
import { Reducer } from "store";

export const setShuffling = (flg: boolean): Reducer => produce(draft => {
  draft.shuffling = flg;
});
