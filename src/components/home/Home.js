
import { useState } from "react"
import { Link } from "react-router-dom"
import { MessageCircle, Send, Star, Globe, Loader } from "lucide-react"
import items from "../../mockData/items.json"
import "./Home.css"

function Item({ name, rating, price, saleDiscount, image, brand }) {
  const discountedPrice = saleDiscount ? price - (price * saleDiscount) / 100 : price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer max-w-xs mx-auto">
      <img
        src={image || "/placeholder.svg"}
        alt={name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate" title={name}>
          {name}
        </h3>
        <p className="text-sm text-gray-500 mb-2 truncate" title={brand}>
          {brand}
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
          <span className="text-sm text-gray-600 ml-2">({rating.toFixed(1)})</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-xl font-bold text-gray-900">
            ${discountedPrice.toFixed(2)}
          </span>
          {saleDiscount && (
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
  const [isMessageOpen, setIsMessageOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [targetLanguage, setTargetLanguage] = useState("en")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const languages = [
    { code: "en", name: "English" },
    { code: "zh", name: "Chinese" },
    { code: "fr", name: "French" },
    { code: "it", name: "Italian" },
  ]

  const toggleMessage = () => {
    setIsMessageOpen(!isMessageOpen)
  }

  const translateMessage = async (text, target) => {
    if (target === "en") {
      return text; 
    }
  
    setIsLoading(true)
    setError(null)
  
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${target}`
      )
      if (!response.ok) {
        throw new Error("Translation failed")
      }
      const data = await response.json()
      if (data.responseStatus === 200) {
        return data.responseData.translatedText
      } else {
        throw new Error(data.responseDetails || "Translation failed")
      }
    } catch (err) {
      console.error("Translation error:", err)
      setError("Translation failed. Please try again later.")
      return text
    } finally {
      setIsLoading(false)
    }
  }
  

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (message.trim()) {
      setIsLoading(true)
      const translatedMessage = await translateMessage(message, targetLanguage)
      setMessages([
        ...messages,
        {
          text: message,
          translations: { [targetLanguage]: translatedMessage },
          sender: "user",
        },
      ])
      setMessage("")
      setIsLoading(false)
    }
  }

  const handleLanguageChange = async (e) => {
    const newLanguage = e.target.value
    setTargetLanguage(newLanguage)
    setIsLoading(true)

    const updatedMessages = await Promise.all(
      messages.map(async (msg) => {
        if (!msg.translations[newLanguage]) {
          const translatedText = await translateMessage(msg.text, newLanguage)
          return {
            ...msg,
            translations: { ...msg.translations, [newLanguage]: translatedText },
          }
        }
        return msg
      }),
    )

    setMessages(updatedMessages)
    setIsLoading(false)
  }

  return (
    <section>
      <div className="item-list">
        {items.map((item) => (
          <Link to={`/item/${item.id}`} key={item.id}>
            <Item {...item} />
          </Link>
        ))}
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
              <select value={targetLanguage} onChange={handleLanguageChange} disabled={isLoading}>
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
          <form onSubmit={handleSendMessage} className="message-input-container">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </form>
        </div>
      )}
    </section>
  )
}

export default HomePage

