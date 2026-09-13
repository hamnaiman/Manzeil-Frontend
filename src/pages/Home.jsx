import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import Hero from "../components/Hero.jsx";

const Home = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/products", { params: { category } });
        setProducts(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  return (
    <div>
      <Hero />

      <div id="shop" className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8 capitalize">
          {category ? `${category} Fragrances` : "All Fragrances"}
        </h1>

        {loading && <p className="text-gray-500">Loading products...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="text-gray-500">No products found. Add some from the admin panel.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
