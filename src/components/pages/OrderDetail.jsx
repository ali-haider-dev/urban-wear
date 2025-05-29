import React, { useEffect, useState } from "react";
import { Get } from "../../Api";
import toast from "react-hot-toast";

export default function OrderDetail({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("token");
      const response = await Get({ url: `/order/${orderId}`, token });
      if (response.success) {
        setOrder(response.data?.data);
      } else {
        toast.error("Failed to load order details.");
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
        <div className="flex space-x-2 animate-pulse">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce [animation-delay:0.1s]" />
          <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]" />
        </div>
      </div>
    );
  }

  if (!order) {
    return <p className="text-center mt-10 text-red-500">Order not found.</p>;
  }

  const size = ["S", "M", "L", "XL"];
  const STATUS_MAP = {
    0: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    1: { label: "Shipped", color: "bg-blue-100 text-blue-800" },
    2: { label: "Delivered", color: "bg-green-100 text-green-800" },
  };
  const statusInfo = STATUS_MAP[order.status] || {
    label: "Unknown",
    color: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold mb-6 text-indigo-700">
        Order #{order.orderNumber}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Info */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Customer Information
          </h2>
          <p>
            <span className="font-medium text-gray-700">Name: </span>
            {order.customer?.fullName}
          </p>
          <p>
            <span className="font-medium text-gray-700">Email: </span>
            {order.customer?.email}
          </p>
          <p>
            <span className="font-medium text-gray-700">Order Date: </span>
            {new Date(order.date).toLocaleString()}
          </p>
          <p>
            <span className="font-medium text-gray-700">Status: </span>
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
          </p>
        </section>

        {/* Payment & Shipping Info */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Payment & Shipping
          </h2>
          <p>
            <span className="font-medium text-gray-700">Subtotal: </span>$
            {order.subTotal.toFixed(2)}
          </p>
          <p>
            <span className="font-medium text-gray-700">Total Discount: </span>$
            {order.totalDiscount.toFixed(2)}
          </p>
          <p className="text-lg font-bold text-indigo-700">
            Grand Total: ${order.total.toFixed(2)}
          </p>
          <p>
            <span className="font-medium text-gray-700">
              Shipping Address:{" "}
            </span>
            {order.shippingAddress || "N/A"}
          </p>
          <p>
            {order.city}, {order.state} {order.zip}
          </p>
          <p>
            <span className="font-medium text-gray-700">Payment Method: </span>
            {order.paymentMethod === 0 ? "Cash on Delivery" : "Other"}
          </p>
        </section>
      </div>

      {/* Products Section */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
          Products Ordered
        </h2>
        <div className="space-y-6">
          {order.products.map((product) => (
            <div
              key={product.id}
              className="flex flex-row md:flex-row items-center md:items-start gap-6 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <img
                src={product.imageURL}
                alt={product.name}
                className="w-50 h-100 object-contain rounded-lg"
              />
              <div className="flex-1  space-y-1">
                <h3 className="text-xl font-bold text-indigo-700">
                  {product.name}
                </h3>
                <p>
                  <span className="font-medium text-gray-700">Brand: </span>
                  {product.brandName}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Color: </span>
                  {product.color}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Size: </span>
                  {size[product.size || 0]}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Quantity: </span>
                  {product.quantity}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Price: </span>$
                  {product.price.toFixed(2)}
                  {product.discountPerc > 0 && (
                    <span className="ml-2 text-red-500 font-semibold">
                      (Discount: {product.discountPerc}%)
                    </span>
                  )}
                </p>
                <p className="text-lg font-semibold text-indigo-800">
                  Selling Price: ${product.sellingPrice.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
