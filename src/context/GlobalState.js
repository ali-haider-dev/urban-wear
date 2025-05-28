import React, { createContext, useReducer } from "react";
import { AppReducer } from "./AppReducer";

// Initial state
const initialState = {
  cart: [],
  orders: [],
};

// Create context
export const GlobalContext = createContext(initialState);

// GlobalProvider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions
  const addItemToCartList = (item, size) => {
    dispatch({
      type: "ADD_ITEM_IN_CART",
      payload: { item, size },
    });
  };

  const setCartItems = (cartArray) => {
    console.log("Setting cart items:", cartArray);
    dispatch({
      type: "SET_CART_ITEMS",
      payload: cartArray,
    });
  };

  const removeItemFromCartList = (itemId, size) => {
    dispatch({
      type: "REMOVE_ITEM_IN_CART",
      payload: { id: itemId, size },
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

  const updateCartItem = (itemId, size, change) => {
    dispatch({
      type: "UPDATE_CART_ITEM",
      payload: { id: itemId, size: size, change: change },
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
        updateCartItem,
        setCartItems,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
