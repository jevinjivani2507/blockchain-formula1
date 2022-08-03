import axios from "axios";
import config from "../config";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { useDispatch, useSelector } from "react-redux";
import { PLAYERS_LIST } from "../Redux/ActionTypes";

import importAll from "./importAll";
import {playerMapping, teamMapping} from "./mapping";


const images = importAll(
  require.context("../photo", false, /\.(png|jpe?g|svg)$/)
);
// console.log(images);
console.log(teamMapping);

const api = async (dispatch) => {
  const response = await axios.get(
    config.URL_DRIVERS
  );
  const formattedData = response.data.MRData.DriverTable.Drivers.map(
    (driver) => {
      return {
        ...driver,
        image: images[driver.permanentNumber+".png"],
        code: playerMapping[driver.permanentNumber].code,
        constructorId: playerMapping[driver.permanentNumber].constructorId,
        price: playerMapping[driver.permanentNumber].price,
        color: teamMapping[playerMapping[driver.permanentNumber].constructorId].color,
      };
    }
  );

  // console.log(response.data.MRData.DriverTable.Drivers);
  dispatch({
    type: PLAYERS_LIST,
    payload: formattedData,
  });
};

export default api;
