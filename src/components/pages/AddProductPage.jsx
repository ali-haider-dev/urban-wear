"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "../ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { Textarea } from "../ui/Textarea"
import { Upload, X } from "lucide-react"

export default function AddProductPage({ onAddProduct, editingProduct }) {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    saleDiscount: 0,
    price: 0,
    stock: 0,
    description: "",
    status: "Active",
    images: [],
  })

  const [imagePreviews, setImagePreviews] = useState([])
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (editingProduct) {
      setProduct(editingProduct)
      setImagePreviews(editingProduct.images || [])
    } else {
      resetForm()
    }
  }, [editingProduct])

  const resetForm = () => {
    setProduct({
      name: "",
      brand: "",
      saleDiscount: 0,
      price: 0,
      stock: 0,
      description: "",
      status: "Active",
      images: [],
    })
    setImagePreviews([])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const parsedValue =
      name === "price" || name === "stock" || name === "saleDiscount"
        ? parseFloat(value)
        : value
    setProduct({ ...product, [name]: parsedValue })
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const newPreviews = []

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result)
        if (newPreviews.length === files.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews])
          setProduct((prev) => ({
            ...prev,
            images: [...prev.images, ...newPreviews],
          }))
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveImage = (index) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index)
    setImagePreviews(updatedPreviews)
    setProduct({ ...product, images: updatedPreviews })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddProduct(product)
    if (!editingProduct) resetForm()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {editingProduct ? "Edit Product" : "Add New Product"}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>{editingProduct ? "Update Product" : "Product Information"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" value={product.name} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" name="brand" value={product.brand} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="saleDiscount">Sale Discount (%)</Label>
                <Input
                  id="saleDiscount"
                  name="saleDiscount"
                  type="number"
                  value={product.saleDiscount}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={product.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={product.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={product.status}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 w-full"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Product Images</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative border rounded-md overflow-hidden">
                    <img
                      src={src}
                      alt={`Product preview ${index + 1}`}
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <label
                htmlFor="image-upload"
                className="inline-flex items-center gap-2 cursor-pointer mt-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm"
              >
                <Upload size={16} />
                Upload Images
                <input
                  id="image-upload"
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit">
                {editingProduct ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
