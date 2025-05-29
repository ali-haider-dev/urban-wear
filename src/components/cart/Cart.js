import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";
import { Delete, Get, Put } from "../../Api";
import toast from "react-hot-toast";

function Cart() {
  const {
    cart,
    setCartItems,
    addItemToCartList,
    removeItemFromCartList,
    updateCartItem,
  } = useContext(GlobalContext);

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

  // Increase quantity handler
  const handleIncrease = async (item) => {
    const token = localStorage.getItem("token");
    const cartData = {
      id: item.id,
      quantity: 1,
    };
    const response = await Put({
      url: `/cart/product/${item.id}`,
      data: cartData,
      token,
    });
    if (response?.success) {
      console.log("cart response", response.data.data.products);
      addItemToCartList(item, item.size || 0); // Ensure size is included
    } else {
      toast.error(`Error adding item to cart: ${response.error}`);
    }
  };

  // Decrease quantity handler
  const handleDecrease = async (item) => {
    if (item.quantity > 1) {
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
        updateCartItem(item.id, item.size || 0, -1); // Ensure size is included
      } else {
        toast.error(`Error adding item to cart: ${response.error}`);
      }
    } else {
      const token = localStorage.getItem("token");
      const data = {
        id: item.id,
        size: item.size || 0, // Ensure size is included
      };
      const response = await Delete({
        url: `/cart/product/${item.id}/size/${item.size || 0}`,
        token,
        data,
      });
      console.log("Delete response", response);
      if (response?.success) {
        removeItemFromCartList(item.id, item.size || 0); // Ensure size is included
      } else {
        toast.error(`Error removing item from cart: ${response.error}`);
      }
    }
  };

  const cartItems = cart ?? []; // Safe fallback
  const sizeMap = ["S", "M", "L", "XL"];
  return (
    <div className="max-w-3xl py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-orange-600 mb-4">
        Your Basket
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No items added! Please add something to your cart.
        </p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 ">
          {/* Cart Items List */}
          <div className="lg:w-4/3 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="rounded-lg overflow-hidden flex flex-col md:flex-row items-center"
                style={{ border: "1px solid #99927f" }}
              >
                <div className="md:w-32 md:h-32 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={item?.imageURL || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover ml-2"
                    style={{ borderRadius: "10px" }}
                  />
                </div>

                <div className="p-4 flex-grow">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h2>
                  <p className="text-gray-500 mb-2">{item.brand}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-start">
                      <span className="text-gray-500 text-sm mb-1">
                        Size: {sizeMap[item.size]}
                      </span>
                      <div className="flex items-center">
                        <span className="text-gray-700 mr-2">Qty:</span>
                        <div className="flex items-center rounded border border-gray-300">
                          <button
                            onClick={() => handleDecrease(item)}
                            className="px-2 py-1 bg-[#e15600]"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            -
                          </button>
                          <span className="px-2 text-gray-800">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => handleIncrease(item)}
                            className="px-2 py-1 bg-[#e15600]"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    {item.discountPerc ? (
                      <div className="font-semibold text-gray-900 text-[24px] text-orange-700 mt-3">
                        ${(item.sellingPrice * (item.quantity || 1)).toFixed(2)}
                      </div>
                    ) : (
                      <div className="font-semibold text-gray-900 text-[24px] text-orange-700 mt-3">
                        ${(item.price * (item.quantity || 1)).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-2/4 h-2/4  shadow-md rounded-lg p-4 border border-[#99927f]">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Order Summary
            </h3>

            <div className="flex justify-between text-gray-600 mb-2">
              <span>Subtotal:</span>

              <span>
                $
                {cartItems
                  .reduce(
                    (sum, item) =>
                      sum + item.sellingPrice ||
                      item.price * (item.quantity || 1),
                    0
                  )
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
                {cartItems
                  .reduce(
                    (sum, item) =>
                      sum + item.sellingPrice ||
                      item.price * (item.quantity || 1),
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>

            <Link to="/checkout">
              <button className="w-full bg-orange-500 hover:bg-[#e15600] text-white font-semibold py-3 rounded rounded-lg transition-colors duration-300">
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
