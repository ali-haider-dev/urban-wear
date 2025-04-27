"use client"
import { Button } from "../ui/Button"
import { Card, CardContent } from "../ui/Card"
import { Edit, Eye, EyeOff } from "lucide-react"

export default function OrdersPage({ products, onEdit, onToggleStatus }) {
  // Only show active products on the orders page
  const activeProducts = products.filter((product) => product.status === "active")

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-001</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">John Smith</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 23, 2023</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$289.99</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Delivered
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-002</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sarah Johnson</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 22, 2023</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$129.99</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Processing
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-003</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Michael Brown</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 21, 2023</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$69.98</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Shipped
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Available Products</h2>
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
                  <Button variant="outline" size="icon" className="bg-white" onClick={() => onToggleStatus(product.id)}>
                    {product.status === "active" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon" className="bg-white" onClick={() => onEdit(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-500 text-sm mb-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
