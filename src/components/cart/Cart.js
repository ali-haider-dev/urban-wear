import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";
import "./Cart.css";

function Cart() {
  const { cart, addItemToCartList, removeItemFromCartList } = useContext(GlobalContext);

  // Handler to increase the quantity of an item
  const handleIncrease = (item) => {
    addItemToCartList(item); // Increment quantity
  };;

  // Handler to decrease the quantity of an item
  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      removeItemFromCartList({ ...item, quantity: item.quantity - 1 });
    } else {
      removeItemFromCartList(item); // Remove the item if the quantity reaches zero
    }
  };

  return (
    <div className="cart-container">
      <h1>Cart</h1>
      {!cart.length ? (
        <p>No Item Added! Please add something to your cart</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="item-price">Price: ${item.price}</div>
                <div className="item-name">Name: {item.name}</div>
                <div className="item-expectedDelivery">
                  (Expected Delivery 3 - 6 days)
                </div>
                <div className="item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => handleDecrease(item)}
                  >
                    -
                  </button>
                  <span>{item.quantity || 1}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleIncrease(item)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Link to="/checkout">
            <button className="item-btn">Next</button>
          </Link>
        </>
      )}
    </div>
  );
}

export default Cart;
