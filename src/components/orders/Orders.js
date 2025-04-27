import React, { useContext } from "react";
import { GlobalContext } from "../../context/GlobalState";

function Orders() {
  const { orders } = useContext(GlobalContext);

  // Function to format the order date (example: Thu. 17th Nov'16)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const dayWithSuffix =
      day +
      (day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
        ? "rd"
        : "th");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);
    return `Thu. ${dayWithSuffix} ${month}'${year}`;
  };

  console.log("Orders",orders)

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        {orders.map((order) => (
          <div key={order.orderId} className="mb-4 border-b border-gray-200">
            <div className="bg-gray-50 py-3 px-4 flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600 mb">
                Order{" "}
                <span className="font-semibold text-blue-500">
                  #R03749150{order.orderId}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Order Placed: {formatDate(new Date())}
              </div>
              
            </div>

            <div className="py-4 px-6">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-gray-200 py-4 last:border-b-0"
                >
                  <div className="flex items-center">
                    {/* Replace with actual image if you have it */}
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded mr-4"
                    />
                    <div className="flex-grow">
                      <div className="flex items-baseline justify-between">
                        <h3 className="text-md font-semibold text-gray-800">
                          {item.name}
                        </h3>
                        <div className="font-semibold text-gray-900">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        By: {item.brand || "Unknown"}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-gray-500">
                          Size: S, Qty: {item.quantity || 1}
                        </div>
                        <div className="flex gap-2 items-center">
                          <div className="text-xs text-green-500 font-semibold">
                            In-Transit
                          </div>
                          <div className="text-xs text-gray-500">
                            Delivery Expected by
                          </div>
                          <div className="text-sm text-gray-700 font-semibold">
                            {formatDate(order.deliveryDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="py-4 px-6 flex items-center justify-between">
              <button className="text-white hover:text-blue-700  focus:outline-none bg-blue-500 hover:bg-white rounded-lg px-4 py-2">
                Cancel Order
              </button>
              <div className="text-sm text-gray-600">
                Paid using credit card ending with 7343
              </div>
              <div className="font-semibold text-gray-900">
             Total Order ammount   $. {order.price.toFixed(0)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
