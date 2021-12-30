import { MouseEventHandler, useCallback } from 'react';
import { Theme, Box, Button, Container, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles';
import BoardPanel from "components/Panels/BoardPanel"
import { useDialogContext } from "components/Providers/DialogProvider";
import { useStoreContext } from "components/Providers/StoreProvider";
import { shuffle } from "store/actions/board";
import { setShuffling } from 'store/actions/shuffling';

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    fontWeight: "bold",
    marginTop: "2rem",
  },
}));

function App() {
  const classes = useStyles();
  const dialog = useDialogContext();
  const { dispatch } = useStoreContext();
  const onInitializeClick = useCallback<MouseEventHandler>(async ()=>{
    dispatch(setShuffling(true));
    dispatch(shuffle());
    await dialog.message({iconType: "info", message: "シャッフルしました"});
    dispatch(setShuffling(false));
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          １５パズルサンプル
        </Typography>
        <BoardPanel />
        <Button
          className={`X ${classes.button} X `}
          variant="contained"
          size="large"
          color="primary"
          onClick={onInitializeClick}
        >
          シャッフル
        </Button>
      </Box>
    </Container>
  )
}

export default App
