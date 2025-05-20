import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { auth } from "./firebase";
import Navbar from "./components/navbar/Navbar";

// User Pages
import HomePage from "./components/home/Home";
import Orders from "./components/orders/Orders";
import Checkout from "./components/checkout/ChectOut";
import Cart from "./components/cart/Cart";
import ItemDetail from "./components/itemDetail/ItemDetail";

// Auth Pages
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";

// Admin Pages
import AdminDashboard from "./components/admin/AdminDashboard";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ForgotPassword/ResetPassword";
import VerifyOtp from "./components/ForgotPassword/VerifyOtp";
// import ManageUsers from "./components/admin/ManageUsers";

function App() {
  const location = useLocation();
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserEmail(user?.email || null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = userEmail === "admin1@gmail.com";
  const isLoggedIn = !!userEmail;

  // Hide Navbar on login/signup pages
  const hideNavbarRoutes = ["/login", "/signup","/admin/dashboard"];
  const showNavbar = isLoggedIn && !hideNavbarRoutes.includes(location.pathname.toLowerCase());

  if (loading) return <div>Loading...</div>;

  return (
    <div className="App">
      {showNavbar && <Navbar />}

      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : isAdmin ? (
          <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* <Route path="/admin/manage-users" element={<ManageUsers />} /> */}
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </>
        ) : (
          <>
            <Route path="/home" element={<HomePage />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
