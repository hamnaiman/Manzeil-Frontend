import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Play, Truck, PackageCheck, Banknote, Search } from "lucide-react";
import api from "../api/axios.js";
import Hero from "../components/Hero.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Footer from "../components/Footer.jsx";


function Reveal({ children, className = "" }) {

  return <motion.div className={className} initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.65 }}>{children}</motion.div>;
}
export default function Home() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const location = useLocation();
  const input = useRef(null);
  const [products, setProducts] = useState([]);
  const [scentFilms, setScentFilms] = useState([]);
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
      params: { category, page, limit: 12, search, sort: sort === "low" ? "priceAsc" : sort === "high" ? "priceDesc" : "featured" },
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
    Promise.all([api.get("/stories", { signal: controller.signal }), api.get("/content", { signal: controller.signal })])
      .then(([stories, settings]) => { setScentFilms(stories.data.data); setContent(settings.data.data); })
      .catch(() => { if (!controller.signal.aborted) setContentError(true); });
    return () => controller.abort();
  }, [contentVersion]);
  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "instant" });
    if (params.has("search")) input.current?.focus({ preventScroll: true });
  }, [location, params]);
  const filtered = products;
  return <main id="main-content" className="scent-home">
    <h1 className="sr-only">Manzeil — signature fragrances</h1>{!category && !params.has("search") && <Hero />}
    <section id="collection" className="scent-section collection-section">
      <Reveal className="section-heading"><span className="section-pill">01 / FIND YOUR SIGNATURE</span><h2>Meet your next <em>signature.</em></h2><p>Find the one that feels effortlessly yours.</p></Reveal>
      <div className="collection-toolbar"><div className="collection-filters" aria-label="Filter by category">{[["", "All scents"], ["female", "For her"], ["male", "For him"], ["unisex", "Unisex"]].map(([value, label]) => <button key={value} aria-pressed={category === value} className={category === value ? "active" : ""} onClick={() => { const next = new URLSearchParams(params); value ? next.set("category", value) : next.delete("category"); setPage(1); setParams(next, { preventScrollReset: true }); }}>{label}</button>)}</div><label className="collection-search"><Search size={16} /><input ref={input} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find your fragrance" aria-label="Search collection" type="search" /></label><label className="collection-sort"><span>Sort by</span><select aria-label="Sort fragrances" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div>
      {loading ? <div className="product-grid" aria-label="Loading collection" aria-busy="true">{[0, 1, 2, 3].map((i) => <div key={i} className="scent-skeleton" />)}</div> : error ? <div className="collection-empty" role="alert"><p>{error}</p><button className="scent-button" onClick={() => setRetry(retry + 1)}>Try again</button></div> : filtered.length ? <div className="product-grid">{filtered.map((product) => <ProductCard key={product._id} product={product} />)}</div> : <div className="collection-empty"><h3>{query ? "No matching fragrances" : "Something beautiful is on its way."}</h3><p>{query ? "Try a different name or explore another category." : "Check back soon to discover the collection."}</p></div>}
      {!loading && !error && <div className="catalog-pagination"><span>{pagination.total} fragrances</span><div><button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button><span>Page {page} of {Math.max(1, pagination.pages)}</span><button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next</button></div></div>}
    </section>

    {contentError && <p className="content-load-error" role="status">Stories are temporarily unavailable. <button onClick={() => setContentVersion(v => v + 1)}>Retry</button></p>}
    {scentFilms.length > 0 && <section id="scent-films" className="scent-section films-section">
      <Reveal className="section-heading heading-split"><div><span className="section-pill">02 / THE SCENT JOURNAL</span><h2>A feeling.<br /><em>A fragrance.</em></h2></div><div className="heading-aside"><p>A closer look at the world of Manzeil.<br />Discover the mood behind every note.</p><a className="text-link" href="#collection">Discover the collection <ArrowUpRight size={17} /></a></div></Reveal>
      <div className="film-grid">{scentFilms.map((film, i) => <Reveal key={film._id}>
        <article className={`film-card ${film.tone}`}>
          {film.video?.url ? <video autoPlay muted loop playsInline disablePictureInPicture preload="metadata" poster={film.poster?.url || undefined} aria-label={film.title}><source src={film.video?.url} /></video> : <div className="film-placeholder" aria-label={`${film.title}: video coming soon`}>
            {film.poster?.url && <img className="film-poster" src={film.poster.url} alt="" loading="lazy" />}
            <span className="film-index">MANZEIL / MOTION STUDY 0{i + 1}</span>
            <div className="film-art" aria-hidden="true"><span className="film-line" /><span className="film-number">0{i + 1}</span><em>{film.title}</em></div>
            <div className="film-status"><span className="film-play"><Play size={16} strokeWidth={1} /></span><span>THE FILM<br /><small>Coming soon</small></span></div>
          </div>}
          <div className="film-caption"><h3>{film.title}</h3><p>{film.note}</p></div>
        </article>
      </Reveal>)}</div>
    </section>}
    <section className="scent-section signature-section">
      <Reveal className="section-heading"><span className="section-pill">03 / THE CURATED EDITS</span><h2>Different moods.<br /><em>One unmistakable you.</em></h2></Reveal>
      <div className="editorial-grid">
        <Reveal><Link to="/?category=female#collection" className="editorial-card editorial-rose"><img src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85" loading="lazy" alt="A delicate perfume composition" /><div><span>SOFT, YET UNFORGETTABLE</span><h3>The feminine edit</h3><p>Floral whispers. Beautiful impressions.</p></div><ArrowUpRight className="editorial-arrow" /></Link></Reveal>
        <Reveal><Link to="/?category=male#collection" className="editorial-card editorial-dark"><img src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85" loading="lazy" alt="Perfume with warm, rich tones" /><div><span>CONFIDENCE, BOTTLED</span><h3>The masculine edit</h3><p>Deep notes. An unmistakable presence.</p></div><ArrowUpRight className="editorial-arrow" /></Link></Reveal>
      </div>
    </section>
    <section id="our-story" className="brand-story"><Reveal><span className="eyebrow">THE MANZEIL PHILOSOPHY</span><h2>{content?.storyTitle || "Some memories begin with a scent."}</h2><p>{content?.storyText || "Discover fragrances that become part of your story."}</p><a href="#collection" className="text-link">Find your own story <ArrowUpRight size={17} /></a></Reveal><div className="story-seal" aria-hidden="true"><span>M</span><small>MANZEIL · JO TUM CHAHO</small></div></section>
    <div className="scent-services">{[[Truck, "Across Pakistan", "Your favourite scents, delivered"], [Banknote, "Cash on delivery", "A little luxury, made easy"], [PackageCheck, "Carefully packed", "From our collection to your doorstep"]].map(([Icon, title, text]) => <div key={title}><Icon size={27} strokeWidth={1.2} /><div><h3>{title}</h3><p>{text}</p></div></div>)}</div>
    <Footer />
  </main>;
}
