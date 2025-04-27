"use client"

import { useContext, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { MessageCircle } from "lucide-react"
import "./ItemDetail.css"
import items from "../../mockData/items.json"
import { GlobalContext } from "../../context/GlobalState"

const getItemDetail = (id) => items.filter((item) => item.id === id)[0]

function ItemDetail() {
  const params = useParams()
  const itemId = Number.parseInt(params?.id)
  const item = !!itemId && getItemDetail(itemId)
  const { addItemToCartList, cart } = useContext(GlobalContext)
  const [isAdded, setIsAdded] = useState(cart.findIndex((c) => c.id === itemId) > -1)
  const [showMessages, setShowMessages] = useState(false)
  const [message, setMessage] = useState("")

  const toggleMessages = () => {
    setShowMessages(!showMessages)
  }

  const shareProduct = (e) => {
    e.preventDefault()
    // This would typically integrate with your messaging system
    console.log("Product shared:", item)
    console.log("Message:", message)
    setMessage("")
    setShowMessages(false)
  }

  const productLink = `${window.location.origin}/item/${item.id}`

  return (
    <div className="item-detail-container">
      <Link to="/"> &#8592; Back</Link>
      <div className="item-detail">
        <div className="item-detail-image">
          <img src={item.image || "/placeholder.svg"} alt="Item" />
        </div>
        <div className="item-detail-info">
          <div className="item-brand" style={{ margin: "0px 10px" }}>
            {item.brand}
          </div>
          <div className="item-name">{item.name}</div>
          <div className="item-price">${item.price}</div>

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
                addItemToCartList(item)
                setIsAdded(true)
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
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged.
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
            <input type="text" value={productLink} readOnly className="product-link" />
            <button type="submit" className="send-btn">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default ItemDetail

