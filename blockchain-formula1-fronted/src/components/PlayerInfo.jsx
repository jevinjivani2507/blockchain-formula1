import React, { useState } from "react";
import player from "../images/player.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

const PlayerInfo = (props) => {

  const [isAdded, setIsAdded] = useState(false);
  const [playersList, setPlayersList] = useState([]);

  const addPlayer = () => {
    setIsAdded(!isAdded);
    if(isAdded===true){
      setPlayersList([...playersList, props.name]);
    }
    console.log(playersList);
  };

  return (
    <div className="flex items-center">
      <div className="flex px-6 py-5 w-full rounded-md my-1 mx-2 justify-between">
        <div className="flex items-center">
          <img className="h-10 w-[5vh]" src={props.image} alt="" />
          <div className="mx-2">
            <div className="flex justify-center font-bold text-xs px-1 bg-gray-100 rounded-md">
              DR
            </div>
            <div className={`font-bold text-xs px-1 mt-1 ${props.color} rounded-md`}>
              {props.code}
            </div>
          </div>
          <div className="text-xl font-bold">{props.name}</div>
        </div>
        <div className="flex items-center">
          <div className="text-md font-bold mx-2">
            {props.price} PT.
          </div>
          <button
            className={isAdded ? "bg-primary py-2 px-3 rounded-2xl text-white" : "bg-gray-100 py-2 px-3 rounded-2xl text-gray-600"}
            onClick={addPlayer}
          >
            <FontAwesomeIcon className={isAdded ? "h-4 px-[2px]" : ""} icon={isAdded ? faXmark : faPlus} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
