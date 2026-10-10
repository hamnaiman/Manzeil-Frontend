import fs from "node:fs";
const read = p => fs.readFileSync(p,"utf8");
const write = (p,s) => fs.writeFileSync(p,s);
const back = "../backend/";
write(back+"utils/productImages.js", `export function retainedImages(current, raw) {
  if (raw === undefined) return [...current];
  let ids;
  try { ids = JSON.parse(raw); } catch { throw Object.assign(new Error("Invalid image selection"), {status:400}); }
  if (!Array.isArray(ids) || ids.length > 20 || new Set(ids).size !== ids.length || ids.some(id => typeof id !== "string" || !current.some(image => image.publicId === id))) throw Object.assign(new Error("Invalid image selection"), {status:400});
  return ids.map(id => current.find(image => image.publicId === id));
}
`);
let s=read(back+"controllers/productController.js");
s='import { retainedImages } from "../utils/productImages.js";\n'+s;
s=s.replace('  // Append newly uploaded images, if any','  product.images = retainedImages(product.images, req.body.retainedImages);\n  // New uploads can replace the cover without removing the gallery.');
s=s.replace('    product.images.push(...newImages);','    product.images = req.body.newImagesFirst === "true" ? [...newImages, ...product.images] : [...product.images, ...newImages];');
write(back+"controllers/productController.js",s);
s=read(back+"models/SiteContent.js").replace('  key: {','  media: { type: Map, of: String, default: {} },\n  key: {');
write(back+"models/SiteContent.js",s);
s=read(back+"routes/contentRoutes.js");
s='import upload from "../middleware/upload.js";\n'+s;
s=s.replace('export default router;',`const mediaSlots = new Set(["logo","femaleEdit","maleEdit", ...["obsession","business-elegance","serene"].flatMap(key => [key+"Bottle",key+"Decor",key+"Post"])]);
router.put("/media/:slot", protect, (req,res,next) => {
  if (!mediaSlots.has(req.params.slot)) return res.status(400).json({message:"Unknown image slot"});
  next();
}, upload.single("image"), asyncHandler(async (req,res) => {
  if (!req.file) return res.status(400).json({message:"Choose an image"});
  const content = await SiteContent.findOneAndUpdate({key:"storefront"}, {$set:{["media."+req.params.slot]:req.file.path}}, {new:true,upsert:true,runValidators:true,setDefaultsOnInsert:true});
  res.json({success:true,data:content});
}));
export default router;`);
write(back+"routes/contentRoutes.js",s);
write("src/data/mediaSlots.js",`import { heroBottles } from "./heroBottles.js";
export const mediaSlots = [
 {key:"logo",label:"Hero logo",url:"/manzeil-logo.png"},
 ...heroBottles.flatMap(b => [
  {key:b.key+"Bottle",label:b.name+" — transparent bottle",url:b.image},
  {key:b.key+"Decor",label:b.name+" — background accent",url:b.decor},
  {key:b.key+"Post",label:b.name+" — campaign post",url:"/images/posts/"+b.key+".png"}
 ]),
 {key:"femaleEdit",label:"Feminine collection banner",url:"/images/posts/serene.png"},
 {key:"maleEdit",label:"Masculine collection banner",url:"/images/posts/business-elegance.png"}
];
export const mediaUrl = (media,key) => media?.[key] || mediaSlots.find(slot=>slot.key===key)?.url;
`);
s=read("src/components/Hero.jsx").replace('Hero({ products = [] })','Hero({ products = [], media = {} })');
s=s.replace('  const active = heroBottles[index];','  const selected = heroBottles[index];\n  const active = {...selected, image: media[selected.key+"Bottle"] || selected.image, decor: media[selected.key+"Decor"] || selected.decor};');
s=s.replace('src="/manzeil-logo.png"','src={media.logo || "/manzeil-logo.png"}').replace('src={bottle.image}', 'src={media[bottle.key+"Bottle"] || bottle.image}');
write("src/components/Hero.jsx",s);
s=read("src/pages/Home.jsx").replace('<Hero products={products} />','<Hero products={products} media={content?.media} />').replace('<ProductCard product={product} />','<ProductCard product={product} media={content?.media} />');
s=s.replace('src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85"','src={content?.media?.femaleEdit || "/images/posts/serene.png"}').replace('src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85"','src={content?.media?.maleEdit || "/images/posts/business-elegance.png"}');
write("src/pages/Home.jsx",s);
s=read("src/components/ProductCard.jsx").replace('useRef, useState','useEffect, useRef, useState').replace('ProductCard({ product })','ProductCard({ product, media = {} })');
s=s.replace('const image = campaign ? "/images/posts/" + campaign.key + ".png" : product.images?.[0]?.url;', 'const image = product.images?.[0]?.url || (campaign ? media[campaign.key+"Post"] || "/images/posts/" + campaign.key + ".png" : "");\n  useEffect(() => setFailed(false), [image]);');
s=s.replace('src={campaign.image}','src={media[campaign.key+"Bottle"] || campaign.image}');
write("src/components/ProductCard.jsx",s);
s=read("src/pages/admin/AddProduct.jsx");
s='import { mediaSlots } from "../../data/mediaSlots.js";\nimport "../../styles/admin-media.css";\n'+s;
s=s.replace('const [images, setImages] = useState([]);','const [images, setImages] = useState([]);\n  const [media, setMedia] = useState({});\n  const [preparing, setPreparing] = useState(false);\n  const [newImagesFirst, setNewImagesFirst] = useState(true);');
s=s.replace('    loadProducts();\n  }, []);','    loadProducts();\n    api.get("/content").then(({data})=>setMedia(data.data.media || {})).catch(()=>{});\n  }, []);');
s=s.replace('    setImages((prev) => [...prev, ...Array.from(e.target.files)]);','    const chosen = Array.from(e.target.files);\n    if (chosen.some(file => !file.type.startsWith("image/") || file.size > 5*1024*1024) || images.length + chosen.length > 5) { setError("Select up to 5 images, each under 5 MB."); return; }\n    setImages((prev) => [...prev, ...chosen]);');
s=s.replace('      images.forEach((file) => fd.append("images", file));','      images.forEach((file) => fd.append("images", file));\n      fd.append("newImagesFirst", String(newImagesFirst));\n      if (editingId) fd.append("retainedImages", JSON.stringify(existingImages.map(image=>image.publicId)));');
s=s.replace('    setSaving(true);','    if (!images.length && !existingImages.length) { setError("Keep at least one product image."); return; }\n    setSaving(true);');
s=s.replace('    setExistingImages([]);','    setExistingImages([]);\n    setNewImagesFirst(true);');
s=s.replace('  const inputClass =',`  async function choosePost(slot) {
    setPreparing(true); setError("");
    try {
      const response = await fetch(media[slot.key] || slot.url);
      if (!response.ok) throw new Error("Image could not load");
      const blob = await response.blob();
      if (!blob.type.startsWith("image/") || blob.size > 5*1024*1024) throw new Error("Image must be under 5 MB");
      setImages([new File([blob], slot.key+".png", {type:blob.type})]);
      setNewImagesFirst(true);
    } catch (err) { setError(err.message); }
    finally { setPreparing(false); }
  }
  const inputClass =`);
s=s.replace('          {/* Image Upload */}',`          <section className="admin-media-library"><h2>Campaign image library</h2><p>Choose a ready-made post as the new cover, then save the product. Current gallery images are kept.</p><div className="admin-post-grid">{mediaSlots.filter(slot=>slot.key.endsWith("Post")).map(slot=><button type="button" key={slot.key} disabled={preparing || saving} onClick={()=>choosePost(slot)}><img src={media[slot.key] || slot.url} alt={slot.label}/><span>Use {slot.label.replace(" — campaign post","")}</span></button>)}</div></section>
          {/* Image Upload */}`);
s=s.replace('<span className="text-sm">Click to upload images</span>','<span className="text-sm">Upload replacement or gallery images</span>');
s=s.replace('            {/* Existing images (when editing) */}', '<label className="admin-cover-option"><input type="checkbox" checked={newImagesFirst} onChange={event=>setNewImagesFirst(event.target.checked)}/> Use first new image as storefront cover</label>\n            {/* Existing images (when editing) */}');
s=s.replace('className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50"','className="admin-gallery-item"');
s=s.replace('<img src={img.url} alt="" className="w-full h-full object-cover" />','<img src={img.url} alt={"Gallery image "+(idx+1)} /><span>{idx===0 ? "Current cover" : "Gallery"}</span><button type="button" onClick={()=>{ setExistingImages(current=>[current[idx],...current.filter((_,i)=>i!==idx)]); setNewImagesFirst(false); }}>Make cover</button><button type="button" onClick={()=>setExistingImages(current=>current.filter((_,i)=>i!==idx))}>Remove</button>');
s=s.replace('disabled={saving}', 'disabled={saving || preparing}').replace('opacity-0 group-hover:opacity-100','opacity-100');
s=s.replace('New images to add','Selected uploads — saved with product');
write("src/pages/admin/AddProduct.jsx",s);
write("src/pages/admin/MediaLibrary.jsx",`import React, {useEffect,useState} from "react";
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
`);
s=read("src/pages/admin/WebsiteSettings.jsx");
s='import MediaLibrary from "./MediaLibrary.jsx";\n'+s;
s=s.replace('</section>;','<MediaLibrary /></section>;');
write("src/pages/admin/WebsiteSettings.jsx",s);
write("src/styles/admin-media.css",`.admin-media-library{margin:24px 0;padding:24px;background:#fff;border:1px solid #e9e0d4;border-radius:18px}.admin-media-library h2{font:500 23px Georgia,serif;color:#30271e}.admin-media-library>p{font-size:13px;line-height:1.7;color:#786d61;margin:10px 0 20px;max-width:750px}.admin-media-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.admin-media-grid article{min-width:0;border:1px solid #eee5d9;border-radius:12px;padding:12px;background:#fdfbf7}.admin-media-preview{height:160px;background:radial-gradient(#f7eee1,#dfd2bf);border-radius:8px;overflow:hidden}.admin-media-preview img{width:100%;height:100%;object-fit:contain}.admin-media-grid h3{font-size:13px;margin:12px 0 5px}.admin-media-grid article>span{font-size:11px;color:#8b7965}.admin-upload-control{display:block!important;margin-top:12px;font-size:12px;color:#4a3827}.admin-upload-control input{display:block;width:100%;margin-top:8px;font-size:11px}.admin-post-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.admin-post-grid button{border:1px solid #e0d4c2;border-radius:12px;overflow:hidden;background:#faf5ed}.admin-post-grid img{width:100%;aspect-ratio:1;object-fit:cover}.admin-post-grid span{display:block;padding:10px;font-size:11px}.admin-cover-option{display:flex;align-items:center;gap:8px;margin:14px 0;font-size:12px}.admin-gallery-item{width:120px;padding:8px;background:#faf7f1;border:1px solid #e9dfd1;border-radius:10px}.admin-gallery-item img{height:90px;width:100%;object-fit:contain}.admin-gallery-item span{display:block;font-size:10px;margin:6px 0}.admin-gallery-item button{display:block;font-size:11px;padding:6px 0;text-decoration:underline}.admin-media-library button:disabled{opacity:.5}@media(max-width:950px){.admin-media-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:540px){.admin-media-library{padding:16px}.admin-media-grid{grid-template-columns:1fr}.admin-post-grid{gap:6px}.admin-post-grid span{font-size:10px;padding:6px}}`);
