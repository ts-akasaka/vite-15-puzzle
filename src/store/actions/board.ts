import produce from 'immer';
import { createShuffledBoard, swapNumberOnBoard } from "lib/sliding";
import { Reducer } from "store";

export const swap = (pos1: number, pos2: number): Reducer => produce(draft => {
  draft.board = swapNumberOnBoard(draft.board, pos1, pos2);
});

export const shuffle = (): Reducer => produce(draft => {
  draft.board = createShuffledBoard();
});
