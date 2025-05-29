"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../admin/SideBar";
import AdminNavbar from "../admin/AdminNavbar";

import ProductsPage from "../pages/ProductsPage";
import AddProductPage from "../pages/AddProductPage";
import MessagesPage from "../pages/MessagesPage";
import OrdersPage from "../pages/OrdersPage";

import { Get } from "../../Api";
import toast from "react-hot-toast";
import OrderDetail from "../pages/OrderDetail";

export default function AdminDashboard({ setUser }) {
  const [activePage, setActivePage] = useState("products");
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");
  const fetchProducts = async () => {
    setLoading(true);
    const response = await Get({ url: "/product" });
    if (response.success) {
      const fetchedProducts = response.data?.data || [];
      setProducts(fetchedProducts);
    } else {
      toast.error(`Error getting products: ${response.error}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = (product) => {
    if (editingProduct) {
      // Update product
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
      setEditingProduct(null);
    } else {
      // Add product
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
          ? {
              ...product,
              status: product.status === "active" ? "hidden" : "active",
            }
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
            loading={loading}
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
            setActivePage={setActivePage}
            setOrderId={setOrderId}
          />
        );
      case "ordersDetail":
        return <OrderDetail orderId={orderId} />;
      default:
        return (
          <ProductsPage
            products={products}
            onEdit={handleEditProduct}
            onToggleStatus={handleToggleProductStatus}
            loading={loading}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col">
        <AdminNavbar setUser={setUser} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
