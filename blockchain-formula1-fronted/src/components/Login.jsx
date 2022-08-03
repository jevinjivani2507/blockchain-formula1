import React from "react";
import f1Car from "../images/f1Car.png";
import Image from "../images/image.png";

const Login = () => {
  return (
    <div className="flex justify-center text-white h-screen p-20">
      <div className="w-1/2 p-10 h-full items-center flex">
        <div className="w-3/4 pl-10 items-center">
          <img className="h-5 mb-10" src={Image} alt="" />
          <h1 className="text-6xl font-bold text-[#FF1700] font-Inter">We explore the galaxy.</h1>
          <p className="my-10 ">
            Nebula is a community of physicists dedicated to space exploration
            and innovation. We are on a mission to make scientific breakthroughs
            that will benefit humanity.
          </p>

          <button className="login-btn bg-[#FA1700] mr-3">Connect Wallet</button>
          <button className="login-btn ">Create Team</button>
        </div>
      </div>
      <div className="w-1/2 h-full flex items-center">
        <img src={f1Car} alt="" />
      </div>
    </div>
  );
};

export default Login;
