import { PLAYERS_LIST } from "../ActionTypes";

export const cart = (
  state = {
    playersList: [],
  },
  action
) => {
  switch (action.type) {
    case PLAYERS_LIST:
      return {
        ...state,
        playersList: action.payload,
      };

    default:
      return state;
  }
};
