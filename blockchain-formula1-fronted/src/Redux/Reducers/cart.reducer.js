import {
  PLAYERS_LIST,
  CONSTRUCTOR_LIST,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  ADD_CONSTRUCTOR,
  REMOVE_CONSTRUCTOR
} from "../ActionTypes";

export const cart = (
  state = {
    playersList: [],
    selectdPlayers: [],
    constructorList: [],
    selectdConstructor: [],
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
    case ADD_CONSTRUCTOR:
      return {
        ...state,
        selectdConstructor: [...state.selectdConstructor, action.payload],
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
    case REMOVE_CONSTRUCTOR:
      return {
        ...state,
        selectdConstructor: state.selectdConstructor.filter(
          (constructor) => constructor.id !== action.payload.id
        ),
        totalPoints: state.totalPoints - action.payload.price,
      };
    default:
      return state;
  }
};
