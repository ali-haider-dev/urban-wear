import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";
import "./Checkout.css";
import { Get, Put } from "../../Api";
import toast from "react-hot-toast";

const Checkout = () => {
  const {
    cart,
    setCartItems,
    orders,
    addItemToOrderList,
    clearCart,
    updateCartItem,
  } = useContext(GlobalContext);
  const { discount, extraFees, tax } = { discount: 0, extraFees: 0, tax: 5 };
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to view your cart.");
      return;
    }

    const getCartItems = async () => {
      const response = await Get({ url: "/cart", token });
      if (response?.success) {
        const fetchedCartItems = response.data?.data?.products || [];
        setCartItems(fetchedCartItems);
        console.log("Fetched cart items:", fetchedCartItems);
      } else {
        toast.error(`Error fetching cart items: ${response.error}`);
      }
    };

    getCartItems();
  }, []);
  // If cart is null or undefined, show loader
  if (!cart) {
    return (
      <div className="flex items-center justify-center min-h-[100vh] w-full">
        <div className="flex space-x-2 animate-pulse">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce [animation-delay:0.1s]" />
          <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]" />
        </div>
      </div>
    );
  }

  const cartItems = cart ?? [];

  const subTotal = Math.floor(
    cartItems.reduce((sum, curr) => sum + curr.price * (curr.quantity || 1), 0)
  );

  const total = Math.floor(
    subTotal + extraFees + tax - (subTotal + extraFees + tax) * (discount / 100)
  );

  const handlePay = () => {
    navigate("/payment");
    // console.log("Order placed successfully", total);
    // addItemToOrderList({
    //   orderId: orders.length + 1,
    //   buyerId: 1,
    //   items: [...cartItems],
    //   price: total,
    //   address: "7 Rusk Court",
    //   deliveryDate: "11/28/2022",
    //   isDelivered: false,
    // });
    // clearCart();
    // setIsOrdered(true);
  };

  const handleQuantityChange = async (item, itemId, change) => {
    const token = localStorage.getItem("token");
    const cartData = {
      id: item.id,
      quantity: -1,
    };
    const response = await Put({
      url: `/cart/product/${item.id}`,
      data: cartData,
      token,
    });
    if (response?.success) {
      console.log("cart response", response.data.data.products);
      updateCartItem(itemId, item.size || 0, change); // Ensure size is included
    } else {
      toast.error(`Error adding item to cart: ${response.error}`);
    }
  };
  const sizeMap = ["S", "M", "L", "XL"];
  console.log("cartItems check out", cartItems);
  return (
    <div className="checkout-container shadow-lg">
      {isOrdered ? (
        <h3>
          Yay! 🚀 Order placed successfully. <Link to="/">Shop more!</Link>
        </h3>
      ) : (
        <>
          <div>
            <div className="custom-row">
              <h4>Order Review</h4>
              <span>{cartItems.length} unique items in cart</span>
            </div>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item bg-[#e4e2dd] shadow-lg">
                  <img
                    src={item?.imageURL}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p>Price: ${item.price}</p>
                    <div className="cart-item-quantity">
                      <div className="cart-item-size">
                        Size: {sizeMap[item.size]}
                      </div>
                      <div className="quantity-buttons">
                        <button
                          onClick={() =>
                            handleQuantityChange(item, item.id, -1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="custom-row">
              <h4>Checkout Summary</h4>
              <div className="checkout-summary">
                <span className="font-bold text-md">Subtotal</span>
                <span className="font-bold text-md">${subTotal}</span>
              </div>
              <div className="checkout-summary">
                <span className="font-bold text-md">Discount</span>
                <span className="font-bold text-md">{discount}%</span>
              </div>
              <div className="checkout-summary">
                <span className="font-bold text-md">Extra Fee</span>
                <span className="font-bold text-md">${extraFees}</span>
              </div>
              <div className="checkout-summary">
                <span className="font-bold text-md">Tax</span>
                <span className="font-bold text-md">${tax}</span>
              </div>
            </div>
            <div className="custom-row">
              <h5 className="font-bold text-md">Total</h5>
              <span className="font-bold text-md">${total}</span>
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
