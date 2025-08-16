import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fff',
      contrastText: '#000',
    },
    background: {
      default: '#000',
      paper: '#111',
    },
    text: {
      primary: '#fff',
      secondary: '#bbb',
      disabled: '#888',
    },
    divider: '#222',
  },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    h4: { fontWeight: 700, letterSpacing: '-0.01em', color: '#fff' },
    h6: { color: '#fff' },
    body1: { fontSize: '1rem', color: '#fff' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none', backgroundColor: '#111', color: '#fff', border: '1px solid #222' }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: { background: '#000', color: '#fff', borderRadius: 6 }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: { color: '#fff', background: '#111' },
        input: { color: '#fff', background: '#111' }
      }
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
