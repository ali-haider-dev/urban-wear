import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { GlobalContext } from "../../context/GlobalState";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const { cart } = useContext(GlobalContext);

  const signOutHandler = () => {
  
    signOut(auth)
      .then(() => {
        console.log('User signed out');
        // Optionally, redirect or show a message
      })
      .catch((error) => {
        console.error('Error signing out:', error.message);
      });
  };
  return (
    <div className="navbar">
      <Link to="/">
        <h2>UrbanWear</h2>
      </Link>
      <ul className="navbar-ul">
      
        <Link to="/cart">
          <li>
            &#128722;{" "}
            <span className="card-count" style={{ color: "red" }}>
              ({cart.length})
            </span>
          </li>
        </Link>
        <Link to="/orders">
          <li>Orders</li>
        </Link>
        <button className="nav-btn">Hi, John</button>
        <Link to="/login">
          <button className="nav-btn" onClick={signOutHandler}>Logout</button>
          </Link>
      </ul>
    </div>
  );
};

export default Navbar;
