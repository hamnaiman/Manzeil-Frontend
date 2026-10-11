import React, {useEffect,useRef,useState} from "react";
import {Link, Navigate, useParams, useSearchParams} from "react-router-dom";
import {motion, useReducedMotion} from "framer-motion";
import {ArrowDown, Search, SlidersHorizontal} from "lucide-react";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import Footer from "../components/Footer.jsx";
import Reveal from "../components/Reveal.jsx";
import {collections,collectionPath} from "../data/collections.js";
import "../styles/collections.css";

export default function Collection() {
 const {slug="all"}=useParams();
 if(!collections[slug]) return <Navigate to="/products" replace/>;
 return <CollectionView key={slug} slug={slug}/>;
}
function CollectionView({slug}) {
 const defaults=collections[slug], reduced=useReducedMotion();
 const [params,setParams]=useSearchParams();
 const [content,setContent]=useState(null),[contentError,setContentError]=useState(false);
 const [result,setResult]=useState({data:[],pagination:{total:0,pages:1}}),[loading,setLoading]=useState(true),[error,setError]=useState(""),[retry,setRetry]=useState(0);
 const [filterError,setFilterError]=useState("");
 const listing=useRef(null),searchInput=useRef(null);
 const rawPage=Number(params.get("page")||1);
 const page=Number.isInteger(rawPage)&&rawPage>0?rawPage:1;
 const query=params.get("q")||"",sort=params.get("sort")||"featured";
 const minimum=params.get("minPrice")||"",maximum=params.get("maxPrice")||"",stock=params.get("inStock")==="true";
 const queryKey=params.toString();
 const hero=content?.collectionHeroes?.[slug]||{};
 const heroImage=content?.media?.[slug+"Hero"]||defaults.image;
 useEffect(()=>{
  const controller=new AbortController();
  api.get("/content",{signal:controller.signal}).then(({data})=>{setContent(data.data);setContentError(false);}).catch(()=>{if(!controller.signal.aborted)setContentError(true);});
  return ()=>controller.abort();
 },[retry]);
 useEffect(()=>{
  const controller=new AbortController();
  setLoading(true);setError("");
  api.get("/products",{signal:controller.signal,params:{category:defaults.category,page,limit:12,search:query,sort,minPrice:minimum,maxPrice:maximum,inStock:stock?"true":undefined}})
   .then(({data})=>{
    if(!Array.isArray(data.data))throw new Error("Invalid catalog");
    setResult(data);
    const pages=Math.max(1,data.pagination?.pages||1);
    if(page>pages){const next=new URLSearchParams(queryKey);next.set("page",String(pages));setParams(next,{replace:true,preventScrollReset:true});}
   }).catch(err=>{if(!controller.signal.aborted)setError(err.response?.data?.message||"The collection could not load. Please try again.");})
   .finally(()=>{if(!controller.signal.aborted)setLoading(false);});
  return ()=>controller.abort();
 },[slug,queryKey,retry]);
 useEffect(()=>{if(params.has("search"))searchInput.current?.focus({preventScroll:true});},[]);
 function apply(event){
  event.preventDefault();
  const form=new FormData(event.currentTarget),min=String(form.get("minPrice")||""),max=String(form.get("maxPrice")||"");
  if((min&&(!Number.isFinite(Number(min))||Number(min)<0))||(max&&(!Number.isFinite(Number(max))||Number(max)<0))||(min&&max&&Number(min)>Number(max))){setFilterError("Enter a valid price range. Minimum must not exceed maximum.");return;}
  setFilterError("");
  const next=new URLSearchParams();
  for(const key of ["q","minPrice","maxPrice","sort"]){const value=String(form.get(key)||"").trim();if(value)next.set(key,value);}
  if(form.get("inStock"))next.set("inStock","true");
  setParams(next,{preventScrollReset:true});
 }
 function goPage(value){const next=new URLSearchParams(params);next.set("page",String(value));setParams(next,{preventScrollReset:true});listing.current?.scrollIntoView({behavior:reduced?"instant":"smooth"});}
 return <main id="main-content" className="scent-home collection-page">
  <section className={"category-hero category-"+defaults.theme+" collection-"+slug}>
   {slug==="all" ? <div className="shop-bottle-pair">
    <div className="shop-botanical shop-botanical-citrus" aria-hidden="true"><img src={content?.media?.obsessionDecor || "/images/hero/obsession-fruits.png"} alt="" /></div>
    <div className="shop-botanical shop-botanical-floral" aria-hidden="true"><img src={content?.media?.sereneDecor || "/images/hero/serene-flowers.png"} alt="" /></div>
    <motion.img className="shop-side-bottle shop-bottle-left" src={content?.media?.obsessionBottle || "/images/hero/obsession-cutout.png"} alt="Manzeil Obsession" initial={reduced?false:{opacity:0,x:-25}} animate={{opacity:1,x:0}} transition={{duration:1}} />
    <motion.img className="shop-side-bottle shop-bottle-right" src={content?.media?.sereneBottle || "/images/hero/serene-matched.png"} alt="Manzeil Serene" initial={reduced?false:{opacity:0,x:25}} animate={{opacity:1,x:0}} transition={{duration:1}} />
   </div> : <motion.img className="category-hero-photo" src={heroImage} alt={slug==="for-her"?"Woman applying perfume":slug==="for-him"?"Man applying perfume":slug==="unisex"?"Husband and wife sharing Manzeil Obsession perfume":"Fragrance collection"} initial={reduced?false:{opacity:0}} animate={{opacity:1}} transition={{duration:1.8,ease:"easeOut"}} fetchPriority="high"/>}
   <div className="category-hero-shade"/>
   <motion.div className="category-hero-copy" initial={reduced?false:{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.1}}>
    <nav className="category-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span>{defaults.label}</span></nav>
    <span className="category-eyebrow">MANZEIL / {defaults.label}</span>
    <h1>{hero.title||defaults.title}</h1><p>{hero.intro||defaults.intro}</p>
    <a href="#collection-products" className="category-hero-cta">Explore {defaults.label.toLowerCase()} <ArrowDown size={16}/></a>
   </motion.div>
   <span className="category-hero-note">JO TUM CHAHO</span>
  </section>
  <section ref={listing} id="collection-products" className="scent-section">
   <div className="category-list-heading"><div><span className="section-pill">THE COLLECTION</span><h2>{defaults.label}</h2></div><span role="status">{loading?"Discovering your fragrances…":result.pagination?.total+" fragrances"}</span></div>
   <nav className="category-tabs" aria-label="Fragrance collections">{Object.entries(collections).map(([key,item])=><Link key={key} aria-current={slug===key?"page":undefined} to={collectionPath(key)}>{item.label}</Link>)}</nav>
   <form className="catalog-filters" key={queryKey} onSubmit={apply}>
    <label className="catalog-search"><span>Search fragrances</span><div><Search size={17}/><input ref={searchInput} name="q" type="search" defaultValue={query} placeholder="Name or signature…" maxLength={100}/></div></label>
    <label><span>Min price · Rs.</span><input name="minPrice" type="number" min="0" step="any" defaultValue={minimum} placeholder="0"/></label>
    <label><span>Max price · Rs.</span><input name="maxPrice" type="number" min="0" step="any" defaultValue={maximum} placeholder="Any"/></label>
    <label><span>Sort by</span><select name="sort" defaultValue={sort}><option value="featured">Featured</option><option value="newest">Newest</option><option value="priceAsc">Price: low to high</option><option value="priceDesc">Price: high to low</option></select></label>
    <label className="catalog-stock"><input name="inStock" type="checkbox" defaultChecked={stock}/><span>In stock only</span></label>
    <button type="submit" className="catalog-apply"><SlidersHorizontal size={15}/> Apply filters</button>
    {queryKey&&<button type="button" className="catalog-clear" onClick={()=>{setFilterError("");setParams({},{preventScrollReset:true});}}>Clear all</button>}
   </form>
   {filterError&&<p role="alert" className="cms-error">{filterError}</p>}
   {contentError&&<p className="catalog-notice">Showing the default collection artwork. <button onClick={()=>setRetry(value=>value+1)}>Retry custom content</button></p>}
   {loading?<div className="product-grid" aria-label="Loading products" aria-busy="true">{Array.from({length:8},(_,i)=><div key={i} className="scent-skeleton"/>)}</div>:error?<div className="collection-empty" role="alert"><p>{error}</p><button className="scent-button" onClick={()=>setRetry(value=>value+1)}>Try again</button></div>:result.data.length?<div className="product-grid">{result.data.map((product,i)=><Reveal key={product._id} delay={(i%4)*70}><ProductCard product={product} media={content?.media}/></Reveal>)}</div>:<div className="collection-empty"><h3>No fragrances found</h3><p>Try another search or a wider price range.</p><button className="scent-button" onClick={()=>setParams({},{preventScrollReset:true})}>Reset filters</button></div>}
   {!loading&&!error&&result.data.length>0&&<nav className="catalog-pagination" aria-label="Product pages"><span>Page {page} of {Math.max(1,result.pagination?.pages||1)}</span><div><button disabled={page<=1} onClick={()=>goPage(page-1)}>Previous</button><button disabled={page>=(result.pagination?.pages||1)} onClick={()=>goPage(page+1)}>Next</button></div></nav>}
  </section>
  <Footer/>
 </main>;
}
