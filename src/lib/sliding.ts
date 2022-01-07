import { DeepReadonly } from 'utility-types';

/**
 * 4 x 4 の盤面と数マスと空きマス
 */
export type Board = (number | null)[];

/**
 * 盤面上、1～15の数マスが揃った状態ならば真を返す。
 * @param brd 盤面
 * @returns 揃った状態ならばtrue、そうでなければfalse
 */
export const isBoardComplete = (brd: DeepReadonly<Board>): boolean => {
  if (brd.length !== 16) {
    throw new Error("Illegal board status!")
  }
  return brd.every((v, i) => (
    (i < 15 && v === i + 1) ||
    (i === 15 && v === null)
  ));
};

/**
 * 盤面上の位置を指定すると、その位置に隣り合う位置を配列で返す
 * @param pos 位置（0～15）
 * @returns 位置の配列（
 */
export const getNextPositions = (pos: number) => {
  return [
    pos - 4 >= 0 ? pos - 4 : null,
    pos + 4 <= 15 ? pos + 4 : null,
    pos % 4 - 1 >= 0 ? pos - 1 : null,
    pos % 4 + 1 <= 3 ? pos + 1 : null,
  ].filter((v): v is number => typeof v === "number");
};

/**
 * 指定された位置の隣のマスに空きマスがあればその位置を返す。
 * @param brd 盤面
 * @param pos 位置（0～15）
 * @returns 空きマスがあればその位置、そうでなければnull
 */
export const findNextVacantPosOnBoard = (brd: DeepReadonly<Board>, pos: number): number | null => {
  return getNextPositions(pos).find(
    p => p !== null && brd[p] === null
  ) ?? null;
};

/**
 * 盤面の中の空きマスの位置を返す。
 * @param brd 盤面
 * @returns 空きマスが見つかればその位置、そうでなければnull
 */
export const findVacantPosOnBoard = (brd: DeepReadonly<Board>): number | null => {
  return brd.indexOf(null) ?? null;
};

/**
 * 盤面の指定位置の数マス（または空きマス）を交換する。
 * @param brd 盤面
 * @param pos1 交換する盤面上の位置１（0～15）
 * @param pos2 交換する盤面上の位置２（0～15）
 * @returns 交換した結果の盤面（新規生成した配列）。
 */
export const swapNumberOnBoard = (brd: DeepReadonly<Board>, pos1: number, pos2: number) => {
  const nbrd = [...brd];
  if (pos1 in brd && pos2 in brd && pos1 !== pos2) {
    [nbrd[pos1], nbrd[pos2]] = [nbrd[pos2], nbrd[pos1]];
  }
  return nbrd;
}

const initialBoard = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null];
/**
 * シャッフル（空きマスと数字マスを指定回数、ランダムに交換）された盤面を返す。
 * @param shuffleCount 空きマスと数字マスを交換する回数。デフォルトは100回。
 * @returns 新規生成され、シャッフルされた盤面
 * Note: 単純なランダムソートでは、完成不可能な配置が発生する。
 */
export const createShuffledBoard = (shuffleCount = 100): Board => {
  let brd = [...initialBoard];
  for (let i = 0; i < shuffleCount; i++) {
    const vpos = findVacantPosOnBoard(brd) ?? -1;
    const nexts = getNextPositions(vpos);
    const npos = nexts[Math.floor(Math.random() * nexts.length)];
    brd = swapNumberOnBoard(brd, vpos, npos);
  }
  return brd;
};
