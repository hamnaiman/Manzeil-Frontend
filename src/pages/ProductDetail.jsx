import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.data);
        setActiveImage(0);
      } catch (err) {
        setError(err.response?.data?.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!product) return null;

  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const images = product.images?.length ? product.images : [];

  return (
    <div className="product-detail max-w-6xl mx-auto px-4 sm:px-6 py-8 grid md:grid-cols-2 gap-6 lg:gap-12">
      {/* Image gallery */}
      <div>
        <div className="bg-gray-50 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
          {images[activeImage] && (
            <img
              src={images[activeImage].url}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={img.publicId || idx}
                onClick={() => setActiveImage(idx)}
                className={`shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                  idx === activeImage ? "border-black" : "border-transparent"
                }`}
              >
                <img src={img.url} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        <p className="text-xs uppercase tracking-widest text-gray-400">{product.category}</p>
        <h1 className="text-3xl font-semibold text-gray-900 mt-2">{product.name}</h1>
        {product.brand && <p className="text-gray-500 mt-1">{product.brand}</p>}
        {product.sizeMl && <p className="text-gray-400 text-sm mt-1">{product.sizeMl} ml</p>}

        <div className="mt-5 flex items-center gap-3">
          <span className="text-2xl font-semibold text-gray-900">Rs. {finalPrice}</span>
          {product.discountPrice > 0 && (
            <span className="text-gray-400 line-through">Rs. {product.price}</span>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-2">
            Description
          </h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 border border-gray-300 rounded px-3 py-2"
          />
          <button
            disabled={product.stock === 0}
            onClick={() => {
              addToCart(product, quantity);
              setAdded(true);
              setTimeout(() => setAdded(false), 1500);
            }}
            className="bg-black text-white px-8 py-2.5 rounded-full hover:bg-gray-800 disabled:opacity-40 transition-colors"
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
