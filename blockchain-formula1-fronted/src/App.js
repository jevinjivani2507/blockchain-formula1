import React from "react";
import "./App.css";
import Login from "./components/Login";
import PlayerCart from "./components/PlayerCart";
import Navbar from "./components/Navbar";
import api from "./utilities/api";

function App() {
  return (
    <div className="App bg-[#121212] relative">
      <Navbar />
      <div className="">
        <PlayerCart />
      </div>
    </div>
  );
}

export default App;
