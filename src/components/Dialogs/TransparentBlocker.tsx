import { Dialog, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FC, useEffect } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    opacity: 0,
  },
}));

type Props = {
  onClose: () => void,
  showWhile: () => Promise<void>,
};

const TransparentBlocker: FC<Props> = ({onClose, showWhile}) => {
  const classes = useStyles();
  useEffect(()=>{
    // IMPROVEME: エラーの発生時、ダイアログ呼び出し元にエラーを返す。onError Propが必要。
    showWhile().then(onClose)
  }, []);
  return (
    <Dialog
      className={classes.root}
      open
      fullScreen
    />
  );
}

export default TransparentBlocker;
