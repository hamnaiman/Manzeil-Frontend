import React, {useEffect,useState} from "react";
import api from "../../api/axios.js";
import {mediaSlots} from "../../data/mediaSlots.js";
import "../../styles/admin-media.css";
export default function MediaLibrary() {
 const [media,setMedia]=useState({}),[loaded,setLoaded]=useState(false),[busy,setBusy]=useState(""),[error,setError]=useState(""),[message,setMessage]=useState("");
 async function load(){try{const {data}=await api.get("/content");setMedia(data.data.media||{});setLoaded(true);setError("");}catch{setError("Images could not load. Retry before editing.");}}
 useEffect(()=>{load();},[]);
 async function upload(slot,file){
  if(!file)return;
  if(!file.type.startsWith("image/")||file.size>5*1024*1024){setError("Choose an image under 5 MB.");return;}
  setBusy(slot);setError("");setMessage("");
  try{const body=new FormData();body.append("image",file);const {data}=await api.put("/content/media/"+slot,body);setMedia(data.data.media||{});setMessage("Image saved. Refresh the storefront to see your update.");}
  catch(err){setError(err.response?.data?.message||"Upload failed. Your previous image is unchanged.");}finally{setBusy("");}
 }
 return <section className="admin-media-library"><h2>Website image studio</h2><p>Manage hero bottles, backgrounds, logo, promotional posts and collection banners. Product covers are managed in Products; changing a post here does not overwrite an existing product gallery.</p>{error&&<p role="alert" className="cms-error">{error} {!loaded&&<button type="button" onClick={load}>Retry</button>}</p>}{message&&<p role="status" className="cms-success">{message}</p>}<div className="admin-media-grid">{mediaSlots.map(slot=><article key={slot.key}><div className="admin-media-preview"><img src={media[slot.key]||slot.url} alt={slot.label}/></div><h3>{slot.label}</h3><span>{media[slot.key]?"Custom image":"Included design"}</span><label className="admin-upload-control">{busy===slot.key?"Uploading…":"Replace image"}<input aria-label={"Replace "+slot.label} type="file" accept="image/*" disabled={!loaded||!!busy} onChange={event=>{upload(slot.key,event.target.files?.[0]);event.target.value="";}}/></label></article>)}</div></section>;
}
