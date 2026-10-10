import { mediaSlots } from "../../data/mediaSlots.js";
import "../../styles/admin-media.css";
import React, { useEffect, useState, useRef } from "react";
import {
  Upload,
  X,
  Pencil,
  Trash2,
  Star,
  Package,
  ImageIcon,
  Plus,
  RotateCcw,
} from "lucide-react";
import api from "../../api/axios.js";

const emptyForm = {
  name: "",
  brand: "",
  description: "",
  category: "male",
  price: "",
  discountPrice: "",
  sizeMl: "",
  stock: "",
  isFeatured: false,
  isActive: true,
};

const AddProduct = () => {
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [media, setMedia] = useState({});
  const [preparing, setPreparing] = useState(false);
  const [newImagesFirst, setNewImagesFirst] = useState(true);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // images already on product when editing
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);
  const formTopRef = useRef(null);

  const loadProducts = async () => {
    try {
      const { data } = await api.get("/products/admin");
      setProducts(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    }
  };

  useEffect(() => {
    loadProducts();
    api.get("/content").then(({data})=>setMedia(data.data.media || {})).catch(()=>{});
  }, []);

  // Generate/clean up object URLs for newly selected image previews
  useEffect(() => {
    const previews = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileSelect = (e) => {
    const chosen = Array.from(e.target.files);
    if (chosen.some(file => !file.type.startsWith("image/") || file.size > 5*1024*1024) || images.length + chosen.length > 5) { setError("Select up to 5 images, each under 5 MB."); return; }
    setImages((prev) => [...prev, ...chosen]);
    e.target.value = "";
  };

  const removeNewImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImages([]);
    setExistingImages([]);
    setNewImagesFirst(true);
    setEditingId(null);
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      brand: product.brand || "",
      description: product.description || "",
      category: product.category || "male",
      price: product.price ?? "",
      discountPrice: product.discountPrice ?? "",
      sizeMl: product.sizeMl ?? "",
      stock: product.stock ?? "",
      isFeatured: !!product.isFeatured,
      isActive: product.isActive !== false,
    });
    setExistingImages(product.images || []);
    setImages([]);
    setMessage("");
    setError("");
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!images.length && !existingImages.length) { setError("Keep at least one product image."); return; }
    setSaving(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      images.forEach((file) => fd.append("images", file));
      fd.append("newImagesFirst", String(newImagesFirst));
      if (editingId) fd.append("retainedImages", JSON.stringify(existingImages.map(image=>image.publicId)));

      if (editingId) {
        await api.put(`/products/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Product updated successfully");
      } else {
        await api.post("/products", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Product added successfully");
      }

      resetForm();
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      if (editingId === id) resetForm();
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  async function choosePost(slot) {
    setPreparing(true); setError("");
    try {
      const response = await fetch(media[slot.key] || slot.url);
      if (!response.ok) throw new Error("Image could not load");
      const blob = await response.blob();
      if (!blob.type.startsWith("image/") || blob.size > 5*1024*1024) throw new Error("Image must be under 5 MB");
      setImages([new File([blob], slot.key+".png", {type:blob.type})]);
      setNewImagesFirst(true);
    } catch (err) { setError(err.message); }
    finally { setPreparing(false); }
  }
  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all duration-200";

  return (
    <div>
      <div ref={formTopRef} className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          {editingId ? "Edit Product" : "Add Product"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {editingId
            ? "Update the details below and save your changes."
            : "Fill in the details to add a new fragrance to your catalog."}
        </p>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm rounded-lg px-4 py-3 mb-5">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
          {error}
        </div>
      )}

      {/* Form + side info panel, side by side on wide screens */}
      <div className="grid lg:grid-cols-3 gap-5 items-start">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-6 space-y-5"
        >
          {/* Basic Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Product Name"
              required
              value={form.name}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="brand"
              placeholder="Brand"
              value={form.brand}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <textarea
            name="description"
            placeholder="Description"
            required
            value={form.description}
            onChange={handleChange}
            rows={3}
            className={inputClass}
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unisex">Unisex</option>
          </select>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-2 gap-3">
            <input
              name="price"
              type="number"
              placeholder="Price"
              required
              value={form.price}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="discountPrice"
              type="number"
              placeholder="Discount Price (optional)"
              value={form.discountPrice}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="sizeMl"
              type="number"
              placeholder="Size (ml)"
              value={form.sizeMl}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="stock"
              type="number"
              placeholder="Stock Quantity"
              required
              value={form.stock}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Best Seller Toggle */}
          <label className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center gap-2.5">
              <Star
                className={`w-4 h-4 ${
                  form.isFeatured ? "text-amber-500 fill-amber-500" : "text-gray-300"
                } transition-colors duration-200`}
              />
              <div>
                <p className="text-sm font-medium text-gray-900">Mark as Best Seller</p>
                <p className="text-xs text-gray-400">Featured in the Best Sellers section</p>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-10 h-5.5 bg-gray-200 peer-checked:bg-gray-900 rounded-full transition-colors duration-300" />
              <div className="absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-300 peer-checked:translate-x-4.5" />
            </div>
          </label>

          <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />Visible on storefront</label>
          <section className="admin-media-library"><h2>Campaign image library</h2><p>Choose a ready-made post as the new cover, then save the product. Current gallery images are kept.</p><div className="admin-post-grid">{mediaSlots.filter(slot=>slot.key.endsWith("Post")).map(slot=><button type="button" key={slot.key} disabled={preparing || saving} onClick={()=>choosePost(slot)}><img src={media[slot.key] || slot.url} alt={slot.label}/><span>Use {slot.label.replace(" — campaign post","")}</span></button>)}</div></section>
          {/* Image Upload */}
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-200 rounded-lg py-6 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              <Upload className="w-5 h-5" />
              <span className="text-sm">Upload replacement or gallery images</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

<label className="admin-cover-option"><input type="checkbox" checked={newImagesFirst} onChange={event=>setNewImagesFirst(event.target.checked)}/> Use first new image as storefront cover</label>
            {/* Existing images (when editing) */}
            {existingImages.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-2">Current images</p>
                <div className="flex flex-wrap gap-2">
                  {existingImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="admin-gallery-item"
                    >
                      <img src={img.url} alt={"Gallery image "+(idx+1)} /><span>{idx===0 ? "Current cover" : "Gallery"}</span><button type="button" onClick={()=>{ setExistingImages(current=>[current[idx],...current.filter((_,i)=>i!==idx)]); setNewImagesFirst(false); }}>Make cover</button><button type="button" onClick={()=>setExistingImages(current=>current.filter((_,i)=>i!==idx))}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New image previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-2">
                  {existingImages.length > 0 ? "Selected uploads — saved with product" : "Selected images"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative w-16 h-16 group">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center opacity-100 transition-opacity duration-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || preparing}
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors duration-200"
            >
              {saving ? (
                "Saving..."
              ) : editingId ? (
                <>
                  <Pencil className="w-3.5 h-3.5" /> Update Product
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" /> Add Product
                </>
              )}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Cancel edit
              </button>
            )}
          </div>
        </form>

        {/* Side info panel — fills otherwise empty space on wide screens */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-900">Catalog Summary</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Products</span>
                <span className="font-medium text-gray-900">{products.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Best Sellers</span>
                <span className="font-medium text-gray-900">
                  {products.filter((p) => p.isFeatured).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Out of Stock</span>
                <span className="font-medium text-gray-900">
                  {products.filter((p) => p.stock === 0).length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#FBF9F5] border border-gray-100 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-900">Image Tips</h3>
            </div>
            <ul className="text-xs text-gray-500 space-y-1.5 leading-relaxed">
              <li>• Use square (1:1) images for a consistent grid</li>
              <li>• Upload at least 2–3 angles per product</li>
              <li>• Keep file size under 2MB for faster loading</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">All Products</h2>
          <span className="text-sm text-gray-400">{products.length} total</span>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Best Seller</th>
                  <th className="p-4">Active</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-gray-400">
                      No products yet — add your first one above.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr
                      key={p._id}
                      className={`border-t border-gray-100 hover:bg-gray-50/60 transition-colors duration-150 ${
                        editingId === p._id ? "bg-[#FBF9F5]" : ""
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {p.images?.[0]?.url ? (
                              <img
                                src={p.images[0].url}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-4 h-4 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-gray-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="p-4 capitalize text-gray-600">{p.category}</td>
                      <td className="p-4 text-gray-900">
                        Rs. {p.price?.toLocaleString()}
                        {p.discountPrice > 0 && (
                          <span className="text-xs text-gray-400 line-through ml-1.5">
                            Rs. {p.discountPrice?.toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            p.stock === 0
                              ? "bg-red-50 text-red-600"
                              : p.stock < 10
                              ? "bg-amber-50 text-amber-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        {p.isFeatured ? (
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            p.isActive
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {p.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
