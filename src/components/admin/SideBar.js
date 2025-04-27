"use client"
import { Package, PlusCircle, MessageSquare, ShoppingCart, Home } from "lucide-react"
import { cn } from "../../utils/utils"

export default function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { id: "products", label: "Products", icon: Package },
    { id: "add-product", label: "Add Product", icon: PlusCircle },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "orders", label: "Orders", icon: ShoppingCart },
  ]

  return (
    <div className="w-64 bg-white border-r shadow-sm h-screen">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Home className="h-6 w-6" />
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActivePage(item.id)}
                className={cn(
                  "flex items-center w-full p-2 rounded-md text-left",
                  activePage === item.id ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50",
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
