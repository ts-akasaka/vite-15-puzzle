import React from 'react';
import ReactDOM from 'react-dom';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import ErrorBoundary from "components/Boundaries/ErrorBoundary";
import StoreProvider from "components/Providers/StoreProvider";
import DialogProvider from "components/Providers/DialogProvider";
import App from "./App";
import theme from "./theme";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <StoreProvider>
          <DialogProvider>
            <App />
          </DialogProvider>
        </StoreProvider>
      </ErrorBoundary>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
