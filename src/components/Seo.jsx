import React,{useEffect} from "react";
import {useLocation} from "react-router-dom";
import {productPath} from "../utils/productPath.js";
const plain=value=>String(value||"").replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();
export function buildProductSeo(product,origin){
 const url=origin+productPath(product);
 return {title:product.seoTitle||product.name+" Perfume | Manzeil Pakistan",description:product.seoDescription||plain(product.description).slice(0,170),keywords:product.seoKeywords||[product.name,"Manzeil perfume","perfume in Pakistan",product.category==="female"?"perfume for women":product.category==="male"?"perfume for men":"unisex perfume"].join(", "),image:product.images?.[0]?.url,url,json:{"@context":"https://schema.org","@graph":[{"@type":"Product",name:product.name,description:plain(product.description),image:product.images?.map(image=>image.url),sku:String(product._id),brand:{"@type":"Brand",name:product.brand||"Manzeil"},offers:{"@type":"Offer",url,priceCurrency:"PKR",price:Number(product.discountPrice>0?product.discountPrice:product.price),availability:product.stock>0?"https://schema.org/InStock":"https://schema.org/OutOfStock",itemCondition:"https://schema.org/NewCondition"}},{"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:origin+"/"},{"@type":"ListItem",position:2,name:"Perfumes",item:origin+"/products"},{"@type":"ListItem",position:3,name:product.name,item:url}]}]}};
}
export function PageSeo({title,description,keywords="",image,url,json,noindex=false}){
 useEffect(()=>{
  const oldTitle=document.title,owned=[];
  document.title=title;
  function set(selector,tag,attrs){
   let node=document.head.querySelector(selector);const before=node?.outerHTML;
   if(!node){node=document.createElement(tag);document.head.appendChild(node);}
   for(const[key,value]of Object.entries(attrs))node.setAttribute(key,value);
   owned.push(()=>{if(before){const template=document.createElement("template");template.innerHTML=before;node.replaceWith(template.content.firstChild);}else node.remove();});
  }
  set('meta[name="description"]',"meta",{name:"description",content:description||""});
  set('meta[name="keywords"]',"meta",{name:"keywords",content:keywords});
  set('meta[name="robots"]',"meta",{name:"robots",content:noindex?"noindex,follow":"index,follow,max-image-preview:large"});
  set('link[rel="canonical"]',"link",{rel:"canonical",href:url});
  for(const[property,content]of Object.entries({"og:title":title,"og:description":description||"","og:url":url,"og:type":json?"product":"website","og:image":image||new URL("/manzeil-logo.png",url).href,"og:site_name":"Manzeil"}))set('meta[property="'+property+'"]',"meta",{property,content});
  set('meta[name="twitter:card"]',"meta",{name:"twitter:card",content:"summary_large_image"});
  document.head.querySelectorAll("script[data-product-seo]").forEach(node=>node.remove());
  let script;
  if(json){script=document.createElement("script");script.type="application/ld+json";script.dataset.productSeo="true";script.textContent=JSON.stringify(json);document.head.appendChild(script);}
  return()=>{document.title=oldTitle;owned.reverse().forEach(restore=>restore());script?.remove();};
 },[title,description,keywords,image,url,JSON.stringify(json),noindex]);
 return null;
}
export default function RouteSeo(){
 const location=useLocation();
 if(location.pathname.startsWith("/product/"))return null;
 const titles={"/":"Perfumes in Pakistan | Manzeil — Jo Tum Chaho","/products":"Shop Perfumes Online in Pakistan | Manzeil","/collections/for-her":"Perfumes for Women in Pakistan | Manzeil","/collections/for-him":"Perfumes for Men in Pakistan | Manzeil","/collections/unisex":"Unisex Perfumes in Pakistan | Manzeil","/contact":"Contact Manzeil | Perfume Store Pakistan","/blog":"Fragrance Journal | Manzeil"};
 const title=titles[location.pathname]||"Manzeil | Jo Tum Chaho",params=new URLSearchParams(location.search);
 const privatePage=/^\/(admin|cart|checkout)(\/|$)/.test(location.pathname);
 const origin=(import.meta.env.VITE_SITE_URL||window.location.origin).replace(/\/$/,"");
 const suffix=params.has("page")?"?page="+encodeURIComponent(params.get("page")):"";
 return <PageSeo title={title} description="Discover Manzeil fragrances for women, men and everyone. Shop perfumes online in Pakistan with cash on delivery. Jo Tum Chaho." keywords="Manzeil perfumes, perfumes in Pakistan, perfume for men, perfume for women, unisex perfume" url={origin+location.pathname+suffix} noindex={privatePage||params.has("q")||params.has("search")||params.has("minPrice")||params.has("maxPrice")}/>;
}
export function ProductSeo({product,error}){
 const origin=(import.meta.env.VITE_SITE_URL||window.location.origin).replace(/\/$/,"");
 if(!product)return <PageSeo title={error?"Fragrance unavailable | Manzeil":"Discover your fragrance | Manzeil"} description="Discover the Manzeil fragrance collection." url={origin+window.location.pathname} noindex={!!error}/>;
 return <PageSeo {...buildProductSeo(product,origin)}/>;
}
