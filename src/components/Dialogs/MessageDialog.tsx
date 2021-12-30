import { Button, Dialog, DialogActions, DialogContent, Icon, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FC, ReactNode } from 'react';
import clsx from 'clsx';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import InfoIcon from '@material-ui/icons/Info';
import SuccessIcon from '@material-ui/icons/Check';

const nameInClasses = (name: keyof ReturnType<typeof useStyles>) => name;
const iconTypes = {
  error: {
    icon: ErrorIcon,
    iconStyle: nameInClasses("errorIcon"),
  },
  warning: {
    icon: WarningIcon,
    iconStyle: nameInClasses("warningIcon"),
  },
  info: {
    icon: InfoIcon,
    iconStyle: nameInClasses("infoIcon"),
  },
  success: {
    icon: SuccessIcon,
    iconStyle: nameInClasses("successIcon"),
  },
};

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    padding: "1.5rem 1.5rem 0rem 1.5rem",
    minHeight: "6rem",
    display: "flex",
    alignItems: "center",
  },
  actions: {
    padding: "0.5rem 1.5rem 1rem 1.5rem",
    justifyContent: "center",
    "& > .MuiButton-root": {
      minWidth: "8rem",
    },
  },
  icon: {
    flex: "0 0 auto",
    width: "3rem",
    height: "3rem",
  },
  message: {
    flex: "1 1",
    fontSize: "1rem",
    paddingLeft: "1.5rem",
    whiteSpace: "pre-wrap",
  },
  errorIcon: {
    color: theme.palette.error.main,
  },
  warningIcon: {
    color: theme.palette.warning.main,
  },
  infoIcon: {
    color: theme.palette.info.main,
  },
  successIcon: {
    color: theme.palette.success.main,
  },
}));

type Props = {
  iconType?: keyof typeof iconTypes,
  message: ReactNode,
  okButtonText?: ReactNode,
  onClose: () => void,
};

const MessageDialog: FC<Props> = ({ iconType, message, onClose, okButtonText }) => {
  const classes = useStyles();
  const { icon: Icon, iconStyle } = iconTypes[iconType ?? "info"];
  return (
    <Dialog
      open
      maxWidth="sm"
      fullWidth
      onClose={undefined} // Not close by ESC or clicking backdrop.
    >
      <DialogContent className={classes.content}>
        <Icon className={clsx(classes.icon, classes[iconStyle])} />
        <Typography className={clsx(classes.message)} >
          {message}
        </Typography>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button
          ref={elem => elem?.focus()}
          variant="outlined"
          onClick={onClose}
        >
          {okButtonText ?? "OK"}
        </Button>
      </DialogActions>
    </Dialog >
  );
}

export default MessageDialog;
