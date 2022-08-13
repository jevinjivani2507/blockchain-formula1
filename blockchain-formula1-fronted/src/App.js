import React from "react";
import "./App.css";
import Login from "./components/Login";
import PlayerCart from "./components/PlayerCart";
import Navbar from "./components/Navbar";
import api from "./utilities/api";
import { ThemeProvider } from "@mui/system";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: '#FA7000',
    },
    secondary: {
      main: '#edf2ff',
    },
  },
});

function App() {

  return (
    <ThemeProvider theme={theme}>
    <div className="App bg-[#121212] relative">
      <Navbar />
      <div className="">
        <PlayerCart />
      </div>
    </div>
    </ThemeProvider>
  );
}

export default App;
