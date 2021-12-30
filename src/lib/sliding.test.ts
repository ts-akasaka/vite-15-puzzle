import { isBoardComplete, findNextVacantPosOnBoard, findVacantPosOnBoard, swapNumberOnBoard, createShuffledBoard } from "./sliding";

test('isBoardCompleteは、完成した盤面に真を返す', () => {
  expect(isBoardComplete([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null])).toBe(true);
  expect(isBoardComplete([2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null])).toBe(false);
  expect(isBoardComplete([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, null, 15])).toBe(false);
  expect(isBoardComplete([null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])).toBe(false);
});

test('findNextVacantPosOnBoardは、指定された位置の隣のマスに空きマスがあればその位置を返す', () => {
  expect(findNextVacantPosOnBoard([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null], 14)).toBe(15);
  expect(findNextVacantPosOnBoard([null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 4)).toBe(0);
  expect(findNextVacantPosOnBoard([1, 2, 3, 4, 5, null, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 9)).toBe(5);
  expect(findNextVacantPosOnBoard([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null], 0)).toBe(null);
  expect(findNextVacantPosOnBoard([null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 15)).toBe(null);
  expect(findNextVacantPosOnBoard([1, 2, 3, 4, 5, null, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 7)).toBe(null);
});

test('findVacantPosOnBoardは、盤面の中の空きマスの位置を返す', () => {
  expect(findVacantPosOnBoard([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null])).toBe(15);
  expect(findVacantPosOnBoard([2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null])).toBe(15);
  expect(findVacantPosOnBoard([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, null, 15])).toBe(14);
  expect(findVacantPosOnBoard([null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])).toBe(0);
});

test('swapNumberOnBoardは、盤面の指定位置の数マス（または空きマス）を交換する。', () => {
  expect(swapNumberOnBoard([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null], 14, 15))
   .toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, null, 15]);
  expect(swapNumberOnBoard([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null], 0, 1))
    .toEqual([2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null]);
  expect(swapNumberOnBoard([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null], 4, 8))
    .toEqual([1, 2, 3, 4, 9, 6, 7, 8, 5, 10, 11, 12, 13, 14, 15, null]);
  expect(swapNumberOnBoard([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, null, 13, 14, 15, 12], 15, 11))
    .toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null]);
});
