import { createStore, combineReducers } from "redux";

import { cart } from "./Reducers/cart.reducer";

export const ConfigureStore = () => {
  const store = createStore(
    combineReducers({ cart }),
  );

  return store;
};
