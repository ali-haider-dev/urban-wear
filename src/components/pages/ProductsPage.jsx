
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { Edit, Eye, EyeOff } from "lucide-react";

export default function ProductsPage({ products, onEdit, onToggleStatus }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className={product.status === "hidden" ? "opacity-60" : ""}
          >
            <CardContent className="p-4">
              <div className="relative">
                <img
                  src={product.imageURL || "/fallback.jpg"} // fallback image if missing
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white"
                    onClick={() => onToggleStatus(product.id)}
                  >
                    {product.status === "active" ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white"
                    onClick={() => onEdit(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-500 text-sm mb-2">
                {product.description || "No description available"}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">
                  ${product.price?.toFixed(2) || "0.00"}
                </span>
                <span className="text-sm text-gray-500">
                  Stock: {product.stockInHand || "N/A"}
                </span>
              </div>
              <div className="mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    product.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {product.status === "active" ? "Active" : "Hidden"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
