import Perspectives from "../components/Perspectives.jsx";
import StoreImage from '../components/StoreImage.jsx';
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

import { ArrowUpRight, Truck, PackageCheck, Banknote, Search } from "lucide-react";
import api from "../api/axios.js";
import Reveal from "../components/Reveal.jsx";

import ScentVisualizer from '../components/ScentVisualizer.jsx';
import CustomerReviews from '../components/CustomerReviews.jsx';
import Hero from "../components/Hero.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Footer from "../components/Footer.jsx";
import BlogSection from '../components/BlogSection.jsx';
import BrandStory from "../components/BrandStory.jsx";

const SERVICES = [
  [Truck, "Across Pakistan", "Your favourite scents, delivered"],
  [Banknote, "Cash on delivery", "A little luxury, made easy"],
  [PackageCheck, "Carefully packed", "From our collection to your doorstep"],
];

export default function Home() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const location = useLocation();
  const input = useRef(null);
  const [products, setProducts] = useState([]);

  const [content, setContent] = useState(null);
  const [contentError, setContentError] = useState(false);
  const [contentVersion, setContentVersion] = useState(0);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(query.trim()); setPage(1); }, 300);
    return () => clearTimeout(timer);
  }, [query]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError("");
    api.get("/products", {
      params: { category, page, limit: 8, search, sort: sort === "low" ? "priceAsc" : sort === "high" ? "priceDesc" : "featured" },
      signal: controller.signal,
    }).then(({ data }) => {
      if (!Array.isArray(data.data)) throw new Error("Invalid product response");
      setProducts(data.data);
      setPagination(data.pagination || { total: data.data.length, pages: 1 });
    }).catch(() => {
      if (!controller.signal.aborted) setError("Our collection could not load. Please check your connection and try again.");
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [category, retry, page, search, sort]);
  useEffect(() => {
    const controller = new AbortController();
    setContentError(false);
    api.get("/content", { signal: controller.signal })
      .then(({data}) => { setContent(data.data); })
      .catch(() => { if (!controller.signal.aborted) setContentError(true); });
    return () => controller.abort();
  }, [contentVersion]);
  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "instant" });
    if (params.has("search")) input.current?.focus({ preventScroll: true });
  }, [location, params]);
  const filtered = products;
  return <main id="main-content" className="scent-home homepage">
    <h1 className="sr-only">Manzeil — signature fragrances</h1>{<Hero media={content?.media} />}
    <ScentVisualizer content={content} />
    <section id="collection" className="scent-section collection-section">
      <Reveal className="section-heading"><span className="section-pill">01 / FIND YOUR SIGNATURE</span><h2>Meet your next <em>signature.</em></h2><p>Find the one that feels effortlessly yours.</p></Reveal>
      <div className="collection-toolbar"><div className="collection-filters" aria-label="Filter by category">{[["", "All scents"], ["female", "For her"], ["male", "For him"], ["unisex", "Unisex"]].map(([value, label]) => <button key={value} aria-pressed={category === value} className={category === value ? "active" : ""} onClick={() => { const next = new URLSearchParams(params); value ? next.set("category", value) : next.delete("category"); setPage(1); setParams(next, { preventScrollReset: true }); }}>{label}</button>)}</div><label className="collection-search"><Search size={16} /><input ref={input} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find your fragrance" aria-label="Search collection" type="search" /></label><label className="collection-sort"><span>Sort by</span><select aria-label="Sort fragrances" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div>
      {loading ? <div className="product-grid" aria-label="Loading collection" aria-busy="true">{[0, 1, 2, 3].map((i) => <div key={i} className="scent-skeleton" />)}</div> : error ? <div className="collection-empty" role="alert"><p>{error}</p><button className="scent-button" onClick={() => setRetry(retry + 1)}>Try again</button></div> : filtered.length ? <div className="product-grid">{filtered.map((product, index) => <Reveal key={product._id} className="card-reveal" delay={(index % 4) * 110}><ProductCard product={product} media={content?.media} /></Reveal>)}</div> : <div className="collection-empty"><h3>{query ? "No matching fragrances" : "Something beautiful is on its way."}</h3><p>{query ? "Try a different name or explore another category." : "Check back soon to discover the collection."}</p></div>}
      {!loading && !error && <div className="catalog-pagination"><span>{pagination.total} fragrances</span><div><button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button><span>Page {page} of {Math.max(1, pagination.pages)}</span><button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next</button></div></div>}
      <div className="home-shop-all"><Link className="scent-button" to="/products">Explore all fragrances <ArrowUpRight size={16}/></Link></div>
    </section>

    {contentError && <p className="content-load-error" role="status">Website settings are temporarily unavailable. <button onClick={() => setContentVersion(v => v + 1)}>Retry</button></p>}
    <Perspectives content={content} />
    <BlogSection />
    <section className="scent-section signature-section">
      <Reveal className="section-heading"><span className="section-pill">03 / THE CURATED EDITS</span><h2>Different moods.<br /><em>One unmistakable you.</em></h2></Reveal>
      <div className="editorial-grid">
        <Reveal className="card-reveal" direction="left"><Link to="/collections/for-her" className="editorial-card editorial-rose"><StoreImage src={content?.media?.femaleEdit || "/images/posts/serene.png"} loading="lazy" alt="A delicate perfume composition" /><div><span>SOFT, YET UNFORGETTABLE</span><h3>The feminine edit</h3><p>Floral whispers. Beautiful impressions.</p></div><ArrowUpRight className="editorial-arrow" /></Link></Reveal>
        <Reveal className="card-reveal" direction="right" delay={150}><Link to="/collections/for-him" className="editorial-card editorial-dark"><StoreImage src={content?.media?.maleEdit || "/images/posts/business-elegance.png"} loading="lazy" alt="Perfume with warm, rich tones" /><div><span>CONFIDENCE, BOTTLED</span><h3>The masculine edit</h3><p>Deep notes. An unmistakable presence.</p></div><ArrowUpRight className="editorial-arrow" /></Link></Reveal>
      </div>
    </section>

    <CustomerReviews />
    <BrandStory content={content} />

    {/* Running services strip (left -> right) */}
    <div className="services-marquee" role="region" aria-label="Delivery and service highlights">
      <div className="services-fade">
        <div className="services-track">
          {[0, 1, 2, 3].map((copy) => (
            <div className="services-group" key={copy} aria-hidden={copy > 0 ? "true" : undefined}>
              {SERVICES.map(([Icon, title, text]) => (
                <div className="service-item" key={title}>
                  <Icon size={27} strokeWidth={1.2} />
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>

    <Footer />
  </main>;
}