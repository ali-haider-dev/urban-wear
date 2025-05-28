export const AppReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM_IN_CART": {
      const { item, size } = action.payload;

      const existingItem = state.cart.find(
        (cartItem) => cartItem.id === item.id && cartItem.size === size
      );

      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((cartItem) =>
            cartItem.id === item.id && cartItem.size === size
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ),
        };
      } else {
        return {
          ...state,
          cart: [
            ...state.cart,
            {
              ...item,
              size: size,
              quantity: 1,
            },
          ],
        };
      }
    }

    case "UPDATE_CART_ITEM": {
      const { id, size, change } = action.payload;
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === id && item.size === size
            ? { ...item, quantity: item.quantity + change }
            : item
        ),
      };
    }

    case "REMOVE_ITEM_IN_CART": {
      const { id, size } = action.payload;
      return {
        ...state,
        cart: state.cart.filter(
          (item) => !(item.id === id && item.size === size)
        ),
      };
    }

    case "SET_CART_ITEMS":
      console.log("Reducer received SET_CART_ITEMS:", action.payload);
      return {
        ...state,
        cart: Array.isArray(action.payload) ? action.payload : [],
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
