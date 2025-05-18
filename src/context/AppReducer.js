export const AppReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM_IN_CART":
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, quantity: 1 }],
        };
      }

    case "REMOVE_ITEM_IN_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload.id),
      };
    case "UPDATE_CART_ITEM":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.change }
            : item
        ),
      };
    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      };
    case "ADD_ITEM_IN_ORDER":
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };
    case "REMOVE_ITEM_IN_ORDER":
      return {
        ...state,
        orders: state.orders.filter((order) => order.id !== action.payload.id),
      };
    default:
      return state;
  }
};
