import React, { useEffect, useState } from "react";
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
};

const AddProduct = () => {
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      images.forEach((file) => fd.append("images", file));

      await api.post("/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Product added successfully");
      setForm(emptyForm);
      setImages([]);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Add Product</h1>

      {message && <p className="text-green-700 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-lg p-6 space-y-4 max-w-xl">
        <input name="name" placeholder="Product Name" required value={form.name} onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2" />
        <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2" />
        <textarea name="description" placeholder="Description" required value={form.description} onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2" rows={3} />

        <select name="category" value={form.category} onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2">
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="unisex">Unisex</option>
        </select>

        <div className="grid grid-cols-2 gap-3">
          <input name="price" type="number" placeholder="Price" required value={form.price} onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2" />
          <input name="discountPrice" type="number" placeholder="Discount Price (optional)" value={form.discountPrice} onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2" />
          <input name="sizeMl" type="number" placeholder="Size (ml)" value={form.sizeMl} onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2" />
          <input name="stock" type="number" placeholder="Stock Quantity" required value={form.stock} onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2" />
        </div>

        <input
          type="file" accept="image/*" multiple
          onChange={(e) => setImages(Array.from(e.target.files))}
          className="w-full text-sm"
        />

        <button
          type="submit" disabled={saving}
          className="bg-brand-600 text-white px-6 py-2 rounded hover:bg-brand-500 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Add Product"}
        </button>
      </form>

      <h2 className="text-lg font-semibold text-gray-900 mt-10 mb-4">All Products</h2>
      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Active</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t border-gray-100">
                <td className="p-3">{p.name}</td>
                <td className="p-3 capitalize">{p.category}</td>
                <td className="p-3">Rs. {p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.isActive ? "Yes" : "No"}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddProduct;
