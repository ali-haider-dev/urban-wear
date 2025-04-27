import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"

export default function MessagesPage() {
  const messages = [
    {
      id: 1,
      sender: "John Smith",
      email: "john.smith@example.com",
      message:
        "I'm interested in ordering 50 units of the Premium Headphones for my company. Can you provide a bulk discount?",
      date: "Apr 23, 2023",
      read: true,
    },
    {
      id: 2,
      sender: "Sarah Johnson",
      email: "sarah.j@example.com",
      message: "When will the Mechanical Keyboard be back in stock? I've been waiting to purchase one for weeks.",
      date: "Apr 22, 2023",
      read: false,
    },
    {
      id: 3,
      sender: "Michael Brown",
      email: "mbrown@example.com",
      message:
        "I received my Wireless Charger yesterday and it's not working properly. How can I request a replacement?",
      date: "Apr 21, 2023",
      read: false,
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id} className={message.read ? "opacity-70" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{message.sender}</CardTitle>
                  <p className="text-sm text-gray-500">{message.email}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">{message.date}</span>
                  {!message.read && <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{message.message}</p>
              <div className="flex justify-end mt-4">
                <button className="text-sm text-blue-600 hover:text-blue-800 mr-4">
                  Mark as {message.read ? "unread" : "read"}
                </button>
                <button className="text-sm text-blue-600 hover:text-blue-800">Reply</button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
