"use client"

import { useState } from "react"
import Sidebar from "../admin/SideBar"
import ProductsPage from "../pages/ProductsPage"
import AddProductPage from "../pages/AddProductPage"
import MessagesPage from "../pages/MessagesPage"
import OrdersPage from "../pages/OredersPage"
import { useNavigate } from 'react-router-dom';
import items from "../../mockData/items.json"


export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("products")
  const navigate = useNavigate();
  const [products, setProducts] = useState(items)
  const [editingProduct, setEditingProduct] = useState(null)

  const handleAddProduct = (product) => {
    if (editingProduct) {
      // Update existing product
      setProducts(products.map((p) => (p.id === product.id ? product : p)))
      setEditingProduct(null)
      navigate("/admin/products")
    } else {
      // Add new product
      setProducts([...products, { ...product, id: Date.now().toString() }])
      navigate("/admin/products")
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setActivePage("add-product")
  }

  const handleToggleProductStatus = (productId) => {
    setProducts(
      products.map((product) =>
        product.id === productId ? { ...product, status: product.status === "active" ? "hidden" : "active" } : product,
      ),
    )
  }

  const renderPage = () => {
    switch (activePage) {
      case "products":
        return (
          <ProductsPage products={products} onEdit={handleEditProduct} onToggleStatus={handleToggleProductStatus} />
        )
      case "add-product":
        return <AddProductPage onAddProduct={handleAddProduct} editingProduct={editingProduct} />
      case "messages":
        return <MessagesPage />
      case "orders":
        return <OrdersPage products={products} onEdit={handleEditProduct} onToggleStatus={handleToggleProductStatus} />
      default:
        return (
          <ProductsPage products={products} onEdit={handleEditProduct} onToggleStatus={handleToggleProductStatus} />
        )
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 overflow-auto">
        <main className="p-6">{renderPage()}</main>
      </div>
    </div>
  )
}
