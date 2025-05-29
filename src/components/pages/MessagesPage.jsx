import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { useState } from "react";

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(null);

  // Yeh data API se aayega - temporary example data
  const chats = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      avatar: "JS",
      lastMessage:
        "I'm interested in ordering 50 units of the Premium Headphones for my company. Can you provide a bulk discount?",
      lastMessageTime: "2:30 PM",
      unreadCount: 2,
      online: true,
      messages: [
        {
          id: 1,
          sender: "John Smith",
          message:
            "I'm interested in ordering 50 units of the Premium Headphones for my company. Can you provide a bulk discount?",
          timestamp: "Apr 23, 2023 - 2:30 PM",
          isAdmin: false,
        },
        {
          id: 2,
          sender: "Admin",
          message:
            "Hi John! Yes, we can offer bulk discounts for orders over 25 units. Let me get you a quote.",
          timestamp: "Apr 23, 2023 - 3:15 PM",
          isAdmin: true,
        },
      ],
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      avatar: "SJ",
      lastMessage:
        "When will the Mechanical Keyboard be back in stock? I've been waiting to purchase one for weeks.",
      lastMessageTime: "1:45 PM",
      unreadCount: 1,
      online: false,
      messages: [
        {
          id: 1,
          sender: "Sarah Johnson",
          message:
            "When will the Mechanical Keyboard be back in stock? I've been waiting to purchase one for weeks.",
          timestamp: "Apr 22, 2023 - 1:45 PM",
          isAdmin: false,
        },
      ],
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "mbrown@example.com",
      avatar: "MB",
      lastMessage:
        "I received my Wireless Charger yesterday and it's not working properly. How can I request a replacement?",
      lastMessageTime: "Yesterday",
      unreadCount: 0,
      online: true,
      messages: [
        {
          id: 1,
          sender: "Michael Brown",
          message:
            "I received my Wireless Charger yesterday and it's not working properly. How can I request a replacement?",
          timestamp: "Apr 21, 2023 - 4:30 PM",
          isAdmin: false,
        },
        {
          id: 2,
          sender: "Admin",
          message:
            "Sorry to hear about the issue. I'll send you a replacement right away. Please check your email for tracking details.",
          timestamp: "Apr 21, 2023 - 5:00 PM",
          isAdmin: true,
        },
      ],
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma.w@example.com",
      avatar: "EW",
      lastMessage: "Thanks for the quick delivery! The product is amazing.",
      lastMessageTime: "10:15 AM",
      unreadCount: 0,
      online: false,
      messages: [],
    },
    {
      id: 5,
      name: "David Chen",
      email: "david.chen@example.com",
      avatar: "DC",
      lastMessage: "Can you please check my order status? Order #12345",
      lastMessageTime: "9:30 AM",
      unreadCount: 3,
      online: true,
      messages: [],
    },
  ];

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  const handleBackToChats = () => {
    setSelectedChat(null);
  };

  // Chat Details View
  if (selectedChat) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center p-4 border-b bg-white">
          <button
            onClick={handleBackToChats}
            className="mr-4 text-blue-600 hover:text-blue-800 text-xl"
          >
            ←
          </button>
          <div className="relative mr-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {selectedChat.avatar}
            </div>
            {selectedChat.online && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-lg">{selectedChat.name}</h2>
            <p className="text-sm text-gray-500">
              {selectedChat.online ? "Online" : "Last seen recently"}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
          {selectedChat.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isAdmin ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.isAdmin
                    ? "bg-white text-white rounded-br-md"
                    : "bg-white text-gray-800 rounded-bl-md shadow-sm"
                }`}
              >
                <p className="mb-1">{message.message}</p>
                <p
                  className={`text-xs ${
                    message.isAdmin ? "text-gray-100" : "text-gray-500"
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Section */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center justify-center">
              ➤
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Chat List View - WhatsApp Style
  return (
    <div className="h-full">
      <div className="p-4 border-b bg-white">
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-gray-500 mt-1">Customer conversations</p>
      </div>

      <div className="overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
            onClick={() => handleChatClick(chat)}
          >
            {/* Avatar */}
            <div className="relative mr-3 flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {chat.avatar}
              </div>
              {chat.online && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>

            {/* Chat Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-900 truncate pr-2">
                  {chat.name}
                </h3>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className="text-xs text-gray-500">
                    {chat.lastMessageTime}
                  </span>
                  {chat.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {chat.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>

      {chats.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              💬
            </div>
            <p className="text-gray-500">No conversations yet</p>
            <p className="text-sm text-gray-400">
              Customer messages will appear here
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
