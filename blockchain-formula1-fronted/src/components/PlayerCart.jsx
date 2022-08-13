import React, { useState, useEffect } from "react";
import PlayerInfo from "./PlayerInfo";
import ConstructorInfo from "./ConstructorInfo";
import axios from "axios";
import config from "../config";
import { useDispatch, useSelector } from "react-redux";
// import api from "../utilities/api";
import fetchProducts from "../utilities/api";
import Card from "./Card";

import { Progress, Button } from "@nextui-org/react";

const PlayerCart = () => {
  const dispatch = useDispatch();
  const playersList = useSelector((state) => state.cart.playersList);
  const selectdPlayers = useSelector((state) => state.cart.selectdPlayers);
  const totalPoints = useSelector((state) => state.cart.totalPoints);
  const constructorList = useSelector((state) => state.cart.constructorList);

  const [displayList, setDisplayList] = useState("players");

  const changeToPlayers = () => {
    setDisplayList("players");
  }

  const changeToConstructors = () => {
    setDisplayList("constructors");
  }

  useEffect(() => {
    // console.log(fetchProducts());
    fetchProducts(dispatch);
    // console.log(playersList);
    // console.log(constructorList);
  }, []);

  return (
    <div className="flex p-10 gap-10 h-[92vh]">
      <div className="w-8/12 bg-white overflow-scroll scrollbar-hide rounded-3xl">
        <div className="top-0 sticky h-40 mb-2">
          <header className="h-[70%] bg-gray-300 rounded-t-[28px] p-5 flex items-center justify-center">
            <Progress value={totalPoints / 10} color="primary" />
          </header>
          <div className="text-sm h-[30%] bg-gray-200 flex items-center">
            <Button.Group size="sm">
              <Button onClick={changeToPlayers}>Players</Button>
              <Button onClick={changeToConstructors}>Constructors</Button>
            </Button.Group>
          </div>
        </div>
        <div className="">
          {displayList === "players"
            ? playersList.map((player) => (
                <PlayerInfo
                  key={player.permanentNumber}
                  id={player.permanentNumber}
                  name={player.givenName + " " + player.familyName}
                  image={player.image}
                  code={player.code}
                  price={player.price}
                  color={player.color}
                />
              ))
            : constructorList.map((constructor) => (
                <ConstructorInfo
                  key={constructor.constructorId}
                  id={constructor.constructorId}
                  name={constructor.name}
                />
              ))}
        </div>
      </div>

      <div className="w-4/12 bg-primary rounded-3xl p-10">
        <div className="flex justify-center flex-wrap">
          {selectdPlayers.map((player) => (
            <Card
              key={player.permanentNumber}
              id={player.permanentNumber}
              name={player.name}
              image={player.image}
              code={player.code}
              price={player.price}
              color={player.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerCart;
