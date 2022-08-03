import React, { useState, useEffect } from "react";
import PlayerInfo from "./PlayerInfo";
import axios from "axios";
import config from "../config";
import { useDispatch, useSelector } from "react-redux";
import { PLAYERS_LIST } from "../Redux/ActionTypes";
// import api from "../utilities/api";
import fetchProducts from "../utilities/api";
import Card from "./Card";

const PlayerCart = () => {

  const dispatch = useDispatch();
  const playersList = useSelector((state) => state.cart.playersList);

  // console.log(playersList);
  
  const [players, setPlayers] = useState([]);
  
  useEffect(() => {
    // console.log(fetchProducts());
    fetchProducts(dispatch);

  }, []);

  

  return (
    <div className="flex p-10 gap-10 h-[92vh]">
      <div className="w-8/12 bg-white overflow-scroll scrollbar-hide rounded-3xl">
        <div className="top-0 sticky h-40 mb-2">
          <header className="h-[70%] bg-gray-300 rounded-t-[28px] p-5 flex items-center">
            <h1>Contant</h1>
          </header>
          <div className="text-sm h-[30%] bg-gray-200 flex items-center">
            Sub-Header
          </div>
        </div>
        <div className="">
          {playersList.map((player) => (
            <PlayerInfo
              key={player.permanentNumber}
              name={player.givenName + " " + player.familyName}
              image={player.image}
              code={player.code}
              price={player.price}
              color={player.color}

            />
          ))}
        </div>
      </div>

      <div className="w-4/12 bg-primary rounded-3xl p-10">
        <div className="flex justify-center flex-wrap">
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
        </div>
      </div>
    </div>
  );
};

export default PlayerCart;
