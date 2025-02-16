import "./App.css";
import HomePage from "./components/home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";

import Orders from "./components/orders/Orders";
import Checkout from "./components/checkout/ChectOut";
import Cart from "./components/cart/Cart";
import ItemDetail from "./components/itemDetail/ItemDetail";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <Navbar />
        </div>
        <Routes>
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route exact path="/Home" element={<HomePage />} />
          <Route exact path="Login" element={<Login />} />
          <Route exact path="Signup" element={<Signup />} />
          <Route exact path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
