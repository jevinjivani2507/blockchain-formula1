import React from 'react';
import { Button } from "@nextui-org/react";

const Navbar = () => {
  return (
    <div className="top-0 sticky bg-primary">
        <div className="h-[8vh] flex items-center px-10 justify-between">
            <div>
              Logo
            </div>
            <div className="flex">
              <Button color="primary" variant="contained" auto> Dashboard </Button>
              <Button color="primary" variant="contained" auto> LeaderBoard </Button>
              <Button color="primary" variant="contained" auto> How to Play </Button>
            </div>
        </div>
    </div>
  )
}

export default Navbar;