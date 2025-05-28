"use client";

import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import "./ItemDetail.css";
import items from "../../mockData/items.json";
import { GlobalContext } from "../../context/GlobalState";
import { Get, Put } from "../../Api";
import toast from "react-hot-toast";

function ItemDetail() {
  const params = useParams();
  const itemId = params?.id;
  const [item, setItem] = useState();
  const [loading, setLoading] = useState(false);
  const { addItemToCartList, cart } = useContext(GlobalContext);
  const [size, setSize] = useState("0");
  const [isAdded, setIsAdded] = useState(
    cart.findIndex((c) => c.id === itemId) > -1
  );
  const [showMessages, setShowMessages] = useState(false);
  const [message, setMessage] = useState("");
  const fetchProduct = async () => {
    setLoading(true);
    const response = await Get({ url: `/product/${itemId}` });
    if (response.success) {
      const fetchedProducts = response.data?.data || [];
      setItem(fetchedProducts);
    } else {
      toast.error(`Error getting products: ${response.error}`);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchProduct();
  }, []);

  const addToCart = async (item) => {
    console.log("Adding item to cart:", item);
    console.log("size", size);
    const token = localStorage.getItem("token");
    const cartData = {
      id: item.id,
      size: Number(size),
      quantity: 1,
    };
    const response = await Put({
      url: `/cart/product/${item.id}`,
      data: cartData,
      token,
    });
    if (response?.success) {
      console.log("cart resposnse", response.data.data.products);
        addItemToCartList(item,size);
    } else {
      toast.error(`Error adding item to cart: ${response.error}`);
    }

    // addItemToCartList(item);
  };

  const toggleMessages = () => {
    setShowMessages(!showMessages);
  };

  const shareProduct = (e) => {
    e.preventDefault();
    // This would typically integrate with your messaging system
    console.log("Product shared:", item);
    console.log("Message:", message);
    setMessage("");
    setShowMessages(false);
  };

  const productLink = item ? `${window.location.origin}/item/${item.id}` : "";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[100vh] w-full">
        <div className="flex space-x-2 animate-pulse">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce [animation-delay:0.1s]" />
          <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]" />
        </div>
      </div>
    );
  }
  return (
    <div className="item-detail-container">
      <div style={{alignSelf:'flex-start'}}><Link to="/"> &#8592; Back</Link></div>
      <div className="item-detail">
        <div className="item-detail-image">
          <img src={item?.images?.[0]?.url || "/placeholder.svg"} alt="Item" />
        </div>
        <div className="item-detail-info">
          <div className="item-brand" style={{ margin: "0px 10px" }}>
            {item?.brand}
          </div>
          <div className="item-name">{item?.name}</div>
          <div className="item-price">
            ${item?.discountPerc ? item.sellingPrice : item?.price}
          </div>

          <select
            className="item-size"
            onChange={(e) => setSize(e.target.value)}
          >
            <option value={"0"}> Select size (S)</option>
            <option value={"1"}> Select size (M)</option>
            <option value={"2"}> Select size (L)</option>
            <option value={"3"}> Select size (XL)</option>
          </select>
          <div className="button-container">
            <button
              className="item-btn"
              // disabled={isAdded}
              onClick={() => {
                addToCart(item);
                setIsAdded(true);
              }}
            >
              {isAdded ? "Added to cart" : "Add To bag"}
            </button>
            {/* <button className="share-btn" onClick={toggleMessages}>
              <MessageCircle size={20} />
              Share
            </button> */}
          </div>
          <p className="item-description">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged.
          </p>
        </div>
      </div>

      {showMessages && (
        <div className="message-box">
          <h3>Share this product</h3>
          <form onSubmit={shareProduct}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              className="message-input"
            />
            <input
              type="text"
              value={productLink}
              readOnly
              className="product-link"
            />
            <button type="submit" className="send-btn">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ItemDetail;
