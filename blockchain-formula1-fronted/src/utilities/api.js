import axios from "axios";
import config from "../config";

import { useDispatch, useSelector } from "react-redux";
import { PLAYERS_LIST, CONSTRUCTOR_LIST } from "../Redux/ActionTypes";

import importAll from "./importAll";
import { playerMapping, teamMapping } from "./mapping";

const images = importAll(
  require.context("../photos/Players", false, /\.(png|jpe?g|svg)$/)
);

const constructorImages = importAll(
  require.context("../photos/Constructor", false, /\.(png|jpe?g|svg)$/)
);

const api = async (dispatch) => {
  const response = await axios.get(config.URL_DRIVERS);

  const constructors = await axios.get(config.URL_CONSTRUCTORS);

  const formattedPlayerData = response.data.MRData.DriverTable.Drivers.map(
    (driver) => {
      return {
        ...driver,
        type: "driver",
        image: images[driver.permanentNumber + ".png"],
        code: playerMapping[driver.permanentNumber].code,
        constructorId: playerMapping[driver.permanentNumber].constructorId,
        price: playerMapping[driver.permanentNumber].price,
        color:
          teamMapping[playerMapping[driver.permanentNumber].constructorId]
            .color,
      };
    }
  )
  .filter(
    (driver) =>  driver.permanentNumber !== "27"
  );

  const formattedConstructorData = constructors.data.MRData.ConstructorTable.Constructors.map(
    (constructor) => {
      return {
        ...constructor,
        type: "constructor",
        image: constructorImages[constructor.constructorId + ".png"],
        price: teamMapping[constructor.constructorId].price,
      };
    }
  )
  
  console.log(formattedPlayerData);
  console.log(formattedConstructorData);

  dispatch(
    {
      type: PLAYERS_LIST,
      payload: formattedPlayerData,
    }
  );
  dispatch(
    {
      type: CONSTRUCTOR_LIST,
      payload: formattedConstructorData,
    }
  );
};

export default api;
