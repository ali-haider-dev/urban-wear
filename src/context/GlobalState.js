import React, { createContext, useReducer } from "react";
import {AppReducer} from "./AppReducer";

// Initial state
const initialState = {
  cart: [],
  orders: [],
};

// Create context
export const GlobalContext = createContext(initialState); // Define and export GlobalContext here

// GlobalProvider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions
  const addItemToCartList = (item) => {
    dispatch({
      type: "ADD_ITEM_IN_CART",
      payload: item,
    });
  };

  const removeItemFromCartList = (item) => {
    dispatch({
      type: "REMOVE_ITEM_IN_CART",
      payload: item,
    });
  };

  const clearCart = () => {
    dispatch({
      type: "CLEAR_CART",
    });
  };

  const addItemToOrderList = (item) => {
    dispatch({
      type: "ADD_ITEM_IN_ORDER",
      payload: item,
    });
  };
  const updateCartItem = (itemId, change) => {
    dispatch({
      type: "UPDATE_CART_ITEM",
      payload: { id: itemId, change },
    });
  };

  const removeItemFromOrderList = (item) => {
    dispatch({
      type: "REMOVE_ITEM_IN_ORDER",
      payload: item,
    });
  };

  return (
    <GlobalContext.Provider
      value={{
        cart: state.cart,
        orders: state.orders,
        addItemToCartList,
        removeItemFromCartList,
        clearCart,
        addItemToOrderList,
        removeItemFromOrderList,
        updateCartItem 
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
