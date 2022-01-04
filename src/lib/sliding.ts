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
 * 指定された位置の隣のマスに空きマスがあればその位置を返す。
 * @param brd 盤面
 * @param pos 位置
 * @returns 空きマスがあればその位置、そうでなければnull
 */
export const findNextVacantPosOnBoard = (brd: DeepReadonly<Board>, pos: number): number | null => {
  return [
    pos - 4 >= 0 ? pos - 4 : null,
    pos + 4 <= 15 ? pos + 4 : null,
    pos % 4 - 1 >= 0 ? pos - 1 : null,
    pos % 4 + 1 <= 3 ? pos + 1 : null,
  ].find(
    p => p !== null && brd[p] === null
  ) ?? null;
};

/**
 * 盤面の中の空きマスの位置を返す。
 * @param brd 
 * @returns 空きマスが見つかればその位置、そうでなければnull
 */
export const findVacantPosOnBoard = (brd: DeepReadonly<Board>): number | null => {
  return brd.indexOf(null) ?? null;
};

/**
 * 盤面の指定位置の数マス（または空きマス）を交換する。
 * @param brd 
 * @param pos1 
 * @param pos2 
 * @returns 
 */
export const swapNumberOnBoard = (brd: DeepReadonly<Board>, pos1: number, pos2: number) => {
  const nbrd = [...brd];
  if (pos1 in brd && pos2 in brd && pos1 !== pos2) {
    // const temp = nbrd[pos1];
    // nbrd[pos1] = nbrd[pos2];
    // nbrd[pos2] = temp;
    [nbrd[pos1], nbrd[pos2]] = [nbrd[pos2], nbrd[pos1]];
  }
  return nbrd;
}

const ShuffleCount = 100;
const initialBoard = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null];
/**
 * シャッフルされた盤面を返す。
 * @returns シャッフルされた盤面
 * Note: 単純なランダムソートでは、完成不可能な配置が発生する。
 */
export const createShuffledBoard = (): Board => {
  let brd = [...initialBoard];
  for (let i = 0; i < ShuffleCount; i++) {
    const vpos = findVacantPosOnBoard(brd) ?? -1;
    const npos = [vpos - 4, vpos + 1, vpos + 4, vpos - 1]
      .filter(p => p in brd)
      .sort(() => Math.random() >= 0.5 ? -1 : 1)[0] ?? -1;
    brd = swapNumberOnBoard(brd, vpos, npos);
  }
  return brd;
};
