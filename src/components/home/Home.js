import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Send, Star, Loader } from "lucide-react";
import { Get, Post } from "../../Api";
import toast from "react-hot-toast";
import parse from "html-react-parser";
import "./Home.css";

function Item({ name, brandName, price, discountPerc, imageURL, rating }) {
  const discountedPrice = discountPerc
    ? price - (price * discountPerc) / 100
    : price;

  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer max-w-xs mx-auto">
      {discountPerc > 0 && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md z-10">
          {discountPerc}% OFF
        </div>
      )}
      <img
        src={imageURL || "/placeholder.svg"}
        alt={name}
        className="w-full h-52 object-cover rounded-t-2xl"
      />
      <div className="p-4">
        <h3
          className="text-lg font-semibold text-gray-900 truncate"
          title={name}
        >
          {name}
        </h3>
        <p className="text-sm text-gray-500 mb-2 truncate" title={brandName}>
          by {brandName}
        </p>
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < Math.floor(rating) ? "#facc15" : "none"}
              stroke="#facc15"
              className="mr-0.5"
            />
          ))}
          <span className="text-sm text-gray-600 ml-2">
            ({rating.toFixed(1)})
          </span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-xl font-bold text-gray-900">
            ${discountedPrice.toFixed(2)}
          </span>
          {discountPerc > 0 && (
            <span className="text-sm line-through text-gray-400">
              ${price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState("");
  const token = localStorage.getItem("token");
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchProducts = async () => {
    const response = await Get({ url: "/product", token });
    if (response.success) {
      setProducts(response.data?.data || []);
    } else {
      toast.error(`Error getting products: ${response.error}`);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleMessage = async () => {
    setIsMessageOpen((prev) => !prev);

    if (!isMessageOpen && messages.length === 0) {
      setIsLoading(true);
      const response = await Get({
        url: "/openAi/assistant",
        token,
        customBaseURL: "https://urbanwear.naveedportfolio.com",
      });

      if (response.success) {
        const rawMessages = response.data?.data || [];

        // 🔁 Convert API format to frontend format
        const formattedMessages = rawMessages.map((m) => ({
          sender: m.role === 0 ? "user" : "assistant",
          text:
            m.role === 1
              ? m.message.replace(/^Role:\s*Assistant\s*/i, "").trim()
              : m.message.trim(),
        }));

        setMessages(formattedMessages);
      } else {
        toast.error(`Error loading messages: ${response.error}`);
      }

      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = { text: message, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setIsLoading(true);

    const response = await Post({
      url: "/openAi/assistant",
      data: { role: 0, message },
      token,
      customBaseURL: "https://urbanwear.naveedportfolio.com",
    });

    if (response.success) {
      const raw = response.data?.data?.message || "No reply";
      const clean = raw.replace(/^Role:\s*Assistant\s*/i, "").trim();
      const assistantMsg = { text: clean, sender: "assistant" };
      setMessages((prev) => [...prev, assistantMsg]);
    } else {
      toast.error(`Send failed: ${response.error}`);
    }

    setIsLoading(false);
  };

  return (
    <section>
      <div className="item-list">
        {products ? (
          products.map((item) => (
            <Link to={`/item/${item.id}`} key={item.id}>
              <Item
                name={item.name}
                brandName={item.brandName}
                price={item.price}
                discountPerc={item.discountPerc}
                imageURL={item.imageURL}
                rating={item.rating}
              />
            </Link>
          ))
        ) : (
          <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
            <div className="flex space-x-2 animate-pulse">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce [animation-delay:0.1s]" />
              <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]" />
            </div>
          </div>
        )}
      </div>

      <button className="floating-message-icon" onClick={toggleMessage}>
        <MessageCircle size={24} />
      </button>

      {isMessageOpen && (
        <div className="message-container">
          <div className="message-header">
            <h3>UrbanWear Assistant</h3>
            <button onClick={toggleMessage}>×</button>
          </div>
          <div className="message-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message-row ${msg.sender}`}>
                {msg.sender === "assistant" && (
                  <img
                    src="/urbanwear-bot-avatar.png"
                    alt="Assistant"
                    className="avatar"
                  />
                )}
                <div className={`message ${msg.sender}`}>
                  {msg.sender === "assistant" ? parse(msg.text) : msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <Loader size={24} className="animate-spin mx-auto my-2" />
            )}
            <div ref={messageEndRef} />
          </div>
          <form
            onSubmit={handleSendMessage}
            className="message-input-container"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}

export default HomePage;
