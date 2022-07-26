import { PLAYERS_LIST } from "../ActionTypes";
import { CONSTRUCTOR_LIST } from "../ActionTypes";
import { ADD_TO_CART } from "../ActionTypes";
import { REMOVE_FROM_CART } from "../ActionTypes";
import { SELECTED_PLAYERS } from "../ActionTypes";
import { TOTAL_POINTS } from "../ActionTypes";

export const cart = (
  state = {
    playersList: [],
    selectdPlayers: [],
    constructorList: [],
    totalPoints: 0,
  },
  action
) => {
  switch (action.type) {
    case PLAYERS_LIST:
      return {
        ...state,
        playersList: action.payload,
      };
    case CONSTRUCTOR_LIST:
      return {
        ...state,
        constructorList: action.payload,
      };
    case ADD_TO_CART:
      return {
        ...state,
        selectdPlayers: [...state.selectdPlayers, action.payload],
        totalPoints: state.totalPoints + action.payload.price,
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        selectdPlayers: state.selectdPlayers.filter(
          (player) => player.id !== action.payload.id
        ),
        totalPoints: state.totalPoints - action.payload.price,
      };

    default:
      return state;
  }
};
