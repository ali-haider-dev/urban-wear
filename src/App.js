import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";

// User Pages
import HomePage from "./components/home/Home";
import Orders from "./components/orders/Orders";
import Checkout from "./components/checkout/ChectOut";
import Cart from "./components/cart/Cart";
import ItemDetail from "./components/itemDetail/ItemDetail";
import { Toaster } from "react-hot-toast";

// Auth Pages
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";

// Admin Pages
import AdminDashboard from "./components/admin/AdminDashboard";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ForgotPassword/ResetPassword";
import VerifyOtp from "./components/ForgotPassword/VerifyOtp";
import Payment from "./components/payment/Payment";

function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Invalid user object in localStorage");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const isLoggedIn = !!user;
  const isAdmin = user?.userName?.toLowerCase().includes("admin");

  const hideNavbarRoutes = ["/login", "/signup", "/admin/dashboard"];
  const showNavbar =
    isLoggedIn && !hideNavbarRoutes.includes(location.pathname.toLowerCase());

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
        <div className="flex space-x-2 animate-pulse">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce [animation-delay:0.1s]" />
          <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]" />
        </div>
      </div>
    );
  return (
    <div className="App">
      <Toaster position="top-right" />
      {showNavbar && <Navbar setUser={setUser} />}

      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : isAdmin ? (
          <>
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard setUser={setUser} />}
            />

            <Route
              path="*"
              element={<Navigate to="/admin/dashboard" replace />}
            />
          </>
        ) : (
          <>
            <Route path="/home" element={<HomePage />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
