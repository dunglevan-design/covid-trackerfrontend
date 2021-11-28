import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";


const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#12181B",
      paper: "#12181B"
    },
    text: {
      primary: "#fff",
      secondary: "rgba(255, 255, 255, 0.7)"
    },
    primary: {
      main: "#25E358",
      light: "#29FF71",
      dark: "#1CB24F",
    }
  },

});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
