import { isBoardComplete, findNextVacantPosOnBoard, findVacantPosOnBoard, swapNumberOnBoard, createShuffledBoard, Board, getNextPositions } from "./sliding";

test('isBoardCompleteは、完成した盤面に真を返す', () => {
  expect(isBoardComplete([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null])).toBe(true);
  expect(isBoardComplete([2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null])).toBe(false);
  expect(isBoardComplete([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, null, 15])).toBe(false);
  expect(isBoardComplete([null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])).toBe(false);
});

test('getNextPositionsは、隣の位置を配列で返す', () => {
  expect(getNextPositions(0).sort()).toEqual([1, 4]);
  expect(getNextPositions(1).sort()).toEqual([0, 2, 5]);
  expect(getNextPositions(5).sort()).toEqual([1, 4, 6, 9]);
  expect(getNextPositions(15).sort()).toEqual([11, 14]);
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

test('createShuffledBoardは、シャッフルされた盤面を返す。', () => {
  const brd = createShuffledBoard();
  expect(brd.length === 16).toEqual(true);
  expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null].every(v => brd.includes(v))).toEqual(true);
});

test('createShuffledBoardでシャッフルされた盤面は、指定された手数で解くことができる。', () => {
  // 指定手数でその盤面が解けるかをチェックする再帰関数。
  const solver = (brd: Board, max: number, step = 0): boolean => {
    if (step > max) {
      return false;
    } else if (isBoardComplete(brd)) {
      return true;
    } else {
      const vpos = findVacantPosOnBoard(brd) ?? -100;
      return getNextPositions(vpos).some(pos => solver(
        swapNumberOnBoard(brd, vpos, pos),
        max,
        step + 1
      ) === true);
    }
  };
  // solver関数自体のテスト
  expect(solver([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null], 0)).toBeTruthy();
  expect(solver([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, null, 15], 1)).toBeTruthy();
  expect(solver([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, null, 15], 0)).toBeFalsy();
  expect(solver([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, null, 13, 14, 15], 3)).toBeTruthy();
  expect(solver([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, null, 13, 14, 15], 2)).toBeFalsy();
  // createShuffledBoardのテスト。
  // シャッフルでの交換回数10回、最大手数10回で100回行い、全て解ける盤面かを確認する。
  for (let i = 0; i < 100; i++) {
    expect(solver(createShuffledBoard(10), 10)).toBeTruthy();
  }
});
