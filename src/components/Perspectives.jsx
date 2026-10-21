import React from "react";
import {Link} from "react-router-dom";
import {Flower2,Gem,Sprout,ArrowUpRight} from "lucide-react";
import StoreImage from "./StoreImage.jsx";
import Reveal from "./Reveal.jsx";
import {perspectiveDefaults} from "../data/perspectives.js";
import "../styles/perspectives.css";

export default function Perspectives({content}){
 const settings={...perspectiveDefaults,...content?.perspectives};
 if(!settings.enabled)return null;
 const images=[
  {key:"perspectivesLeft",src:"/images/perspectives/quiet-moments.png",alt:settings.leftAlt,caption:settings.leftCaption},
  {key:"perspectivesRight",src:"/images/perspectives/golden-moments.png",alt:settings.rightAlt,caption:settings.rightCaption}
 ];
 return <section className="perspectives-section" aria-labelledby="perspectives-title">
  <div className="perspectives-inner">
   <Reveal className="perspectives-heading">
    <div className="perspectives-brand" aria-hidden="true"><i/><span>MANZEIL<small>Jo Tum Chaho</small></span><i/></div>
    <h2 id="perspectives-title">{settings.title}</h2>
    <p className="perspectives-subtitle">{settings.subtitle}</p>
    <p className="perspectives-intro">{settings.intro}</p>
   </Reveal>
   <div className="perspectives-gallery">
    {images.map((image,i)=><Reveal key={image.key} delay={i*140} direction={i?"right":"left"}><figure className="perspectives-photo"><StoreImage src={content?.media?.[image.key]||image.src} alt={image.alt} width={1600} height={800} loading="lazy" sizes="(max-width: 700px) 100vw, 50vw"/><figcaption><span>0{i+1} / A MANZEIL MOMENT</span><p>{image.caption}</p></figcaption></figure></Reveal>)}
    <span className="perspectives-jewel" aria-hidden="true"/>
   </div>
   <Reveal>
    <div className="perspectives-highlights">{[[Flower2,settings.qualityTitle,settings.qualityText],[Gem,settings.timelessTitle,settings.timelessText],[Sprout,settings.careTitle,settings.careText]].map(([Icon,title,text],i)=><div key={i}><Icon size={29} strokeWidth={1.1}/><h3>{title}</h3><p>{text}</p></div>)}</div>
   </Reveal>
   <Reveal className="perspectives-closing"><span className="perspectives-rule" aria-hidden="true"><i/></span><h3>{settings.closingTitle}</h3><p>{settings.closingText}</p><Link to="/products">{settings.cta}<ArrowUpRight size={15}/></Link></Reveal>
  </div>
 </section>;
}
