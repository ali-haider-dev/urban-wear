import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";

function Cart() {
  const { cart, addItemToCartList, removeItemFromCartList, updateCartItem } =
    useContext(GlobalContext);

  // Increase quantity handler
  const handleIncrease = (item) => {
    addItemToCartList(item);
  };

  // Decrease quantity handler
  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateCartItem(item.id, -1);
    } else {
      removeItemFromCartList(item);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Your Basket</h1>

      {!cart.length ? (
        <p className="text-center text-gray-600 text-lg">
          No items added! Please add something to your cart.
        </p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Cart Items List */}
          <div className="lg:w-4/4 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row items-center"
              >
                <div className="md:w-32 md:h-32 flex-shrink-0 overflow-hidden">
                  {/* Replace with actual image if you have it */}
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex-grow">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h2>
                  <p className="text-gray-500 mb-2">{item.brand}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-gray-700 mr-2">Qty:</span>
                      <div className="flex items-center rounded border border-gray-300">
                        <button
                          onClick={() => handleDecrease(item)}
                          className="px-3 py-2 hover:bg-gray-100"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          -
                        </button>
                        <span className="px-4 text-gray-800">{item.quantity || 1}</span>
                        <button
                          onClick={() => handleIncrease(item)}
                          className="px-3 py-2 hover:bg-gray-100"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="font-semibold text-gray-900">
                      ${(item.price * (item.quantity || 1)).toFixed(2)}
                    </div>
                  </div>
                </div>
                {/* Remove icon (optional) */}
                {/* <button className="text-gray-500 hover:text-gray-700 focus:outline-none px-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button> */}
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-2/4 h-2/4 bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>

            <div className="flex justify-between text-gray-600 mb-2">
              <span>Subtotal:</span>
              <span>
                $
                {cart
                  .reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
                  .toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-gray-600 mb-2">
              <span>Delivery:</span>
              <span>$0.00</span>
            </div>

            <div className="flex justify-between font-semibold text-gray-900 mb-4">
              <span>Total:</span>
              <span>
                $
                {cart
                  .reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
                  .toFixed(2)}
              </span>
            </div>

            <Link to="/checkout">
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors duration-300">
                Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
