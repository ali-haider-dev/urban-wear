import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";
import "./Checkout.css";

const Checkout = () => {
  const { cart, orders, addItemToOrderList, clearCart, updateCartItem } =
    useContext(GlobalContext);
  const { discount, extraFees, tax } = { discount: 20, extraFees: 99, tax: 5 };

  // Calculate subtotal based on item quantity
  const subTotal = Math.floor(
    cart?.reduce((sum, curr) => sum + curr.price * curr.quantity, 0)
  );

  const total = Math.floor(
    subTotal + extraFees + tax - (subTotal + extraFees + tax) * (discount / 100)
  );

  const [isOrdered, setIsOrdered] = useState(false);

  const handlePay = () => {
    addItemToOrderList({
      orderId: orders.length + 1,
      buyerId: 1,
      items: [...cart],
      price: total,
      address: "7 Rusk Court",
      deliveryDate: "11/28/2022",
      isDelivered: false,
    });
    clearCart();
    setIsOrdered(true);
  };

  const handleQuantityChange = (itemId, change) => {
    updateCartItem(itemId, change); // Update the quantity in the cart
  };

  return (
    <div className="checkout-container">
      {isOrdered ? (
        <h3>
          Yay! 🚀 Order placed successfully. <Link to="/">Shop more!</Link>
        </h3>
      ) : (
        <>
          <div>
            <div className="custom-row">
              <h4>Order Review</h4>
              <span>{cart?.length} unique items in cart</span>
            </div>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p>Price: ${item.price}</p>
                    <div className="cart-item-quantity">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.id, 1)}>
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="custom-row">
              <h4>Checkout Summary</h4>
              <div className="checkout-summary">
                <span>Subtotal</span>
                <span>${subTotal}</span>
              </div>
              <div className="checkout-summary">
                <span>Discount</span>
                <span>{discount}%</span>
              </div>
              <div className="checkout-summary">
                <span>Extra Fee</span>
                <span>${extraFees}</span>
              </div>
              <div className="checkout-summary">
                <span>Tax</span>
                <span>${tax}</span>
              </div>
            </div>
            <div className="custom-row">
              <h4>Total</h4>
              <span>${total}</span>
            </div>
          </div>
          <button className="item-btn" onClick={handlePay}>
            Pay ${total}
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;
