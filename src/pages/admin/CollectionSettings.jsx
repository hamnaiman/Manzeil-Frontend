import React,{useEffect,useState} from "react";
import api from "../../api/axios.js";
import {collections} from "../../data/collections.js";
export default function CollectionSettings(){
 const [heroes,setHeroes]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(""),[message,setMessage]=useState("");
 async function load(){
  try{const {data}=await api.get("/content");setHeroes(Object.fromEntries(Object.entries(collections).map(([key,item])=>[key,{title:data.data.collectionHeroes?.[key]?.title||item.title,intro:data.data.collectionHeroes?.[key]?.intro||item.intro}])));setError("");}
  catch{setError("Could not load collection settings.");}
 }
 useEffect(()=>{load();},[]);
 async function save(event){
  event.preventDefault();setBusy(true);setError("");setMessage("");
  try{await api.put("/content",{collectionHeroes:heroes});setMessage("Collection banners saved.");}
  catch(err){setError(err.response?.data?.message||"Could not save collection settings.");}
  finally{setBusy(false);}
 }
 return <section className="admin-media-library"><h2>Collection banners</h2><p>Edit the banner heading and introduction for each collection page. Category banner images can be replaced in Website image studio below.</p>{error&&<p role="alert" className="cms-error">{error} {!heroes&&<button onClick={load}>Retry</button>}</p>}{message&&<p role="status" className="cms-success">{message}</p>}{heroes&&<form onSubmit={save}><div className="collection-admin-grid">{Object.entries(collections).map(([key,item])=><fieldset key={key} className="cms-fields"><legend>{item.label}</legend><label>Hero heading<input required maxLength={100} value={heroes[key].title} onChange={event=>setHeroes({...heroes,[key]:{...heroes[key],title:event.target.value}})}/></label><label>Introduction<textarea required maxLength={500} rows={3} value={heroes[key].intro} onChange={event=>setHeroes({...heroes,[key]:{...heroes[key],intro:event.target.value}})}/></label></fieldset>)}</div><button className="scent-button" disabled={busy}>{busy?"Saving…":"Save collection banners"}</button></form>}</section>;
}
