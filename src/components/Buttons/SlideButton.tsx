import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Theme, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { findNextVacantPosOnBoard, isBoardComplete } from "lib/sliding";
import { useStoreContext } from "components/Providers/StoreProvider";
import { swap } from "store/actions/board";
import { useDialogContext } from "components/Providers/DialogProvider";
import clsx from "clsx";

const useStyles = makeStyles<Theme, Props>((theme: Theme) => ({
  root: {
    height: "calc(25% - 2px)",
    width: "calc(25% - 2px)",
    border: ({n}) => n === null ? "0px" : "1px solid grey",
    margin: "1px",
    fontSize: "2em",
    fontWeight: "bold",
    backgroundColor: props => props.n !== null ? "white" : "#ffffff00",
    '&:hover': {
      backgroundColor: "green",
      color: '#FFF'
    }    
  },
  right: {
    animation: "$rightAnimation 1s ease",
  },
  "@keyframes rightAnimation": {
    "0%": {transform: "translate(-100%, 0%)"},
    "100%": {transform: "translate(0%, 0%)"},
  },
  left: {
    animation: "$leftAnimation 1s ease",
  },
  "@keyframes leftAnimation": {
    "0%": {transform: "translate(100%, 0%)"},
    "100%": {transform: "translate(0%, 0%)"},
  },
  down: {
    animation: "$downAnimation 1s ease",
  },
  "@keyframes downAnimation": {
    "0%": {transform: "translate(0%, -100%)"},
    "100%": {transform: "translate(0%, 0%)"},
  },
  up: {
    animation: "$upAnimation 1s ease",
  },
  "@keyframes upAnimation": {
    "0%": {transform: "translate(0%, 100%)"},
    "100%": {transform: "translate(0%, 0%)"},
  },
}));

type Props = {
  pos: number,
  n: number | null,
};

const SlideButton: FC<Props> = (props) => {
  const {n, pos} = props;
  const classes = useStyles(props);
  const store = useStoreContext();
  const dialogs = useDialogContext();
  const [prev, setPrev] = useState(pos);
  useEffect(()=>{
    (async ()=>{
      if (store.root.shuffling) {
        setPrev(pos);
      } else if (pos !== prev) {
        await dialogs.blocker({showWhile: async ()=>{
          await new Promise(resolve => setTimeout(resolve, 1000)); // block while animated
        }});
        setPrev(pos);
      }
    })();
  }, [pos]);
  const onClick = useCallback(async ()=>{
    const vpos = findNextVacantPosOnBoard(store.root.board, pos);
    if (vpos !== null) {
      store.dispatch(swap(pos, vpos));
      if (isBoardComplete(store.root.board)) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // wait for end of animation
        await dialogs.message({
          message: "１～１５の数が揃いました！"
        });
      }
    }
  }, [pos]);

  return (
    <Button
      className={clsx(
        classes.root,
        store.root.shuffling
          ? null
          : { [-4]: classes.up, [1]: classes.right, [4]: classes.down, [-1]:classes.left }[pos - prev] ?? null
      )}
      onClick={onClick}
      disabled={n === null || findNextVacantPosOnBoard(store.root.board, pos) === null}
    >
      {n}
    </Button>
  );
};

export default SlideButton;
