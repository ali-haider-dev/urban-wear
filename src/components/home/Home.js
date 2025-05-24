import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Send, Star, Globe, Loader } from "lucide-react";
import items from "../../mockData/items.json";
import "./Home.css";
import { Get } from "../../Api";
import toast from "react-hot-toast";

function Item({ name, brandName, price, discountPerc, imageURL, rating }) {
  const discountedPrice = discountPerc
    ? price - (price * discountPerc) / 100
    : price;

  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer max-w-xs mx-auto">
      {/* Discount Badge */}
      {discountPerc > 0 && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md z-10">
          {discountPerc}% OFF
        </div>
      )}

      {/* Product Image */}
      <img
        src={imageURL || "/placeholder.svg"}
        alt={name}
        className="w-full h-52 object-cover rounded-t-2xl"
      />

      {/* Product Info */}
      <div className="p-4">
        {/* Name & Brand */}
        <h3
          className="text-lg font-semibold text-gray-900 truncate"
          title={name}
        >
          {name}
        </h3>
        <p className="text-sm text-gray-500 mb-2 truncate" title={brandName}>
          by {brandName}
        </p>

        {/* Rating */}
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

        {/* Price Section */}
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
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState("");

  const fetchProducts = async () => {
    const response = await Get({ url: "/product" });
    if (response.success) {
      const fetchedProducts = response.data?.data || [];
      setProducts(fetchedProducts);
    } else {
      toast.error(`Error getting products: ${response.error}`);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const languages = [
    { code: "en", name: "English" },
    { code: "zh", name: "Chinese" },
    { code: "fr", name: "French" },
    { code: "it", name: "Italian" },
  ];

  const toggleMessage = () => {
    setIsMessageOpen(!isMessageOpen);
  };

  const translateMessage = async (text, target) => {
    if (target === "en") {
      return text;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=en|${target}`
      );
      if (!response.ok) {
        throw new Error("Translation failed");
      }
      const data = await response.json();
      if (data.responseStatus === 200) {
        return data.responseData.translatedText;
      } else {
        throw new Error(data.responseDetails || "Translation failed");
      }
    } catch (err) {
      console.error("Translation error:", err);
      setError("Translation failed. Please try again later.");
      return text;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      setIsLoading(true);
      const translatedMessage = await translateMessage(message, targetLanguage);
      setMessages([
        ...messages,
        {
          text: message,
          translations: { [targetLanguage]: translatedMessage },
          sender: "user",
        },
      ]);
      setMessage("");
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (e) => {
    const newLanguage = e.target.value;
    setTargetLanguage(newLanguage);
    setIsLoading(true);

    const updatedMessages = await Promise.all(
      messages.map(async (msg) => {
        if (!msg.translations[newLanguage]) {
          const translatedText = await translateMessage(msg.text, newLanguage);
          return {
            ...msg,
            translations: {
              ...msg.translations,
              [newLanguage]: translatedText,
            },
          };
        }
        return msg;
      })
    );

    setMessages(updatedMessages);
    setIsLoading(false);
  };

  return (
    <section>
      <div className="item-list">
        {products ? (
          products?.map((item) => (
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
            <h3>Messages</h3>
            <div className="language-selector">
              <Globe size={20} />
              <select
                value={targetLanguage}
                onChange={handleLanguageChange}
                disabled={isLoading}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={toggleMessage}>×</button>
          </div>
          <div className="message-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div>{msg.translations[targetLanguage] || msg.text}</div>
              </div>
            ))}
            {error && <div className="error-message">{error}</div>}
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
