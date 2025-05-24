import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/Textarea";
import { Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { Post } from "../../Api";

export default function AddProductPage({ editingProduct }) {
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState(null);
  const [brandError, setBrandError] = useState(null);
  const [categoryError, setCategoryError] = useState(null);
  const [saleDiscountError, setSaleDiscountError] = useState(null);
  const [priceError, setPriceError] = useState(null);
  const [stockError, setStockError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);
  const [imagesError, setImagesError] = useState(null);
  const [product, setProduct] = useState({
    name: "",
    brandName: "",
    category: "",
    discountPerc: 0,
    price: 0,
    stock: 0,
    description: "",
    status: "Active",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

useEffect(() => {
  if (editingProduct) {
    setProduct({
      ...editingProduct,
      images: [], // ✅ no File objects yet
    });
    setImagePreviews([editingProduct.imageURL]); // ✅ show preview
  } else {
    resetForm();
  }
}, [editingProduct]);


  const resetForm = () => {
    setProduct({
      name: "",
      brandName: "",
      category: "",
      discountPerc: 0,
      price: 0,
      stock: 0,
      description: "",
      status: "Active",
      images: [],
    });
    setImagePreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setNameError(null);
    setBrandError(null);
    setCategoryError(null);
    setSaleDiscountError(null);
    setPriceError(null);
    setStockError(null);
    setDescriptionError(null);
    setImagesError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      ["price", "stock", "discountPerc"].includes(name) && value !== ""
        ? parseFloat(value)
        : value;
    setProduct((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
    setProduct((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: updatedImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNameError(null);
    setBrandError(null);
    setCategoryError(null);
    setSaleDiscountError(null);
    setPriceError(null);
    setStockError(null);
    setDescriptionError(null);
    setImagesError(null);
    const formData = new FormData();
    formData.append("Name", product.name);
    formData.append("SKU", "123");
    formData.append("Description", product.description);
    formData.append("Cost", "123");
    formData.append("Price", product.price.toString());
    formData.append("StockInHand", product.stock.toString());
    formData.append("DiscountPerc", product.discountPerc.toString());
    formData.append("Category", product.category);
    formData.append("Brand", product.brandName);

    product.images.forEach((file) => {
      if (file instanceof File) {
        formData.append("Images", file);
      }
    });

    const response = await Post({
      url: "/product",
      data: formData,
      setErrors: (errors) => {
        setNameError(errors?.Name || null);
        setBrandError(errors?.Brand || null);
        setCategoryError(errors?.Category || null);
        setSaleDiscountError(errors?.DiscountPerc || null);
        setPriceError(errors?.Price || null);
        setStockError(errors?.StockInHand || null);
        setDescriptionError(errors?.Description || null);
        setImagesError(errors?.images || null);
      },
      showError: true,
    });

    if (response?.success) {
      toast.success("Product uploaded successfully");
      resetForm();
    } else {
      toast.error(`upload failed ${response?.error}`);
      console.error("Upload failed:", response?.error);
    }

    setLoading(false);
  };
  console.log("Product", product);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {editingProduct ? "Edit Product" : "Add New Product"}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>
            {editingProduct ? "Update Product" : "Product Information"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={product.name}
                  onChange={handleChange}
                  required
                />
                {nameError && (
                  <p className="text-red-600 text-sm">{nameError}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brandName"
                  type="text"
                  value={product.brandName}
                  onChange={handleChange}
                  required
                />
                {brandError && (
                  <p className="text-red-600 text-sm">{brandError}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="saleDiscount">Sale Discount</Label>
                <Input
                  id="saleDiscount"
                  name="discountPerc"
                  type="number"
                  value={product.discountPerc}
                  onChange={handleChange}
                  required
                />
                {saleDiscountError && (
                  <p className="text-red-600 text-sm">{saleDiscountError}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={product.price}
                  onChange={handleChange}
                  required
                />
                {priceError && (
                  <p className="text-red-600 text-sm">{priceError}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={product.stock}
                  onChange={handleChange}
                  required
                />
                {stockError && (
                  <p className="text-red-600 text-sm">{stockError}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category">category</Label>
                <Input
                  id="category"
                  name="category"
                  type="text"
                  value={product.category}
                  onChange={handleChange}
                  required
                />
                {categoryError && (
                  <p className="text-red-600 text-sm">{categoryError}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleChange}
                rows={3}
                required
              />
              {descriptionError && (
                <p className="text-red-600 text-sm">{descriptionError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Product Images</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((src, index) => (
                  <div
                    key={index}
                    className="relative border rounded-md overflow-hidden"
                  >
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
              {imagesError && (
                <p className="text-red-600 text-sm">{imagesError}</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Uploading..."
                  : editingProduct
                  ? "Update Product"
                  : "Add Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
