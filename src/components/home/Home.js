import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Send, Star, Loader, Bot, User, Globe } from "lucide-react";
import { Get, Post } from "../../Api";
import toast from "react-hot-toast";
import parse from "html-react-parser";
import "./Home.css";
import bot from "../../utils/bot.png"; // Adjust the path as necessary
import { GlobalContext } from "../../context/GlobalState";

function Item({ name, brandName, price, discountPerc, imageURL, rating }) {
  const discountedPrice = discountPerc
    ? price - (price * discountPerc) / 100
    : price;

  return (
    <div className="relative bg-[#e4e2dd] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer max-w-xs mx-auto item-card">
      {discountPerc > 0 && (
        <div className="absolute top-3 left-3 bg-[#e15600] text-white text-xs font-semibold px-2 py-1 rounded-md z-10">
          {discountPerc}% OFF
        </div>
      )}
      <img
        src={imageURL || "/placeholder.svg"}
        alt={name}
        className="w-full h-52 object-cover rounded-lg item-image"
      />
      <div className="p-4 item-details bg-[#454545]">
        <h5
          className="text-md font-semibold text-[#e15600] truncate"
          title={name}
        >
          {name}
        </h5>
        <p
          className="text-sm text-white mb-2 truncate align-start"
          title={brandName}
        >
          by {brandName}
        </p>
        <div className="flex items-center mb-3 item-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < Math.floor(rating) ? "#facc15" : "none"}
              stroke="#facc15"
              className="mr-0.5"
            />
          ))}
          <span className="text-sm text-white ml-2">({rating.toFixed(1)})</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-xl font-bold text-[#e15600] ">
            ${discountedPrice.toFixed(2)}
          </span>
          {discountPerc > 0 && (
            <span className="text-sm line-through text-[#e15600]">
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
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isManualMode, setIsManualMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  const token = localStorage.getItem("token");
  const messageEndRef = useRef(null);
  const { setCartItems } = useContext(GlobalContext);

  const languages = [
    "English",
    "urdu", // Urdu
    "العربية", // Arabic
    "spanish",
    "french",
    "japenese"
  ];

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to view your cart.");
      return;
    }

    const getCartItems = async () => {
      const response = await Get({ url: "/cart", token });
      if (response?.success) {
        const fetchedCartItems = response.data?.data?.products || [];
        setCartItems(fetchedCartItems);
        console.log("Fetched cart items:", fetchedCartItems);
      } else {
        toast.error(`Error fetching cart items: ${response.error}`);
      }
    };

    getCartItems();
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchProducts = async () => {
    const data = {
      PageSize: 50,
    };
    const response = await Get({ url: "/product", token, data });
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

    try {
      if (isManualMode) {
        // Manual chat API call - replace with your actual manual chat endpoint
        const response = await Post({
          url: "/chat/manual", // Your manual chat endpoint
          data: { 
            message: message,
            language: selectedLanguage,
            role: 0 
          },
          token,
          customBaseURL: "https://urbanwear.naveedportfolio.com",
        });

        if (response.success) {
          const assistantMsg = { 
            text: response.data?.message || "Manual response received", 
            sender: "assistant" 
          };
          setMessages((prev) => [...prev, assistantMsg]);
        } else {
          toast.error(`Manual chat failed: ${response.error}`);
        }
      } else {
        // AI Assistant API call (existing logic)
        const response = await Post({
          url: "/openAi/assistant",
          data: { 
            role: 0, 
            message: message,
            language: selectedLanguage 
          },
          token,
          customBaseURL: "https://urbanwear.naveedportfolio.com",
        });

        if (response.success) {
          const raw = response.data?.data?.message || "No reply";
          const clean = raw.replace(/^Role:\s*Assistant\s*/i, "").trim();
          const assistantMsg = { text: clean, sender: "assistant" };
          setMessages((prev) => [...prev, assistantMsg]);
        } else {
          toast.error(`AI Assistant failed: ${response.error}`);
        }
      }
    } catch (error) {
      toast.error("Message sending failed");
    }

    setIsLoading(false);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
  };

  const filteredProducts = products.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (products.length < 1)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
        <div className="flex space-x-2 animate-pulse">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce [animation-delay:0.1s]" />
          <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]" />
        </div>
      </div>
    );

  return (
    <section style={{ height: "100vh" }}>
      {/* Search Bar */}
      <div
        style={{ maxWidth: "800px", margin: "30px auto 0", padding: "0 20px" }}
      >
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 20px",
            fontSize: "1em",
            border: "1px solid #ccc",
            borderRadius: "30px",
            boxShadow: "0 2px 5px var(--shadow-color)",
            outline: "none",
            backgroundColor: "#ffffff",
          }}
        />
      </div>

      <div className="item-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
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
          <p className="text-center text-gray-500 w-full h-full">
            No matching products found.
          </p>
        )}
      </div>

      <button className="floating-message-icon" onClick={toggleMessage}>
        <MessageCircle size={24} />
      </button>

      {isMessageOpen && (
        <div className="message-container">
          <div className="message-header">
            <div className="flex items-center gap-2">
              <h3>UrbanWear {isManualMode ? 'Manual' : 'Assistant'}</h3>
              <div className="relative">
                <button 
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors"
                  title={`Current language: ${selectedLanguage}`}
                >
                  <Globe size={14} />
                  <span className="text-xs">{selectedLanguage}</span>
                </button>
                
                {showLanguageDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-50 min-w-[120px]">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageSelect(lang)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                          selectedLanguage === lang ? 'bg-gray-200 font-semibold' : ''
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Mode Toggle */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsManualMode(!isManualMode)}
                  className={`p-1 rounded transition-colors ${
                    isManualMode ? 'bg-white/30' : 'bg-white/10'
                  }`}
                  title={isManualMode ? 'Switch to AI Assistant' : 'Switch to Manual Chat'}
                >
                  {isManualMode ? <User size={16} /> : <Bot size={16} />}
                </button>
              </div>
              
              <button onClick={toggleMessage}>×</button>
            </div>
          </div>
          
          <div className="message-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message-row ${msg.sender}`}>
                {msg.sender === "assistant" && (
                  <img src={bot} alt="Assistant" className="avatar" />
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
              placeholder={`Type your message in ${selectedLanguage}...`}
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