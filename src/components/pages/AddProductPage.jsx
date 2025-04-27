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
    description: "",
    price: 0,
    image: "https://via.placeholder.com/200",
    stock: 0,
    status: "active",
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [isImageChanged, setIsImageChanged] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (editingProduct) {
      setProduct(editingProduct)
      setImagePreview(editingProduct.image)
      setIsImageChanged(false)
    } else {
      setProduct({
        name: "",
        description: "",
        price: 0,
        image: "https://via.placeholder.com/200",
        stock: 0,
        status: "active",
      })
      setImagePreview(null)
      setIsImageChanged(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }, [editingProduct])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProduct({ ...product, [name]: name === "price" || name === "stock" ? Number.parseFloat(value) : value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setProduct({ ...product, image: reader.result })
        setIsImageChanged(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setProduct({ ...product, image: "https://via.placeholder.com/200" })
    setIsImageChanged(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddProduct(product)
    if (!editingProduct) {
      setProduct({
        name: "",
        description: "",
        price: 0,
        image: "https://via.placeholder.com/200",
        stock: 0,
        status: "active",
      })
      setImagePreview(null)
      setIsImageChanged(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{editingProduct ? "Edit Product" : "Add New Product"}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{editingProduct ? "Update Product Details" : "Product Information"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" value={product.name} onChange={handleChange} required />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image">Product Image</Label>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="border rounded-md p-4 bg-gray-50">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Product preview"
                            className="w-full max-h-[200px] object-contain rounded-md"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                            title="Remove image"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                          <Upload size={40} className="mb-2" />
                          <p className="text-sm">No image selected</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm flex items-center gap-2"
                      >
                        <Upload size={16} />
                        {imagePreview ? "Change Image" : "Upload Image"}
                        <input
                          id="image-upload"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          ref={fileInputRef}
                          className="hidden"
                        />
                      </label>
                      {editingProduct && isImageChanged && (
                        <span className="text-xs text-amber-600">Image has been changed</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input id="stock" name="stock" type="number" value={product.stock} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={product.status === "active"}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>Active (Live)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="status"
                    value="hidden"
                    checked={product.status === "hidden"}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>Hidden</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">{editingProduct ? "Update Product" : "Add Product"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
