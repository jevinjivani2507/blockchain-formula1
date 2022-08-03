import React from 'react';

const Navbar = () => {
  return (
    <div className="top-0 sticky bg-primary">
        <div className="h-[8vh] flex items-center px-10 justify-between">
            <div>
              Logo
            </div>
            <div className="flex">
              <h1 className="navbar-item">Dashboard</h1>
              <h1 className="navbar-item">LeaderBoard</h1>
              <h1 className="navbar-item">How to Play</h1>
            </div>
        </div>
    </div>
  )
}

export default Navbar;