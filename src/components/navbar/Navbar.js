import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";

const Navbar = ({setUser}) => {
  const { cart } = useContext(GlobalContext);
  const navigate  = useNavigate()
  const signOutHandler = async() => {
    await localStorage.removeItem('user')
    await localStorage.removeItem('token')
    setUser(null)
    navigate("/login")
  };

  return (
    <nav className="bg-[#454545] shadow-md px-6 py-1 pt-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-white hover:text-white-600 transition">
        UrbanWear
      </Link>

      <ul className="flex items-center space-x-6">
        <li>
          <Link to="/orders" className="text-white hover:text-blue-600 font-medium transition">
            Orders
          </Link>
        </li>

        <li>
          <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 transition">
            🛒
            <span className="absolute -top-2 -right-3 bg-[#e15600] text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
              {cart.length}
            </span>
          </Link>
        </li>

        <li>
          <button className="bg-[#ff711a] hover:bg-[#e15600] px-4 py-1.5 rounded-md text-gray-800 font-medium transition">
            Hi, John
          </button>
        </li>

        <li>
          <button
            onClick={signOutHandler}
            className="bg-[#ff711a] hover:bg-red-600 text-white px-4 py-1.5 rounded-md font-medium transition"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
