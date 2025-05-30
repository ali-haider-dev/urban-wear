import React, { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { Edit, Eye, EyeOff } from "lucide-react";
import { Get } from "../../Api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
export default function OrdersPage({
  products,
  onEdit,
  onToggleStatus,
  setActivePage,
  setOrderId,
}) {
  const activeProducts = products.filter(
    (product) => product.status === "active"
  );

  const [orders, setOrders] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const STATUS_MAP = {
    0: { label: "PendingPayment", color: "bg-yellow-100 text-yellow-800" },
    1: { label: "Processing", color: "bg-yellow-100 text-yellow-800" },
    2: { label: "Shipped", color: "bg-blue-100 text-blue-800" },
    3: { label: "Delivered", color: "bg-green-100 text-green-800" },
  };

  useEffect(() => {
    const getAllOrders = async () => {
      const token = localStorage.getItem("token");
      const response = await Get({ url: "/order", token });
      if (response.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error getting Orders", response.error);
      }
      setIsLoading(false);
    };
    getAllOrders();
  }, []);

  if (isLoading) {
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders?.map((order) => {
                const statusInfo = STATUS_MAP[order.status] || {
                  label: "Unknown",
                  color: "bg-gray-100 text-gray-800",
                };

                return (
                  <tr key={order.id}>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                      onClick={() => {
                        setActivePage("ordersDetail");
                        setOrderId(order.id);
                      }}
                    >
                      #{order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* <h2 className="text-xl font-semibold mb-4">Available Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeProducts.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white"
                    onClick={() => onToggleStatus(product.id)}
                  >
                    {product.status === "active" ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white"
                    onClick={() => onEdit(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-500 text-sm mb-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">
                  Stock: {product.stock}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}
    </div>
  );
}
