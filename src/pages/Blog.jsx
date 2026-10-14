import React,{useEffect,useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import {ArrowLeft,ArrowUpRight} from 'lucide-react';
import {BlogCard,BlogStatus,categories,useBlogPosts} from '../components/BlogSection.jsx';
import Reveal from '../components/Reveal.jsx';
import Footer from '../components/Footer.jsx';
import api from '../api/axios.js';
import manzeilLogo from '../assets/manzeil-logo.png';
import {blogBanner} from '../data/blogBanners.js';
export default function Blog(){
 const state=useBlogPosts();const [category,setCategory]=useState('All articles');
 const posts=state.posts.filter(p=>category==='All articles'||p.category===category);
 return <main id="main-content" className="scent-home journal-page"><section className="scent-section"><Reveal><header className="journal-masthead"><img className="journal-masthead-logo" src={manzeilLogo} alt="Manzeil"/><span className="section-pill">THE BLOG / STORIES &amp; INSPIRATION</span><h1>The art of<br/><em>leaving an impression.</em></h1><p>A place for curious noses, everyday rituals<br/>and beautiful discoveries.</p></header></Reveal><div className="journal-category-bar" aria-label="Blog categories">{categories.map(c=><button key={c} aria-pressed={c===category} onClick={()=>setCategory(c)}>{c}</button>)}</div><BlogStatus {...state}/>{!state.loading&&!state.error&&(posts.length?<div className="journal-feature-grid">{posts.map((post,i)=><Reveal key={post.slug} delay={(i%3)*80}><BlogCard post={post} featured={i===0}/></Reveal>)}</div>:<p className="journal-loading">More stories in this chapter, coming soon.</p>)}</section><Footer/></main>;
}
function articleSections(body){
 const sections=[{title:'',paragraphs:[]}];
 for(const block of body.split(/\n\s*\n/).filter(Boolean)){
  if(block.startsWith('## ')){const [title,...lines]=block.slice(3).split('\n');sections.push({title,paragraphs:lines.length?[lines.join('\n')]:[]});}
  else sections[sections.length-1].paragraphs.push(block);
 }
 return sections.filter(section=>section.title||section.paragraphs.length);
}
export function BlogArticle(){
 const {slug}=useParams();const [post,setPost]=useState(null),[error,setError]=useState(''),[loading,setLoading]=useState(true),[retry,setRetry]=useState(0);
 useEffect(()=>{const controller=new AbortController();setLoading(true);setError('');setPost(null);api.get('/blog/'+encodeURIComponent(slug),{signal:controller.signal}).then(({data})=>setPost(data.data)).catch(err=>{if(!controller.signal.aborted)setError(err.response?.status===404?'This article is not available.': 'The article could not load. Please try again.');}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});return()=>controller.abort();},[slug,retry]);
 const sections=post?articleSections(post.body):[];
 const banner=blogBanner(post);
 return <main id="main-content" className="scent-home journal-page"><article className="scent-section journal-article"><Link className="journal-read" to="/blog"><ArrowLeft size={16}/> Back to the blog</Link><BlogStatus loading={loading} error={error} retry={()=>setRetry(x=>x+1)}/>{post&&<><div className={"journal-article-intro"+(banner?" journal-article-panorama":"")}><header className="journal-article-header"><div className="journal-meta"><span>{post.category}</span><span>{post.readingTime} min read</span></div><h1>{post.title}</h1><p>{post.excerpt}</p><div className="journal-notes">{post.notes?.map(n=><span key={n}>{n}</span>)}</div></header><div className="journal-hero-art"><img className="journal-article-cover" src={banner||post.cover?.url} alt={post.title}/></div></div><div className="journal-article-layout"><div className="journal-prose"><div className="journal-byline"><span>THE MANZEIL EDIT</span><span>A moment for yourself</span></div>{sections.map((section,i)=><Reveal key={i}><section id={'chapter-'+i} className={section.title?'journal-chapter':'journal-opening'}>{section.title&&<div className="journal-chapter-heading"><span aria-hidden="true">{String(sections.slice(0,i+1).filter(s=>s.title).length).padStart(2,'0')}</span><h2>{section.title}</h2></div>}{section.paragraphs.map((p,j)=><p key={j}>{p}</p>)}</section></Reveal>)} </div><aside className="journal-sidebar">{sections.some(s=>s.title)&&<nav className="journal-contents" aria-label="In this article"><span className="section-pill">IN THIS STORY</span>{sections.map((s,i)=>s.title&&<a key={i} href={"#chapter-"+i}>{s.title}<ArrowUpRight size={14}/></a>)}</nav>}<div className="journal-shop"><span className="section-pill">FROM THE PAGE TO YOUR EVERYDAY</span>{post.product?<><img src={post.product.images?.[0]?.url} alt={post.product.name}/><h2>{post.product.name}</h2><p>Rs. {Number(post.product.discountPrice>0?post.product.discountPrice:post.product.price).toLocaleString()}</p><Link to={'/product/'+post.product._id} className="scent-button">Shop this scent <ArrowUpRight size={16}/></Link></>:<><h2>Make it<br/><em>your signature.</em></h2><p>Discover a fragrance that feels like you.</p><Link to="/products" className="scent-button">Explore fragrances <ArrowUpRight size={16}/></Link></>}</div></aside></div><div className="journal-article-end"><span>MANZEIL · JO TUM CHAHO</span><Link to="/blog" className="journal-read">Discover more stories <ArrowUpRight size={17}/></Link></div></>}</article><Footer/></main>;
}
