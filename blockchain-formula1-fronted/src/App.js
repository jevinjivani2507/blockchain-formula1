import React from "react";
import "./App.css";
import Login from "./components/Login";
import PlayerCart from "./components/PlayerCart";
import Navbar from "./components/Navbar";
import { createTheme, NextUIProvider, Text } from "@nextui-org/react"

const theme = createTheme({
  type: "light", // it could be "light" or "dark"
  theme: {
    colors: {
      // brand colors
      primaryLight: '#FAF700',
      primaryLightHover: '#FAF700',
      primaryLightActive: '#FAF700',
      primaryLightContrast: '#FAF700',
      primary: '#FA1700',
      primaryBorder: '$green500',
      primaryBorderHover: '$green600',
      primarySolidHover: '$green700',
      primarySolidContrast: '$white',
      primaryShadow: '$green500',
      secondary: '#FFFFFF',

      gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)',
      link: '#5E1DAD',

      // you can also create your own color
      myColor: '#000000',

      // ...  more colors
    },
    space: {},
    fonts: {}
  }
})

function App() {

  return (
    <NextUIProvider theme={theme}>
    <div className="App bg-[#121212] relative">
      <Navbar />
      <div className="">
        <PlayerCart />
      </div>
    </div>
    </NextUIProvider>
  );
}

export default App;
