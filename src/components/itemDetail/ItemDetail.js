"use client";

import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import "./ItemDetail.css";
import items from "../../mockData/items.json";
import { GlobalContext } from "../../context/GlobalState";
import { Get } from "../../Api";
import toast from "react-hot-toast";

function ItemDetail() {
  const params = useParams();
  const itemId = params?.id;
  const [item, setItem] = useState();
  const [loading, setLoading] = useState(false);
  const { addItemToCartList, cart } = useContext(GlobalContext);
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

  const addToCart = (item) => {
    console.log("Adding item to cart:", item);
    const cartData = {
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: item.price,
      sellingPrice: item.sellingPrice,
      discountPerc: item.discountPerc,
      images: item.images,
    };
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
      <Link to="/"> &#8592; Back</Link>
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

          <select className="item-size">
            <option value={"S"}> Select size (S)</option>
            <option value={"M"}> Select size (M)</option>
            <option value={"L"}> Select size (L)</option>
            <option value={"XL"}> Select size (XL)</option>
          </select>
          <div className="button-container">
            <button
              className="item-btn"
              disabled={isAdded}
              onClick={() => {
                addItemToCartList(item);
                addToCart(item);
                setIsAdded(true);
              }}
            >
              {isAdded ? "Added to cart" : "Add To bag"}
            </button>
            <button className="share-btn" onClick={toggleMessages}>
              <MessageCircle size={20} />
              Share
            </button>
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
