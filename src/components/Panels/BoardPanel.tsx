import { FC } from 'react';
import { Paper, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import SlideButton from "components/Buttons/SlideButton";
import { useSelector } from "components/Providers/StoreProvider";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    boxSizing: "content-box",
    padding: 0,
    height: "24rem", // 6rem * 4
    width: "24rem", // 6rem * 4
    display: "flex",
    flexWrap: "wrap",
    border: "4px solid lightgrey",

    backgroundColor: "grey",
    backgroundImage:
     "repeating-linear-gradient(-45deg,#fff, #fff 7px,transparent 0, transparent 14px)",
  },
}));

type Props = {
};

const BoardPanel: FC<Props> = () => {
  const classes = useStyles();
  const board = useSelector(root => root.board);
  return <Paper className={classes.root}>{
    board.map((n, pos)=>(
      <SlideButton key={n ?? 0} n={n} pos={pos} />
    ))
  }</Paper>;
};

export default BoardPanel;
