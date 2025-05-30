import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";
import logo from "../../utils/logo2.png"; // Adjust the path as necessary
const Navbar = ({ setUser }) => {
  const { cart } = useContext(GlobalContext);
  const [userName,setUserName]=useState('')
  const navigate = useNavigate();
  const signOutHandler = async () => {
    await localStorage.removeItem("user");
    await localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };
useEffect(()=>{
  const user = JSON.parse(localStorage.getItem('user'))
  console.log("userdata",user)
  setUserName(user.fullName)
},[])
  return (
    <nav className="bg-[#454545] shadow-md px-6 py-1 pt-3 flex items-center justify-between sticky top-0 z-50">
      <Link
        to="/"
        className="text-2xl font-bold text-white hover:text-white-600 transition"
      >
        <img
          src={logo}
          width="80px"
          height={"10px"}
          class="object-contain mb-2"
        />
      </Link>
      <li>
        <button className="py-1.5 rounded-md text-orange-600 font-bold transition rounded ml-[150px] mb-3">
         <span style={{color:'#454545'}}>ffuckhfahfahfahfah</span> {userName}
        </button>
      </li>
      <ul className="flex items-center space-x-6">
        <li>
          <Link
            to="/orders"
            className="text-white hover:text-blue-600 font-medium transition rounded-sm"
          >
            Orders
          </Link>
        </li>

        <li>
          <Link
            to="/cart"
            className="relative text-gray-700 hover:text-blue-600 transition"
          >
            🛒
            <span className="absolute -top-2 -right-3 bg-[#e15600] text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
              {cart.length}
            </span>
          </Link>
        </li>

        <li>
          <button
            onClick={signOutHandler}
            className="bg-[#e15600] hover:bg-red-600 text-white px-4 py-1.5 rounded rounded-md font-medium transition"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
