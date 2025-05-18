import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const { cart } = useContext(GlobalContext);

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
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition">
        UrbanWear
      </Link>

      <ul className="flex items-center space-x-6">
        <li>
          <Link to="/orders" className="text-gray-700 hover:text-blue-600 font-medium transition">
            Orders
          </Link>
        </li>

        <li>
          <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 transition">
            🛒
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
              {cart.length}
            </span>
          </Link>
        </li>

        <li>
          <button className="bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-md text-gray-800 font-medium transition">
            Hi, John
          </button>
        </li>

        <li>
          <button
            onClick={signOutHandler}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md font-medium transition"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
