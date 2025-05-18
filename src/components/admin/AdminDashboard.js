"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../admin/SideBar";
import AdminNavbar from "../admin/AdminNavbar";

import ProductsPage from "../pages/ProductsPage";
import AddProductPage from "../pages/AddProductPage";
import MessagesPage from "../pages/MessagesPage";
import OrdersPage from "../pages/OredersPage";

import items from "../../mockData/items.json";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("products");
  const [products, setProducts] = useState(items);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  const handleAddProduct = (product) => {
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
      setEditingProduct(null);
    } else {
      setProducts([...products, { ...product, id: Date.now().toString() }]);
    }
    setActivePage("products");
    navigate("/admin/dashboard");
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setActivePage("add-product");
  };

  const handleToggleProductStatus = (productId) => {
    setProducts(
      products.map((product) =>
        product.id === productId
          ? { ...product, status: product.status === "active" ? "hidden" : "active" }
          : product
      )
    );
  };

  const renderPage = () => {
    switch (activePage) {
      case "products":
        return (
          <ProductsPage
            products={products}
            onEdit={handleEditProduct}
            onToggleStatus={handleToggleProductStatus}
          />
        );
      case "add-product":
        return (
          <AddProductPage
            onAddProduct={handleAddProduct}
            editingProduct={editingProduct}
          />
        );
      case "messages":
        return <MessagesPage />;
      case "orders":
        return (
          <OrdersPage
            products={products}
            onEdit={handleEditProduct}
            onToggleStatus={handleToggleProductStatus}
          />
        );
      default:
        return (
          <ProductsPage
            products={products}
            onEdit={handleEditProduct}
            onToggleStatus={handleToggleProductStatus}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Admin Top Navbar */}
        <AdminNavbar />

        {/* Main Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
