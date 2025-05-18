import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../../firebase";

export default function AdminNavbar() {
    const signOutHandler = () => {
      signOut(auth)
        .then(() => {
          console.log('User signed out');
        })
        .catch((error) => {
          console.error('Error signing out:', error.message);
        });
    };
  return (
    <div className="w-full h-16 bg-white shadow-sm px-6 flex items-center justify-between border-b">
      <h2 className="text-lg font-semibold">Welcome, Admin</h2>
      <button className="bg-red-500 text-white px-4 py-1 rounded"  onClick={signOutHandler}>Logout</button>
    </div>
  );
}
