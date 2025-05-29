import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/GlobalState";
import toast from "react-hot-toast";
import { Get } from "../../Api";
import moment from "moment";
function Orders() {
  // const { orders } = useContext(GlobalContext);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      const data = {
        PageSize: 30,
      };
      const response = await Get({ url: "/order/user", token, data });
      if (response.success) {
        console.log("Orders response:", response.data.data);
        setOrders(response.data?.data || []);
      } else {
        toast.error(`Error getting products: ${response.error}`);
      }
    };
    fetchProducts();
  }, []);

  // Function to format the order date (example: Thu. 17th Nov'16)
  const formatDate = (dateString) => {
    return moment(dateString).format("ddd. Do MMM'YY");
  };
  const formatDateDelivery = (dateString) => {
    return moment(dateString).add(7, "days").format("ddd. Do MMM'YY");
  };
  console.log("Orders", orders);
  const SIZE_MAP = ["S", "M", "L", "XL"];
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        {orders?.map((order) => (
          <div key={order.id} className="mb-4 border-b border-gray-200">
            <div className="bg-gray-50 py-3 px-4 flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600 mb">
                Order{" "}
                <span className="font-semibold text-blue-500">
                  #{order.orderNumber}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Order Placed: {formatDate(new Date())}
              </div>
            </div>

            <div className="py-4 px-6">
              {order.products.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-gray-200 py-4 last:border-b-0"
                >
                  <div className="flex items-center">
                    {/* Replace with actual image if you have it */}
                    <img
                      src={item.imageURL || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded mr-4"
                    />
                    <div className="flex-grow">
                      <div className="flex items-baseline justify-between">
                        <h3 className="text-md font-semibold text-gray-800">
                          {item.name}
                        </h3>
                        <div className="font-semibold text-gray-900">
                          {item.discountPerc > 0
                            ? item.sellingPrice.toFixed(2)
                            : item.price.toFixed(2)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        By: {item.brandName || "Unknown"}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-gray-500">
                          Size:{SIZE_MAP[item.size]}, Qty: {item.quantity || 1}
                        </div>
                        <div className="flex gap-2 items-center">
                          <div className="text-xs text-green-500 font-semibold">
                            In-Transit
                          </div>
                          <div className="text-xs text-gray-500">
                            Delivery Expected by
                          </div>
                          <div className="text-sm text-gray-700 font-semibold">
                            {formatDateDelivery(order.createdDate)}
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
                Total Order ammount $. {order.total.toFixed(0)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
