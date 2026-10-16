import React,{useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight} from 'lucide-react';
import api from '../api/axios.js';
import ProductCard from './ProductCard.jsx';
export default function MoreProducts({product}){
 const [items,setItems]=useState([]),[status,setStatus]=useState('loading'),[retry,setRetry]=useState(0);
 useEffect(()=>{const controller=new AbortController();setStatus('loading');(async()=>{
  const {data}=await api.get('/products',{params:{category:product.category,limit:5,sort:'featured'},signal:controller.signal});
  let suggestions=(data.data||[]).filter(p=>p._id!==product._id);
  if(suggestions.length<4){const response=await api.get('/products',{params:{limit:8,sort:'featured'},signal:controller.signal});const ids=new Set([product._id,...suggestions.map(p=>p._id)]);for(const p of response.data.data||[])if(!ids.has(p._id)){suggestions.push(p);ids.add(p._id);}}
  if(!controller.signal.aborted){setItems(suggestions.slice(0,4));setStatus('ready');}
 })().catch(()=>{if(!controller.signal.aborted)setStatus('error');});return()=>controller.abort();},[product._id,product.category,retry]);
 if(status==='ready'&&!items.length)return null;
 return <section className="scent-home more-products" aria-labelledby="more-products-title"><div className="scent-section"><header className="more-products-heading"><div><span className="section-pill">MORE TO DISCOVER</span><h2 id="more-products-title">Another mood. <em>Another favourite.</em></h2><p>Explore more fragrances from the Manzeil collection.</p></div><Link to="/products">View all fragrances <ArrowUpRight size={15}/></Link></header>{status==='loading'?<p role="status" className="more-products-status">Discovering more fragrances…</p>:status==='error'?<p role="status" className="more-products-status">More fragrances could not load. <button onClick={()=>setRetry(n=>n+1)}>Try again</button></p>:<div className="product-grid">{items.map(p=><ProductCard key={p._id} product={p}/>)}</div>}</div></section>;
}
