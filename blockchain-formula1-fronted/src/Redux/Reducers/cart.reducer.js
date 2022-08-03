import { PLAYERS_LIST } from "../ActionTypes";
import { ADD_TO_CART } from "../ActionTypes";
import { REMOVE_FROM_CART } from "../ActionTypes";
import { SELECTED_PLAYERS } from "../ActionTypes";

export const cart = (
  state = {
    playersList: [],
    selectdPlayers: [],
  },
  action
) => {
  switch (action.type) {
    case PLAYERS_LIST:
      return {
        ...state,
        playersList: action.payload,
      };
    case ADD_TO_CART:
      return {
        ...state,
        selectdPlayers: [...state.selectdPlayers, action.payload],
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        selectdPlayers: state.selectdPlayers.filter(
          (player) => player.id !== action.payload.id
        ),
      };

    default:
      return state;
  }
};
