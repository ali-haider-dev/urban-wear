import React from "react";

import { useNavigate } from "react-router-dom";

export default function AdminNavbar({ setUser }) {
  const navigate = useNavigate();
  const signOutHandler = async () => {
    await localStorage.removeItem("user");
    await localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };
  return (
    <div className="w-full h-16 bg-white shadow-sm px-6 flex items-center justify-between border-b">
      <h2 className="text-lg font-semibold">Welcome, Admin</h2>
      <button
        className="bg-red-500 text-white px-4 py-1 rounded"
        onClick={signOutHandler}
      >
        Logout
      </button>
    </div>
  );
}
