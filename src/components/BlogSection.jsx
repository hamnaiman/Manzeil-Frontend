import React,{useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight} from 'lucide-react';
import api from '../api/axios.js';
import Reveal from './Reveal.jsx';
import {blogBanner} from '../data/blogBanners.js';
import '../styles/blog.css';
export const categories=['All articles','Scent Guide','Notes & Ingredients','Everyday Rituals','Behind Manzeil'];
export function useBlogPosts(){
 const [posts,setPosts]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[retry,setRetry]=useState(0);
 useEffect(()=>{const controller=new AbortController();setLoading(true);setError('');api.get('/blog',{signal:controller.signal}).then(({data})=>setPosts(data.data)).catch(()=>{if(!controller.signal.aborted)setError('Our articles could not load. Please try again.');}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});return()=>controller.abort();},[retry]);
 return {posts,loading,error,retry:()=>setRetry(x=>x+1)};
}
export function BannerScene({bottle}){
 const [media,setMedia]=useState(null);
 useEffect(()=>{const controller=new AbortController();api.get('/content',{signal:controller.signal}).then(({data})=>setMedia(data.data?.media)).catch(()=>{});return()=>controller.abort();},[]);
 return <div className="journal-scene" aria-label={bottle.name+' fragrance composition'} role="img"><span className="journal-scene-light"/><span className="journal-scene-floor"/><span className="journal-scene-shadow"/><img className="journal-scene-foreground" src={media?.[bottle.key+'Decor']||bottle.decor} alt=""/><img className="journal-scene-decor" src={media?.[bottle.key+'Decor']||bottle.decor} alt=""/><img className="journal-scene-bottle" src={media?.[bottle.key+'Bottle']||bottle.image} alt=""/><span className="journal-scene-caption">{bottle.name} · Eau de Parfum</span></div>;
}
export function BlogCard({post,featured=false}){
 const wide=featured ? blogBanner(post) : null;
 return <article className={'journal-card'+(featured?' journal-card-featured':'')+(wide?' journal-wide-banner':'')}><Link to={'/blog/'+post.slug} className="journal-card-link"><div className="journal-card-image"><img src={wide||post.cover?.url} alt={post.title} loading="lazy"/>{featured&&<span className="journal-feature-label">THE FEATURED READ</span>}<span className="journal-image-arrow" aria-hidden="true"><ArrowUpRight size={22}/></span></div><div className="journal-card-copy"><div className="journal-meta"><span>{post.category}</span><span>{post.readingTime} min read</span></div><h3>{post.title}</h3><p>{post.excerpt}</p><div className="journal-notes">{post.notes?.map(note=><span key={note}>{note}</span>)}</div><span className="journal-read">Read story <ArrowUpRight size={15}/></span></div></Link></article>;
}
export function BlogStatus({loading,error,retry}){
 if(loading)return <div className="journal-loading" role="status">Opening the pages…</div>;
 if(error)return <div className="journal-loading" role="alert"><p>{error}</p><button onClick={retry}>Try again</button></div>;
 return null;
}
export default function BlogSection(){
 const state=useBlogPosts();
 return <section id="blog" className="scent-section journal-home"><Reveal><div className="journal-section-heading"><div><span className="section-pill">02 / THE MANZEIL BLOG</span><h2>A little inspiration.<br/><em>A lasting impression.</em></h2></div><div><p>Fragrance guides, thoughtful rituals<br/>and the stories behind the scent.</p><Link className="journal-read" to="/blog">Explore the blog <ArrowUpRight size={18}/></Link></div></div></Reveal><BlogStatus {...state}/>{!state.loading&&!state.error&&(state.posts.length?<div className="journal-feature-grid">{state.posts.slice(0,3).map((post,i)=><Reveal key={post.slug} delay={i*100}><BlogCard post={post} featured={i===0}/></Reveal>)}</div>:<p className="journal-loading">New stories are on their way.</p>)}</section>;
}
