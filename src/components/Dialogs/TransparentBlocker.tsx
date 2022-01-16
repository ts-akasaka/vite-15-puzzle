import { Dialog, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { FC, useEffect } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    opacity: 0,
  },
}));

type Props = {
  onClose: () => void,
  onError: (reason: any) => void,
  showWhile: () => Promise<void>,
};

const TransparentBlocker: FC<Props> = ({ onClose, onError, showWhile }) => {
  const classes = useStyles();
  useEffect(() => { showWhile().then(onClose).catch(onError) }, []);
  return (
    <Dialog
      className={clsx(
        "TransparentBlocker",
        classes.root
      )}
      open
      fullScreen
    />
  );
}

export default TransparentBlocker;
