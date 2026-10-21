import React,{useEffect,useRef,useState} from "react";
import {createPortal} from "react-dom";
import {Printer,X,ChevronDown,Check,Package,FileText} from "lucide-react";
import api from "../../api/axios.js";
const money=value=>"Rs. "+Number(value||0).toLocaleString("en-PK",{maximumFractionDigits:2});
const reference=order=>String(order._id).slice(-8).toUpperCase();
export function ParcelDocument({order,settings}){
 const address=order.shippingAddress||{},collect=order.isPaid?0:order.totalPrice;
 return <article className={"parcel-document "+(settings.format==="receipt"?"parcel-receipt":"parcel-label")}>
  <header><div><strong>{settings.senderName||"MANZEIL"}</strong><span>Jo Tum Chaho</span></div><div><b>{settings.format==="receipt"?"ORDER RECEIPT":"PARCEL LABEL"}</b><span>#{reference(order)}</span><small>{new Date(order.createdAt).toLocaleDateString("en-PK",{timeZone:"Asia/Karachi"})}</small></div></header>
  <section className="parcel-recipient"><span>DELIVER TO</span><h2>{address.fullName}</h2><strong>{address.phone}</strong><p>{address.address}</p><h3>{address.city} {address.postalCode}</h3></section>
  {(settings.courier||settings.trackingNumber)&&<section className="parcel-tracking"><span>{settings.courier}</span>{settings.trackingNumber&&<strong>{settings.trackingNumber}</strong>}</section>}
  {settings.showItems&&<table><thead><tr><th>Item</th><th>Qty</th>{settings.showPrices&&<th>Amount</th>}</tr></thead><tbody>{order.orderItems.map((item,i)=><tr key={i}><td>{item.name}</td><td>{item.quantity}</td>{settings.showPrices&&<td>{money(item.price*item.quantity)}</td>}</tr>)}</tbody></table>}
  {settings.showPrices&&<dl className="parcel-totals"><div><dt>Items</dt><dd>{money(order.itemsPrice)}</dd></div><div><dt>Delivery</dt><dd>{money(order.shippingPrice)}</dd></div>{order.discountAmount>0&&<div><dt>Discount</dt><dd>− {money(order.discountAmount)}</dd></div>}<div><dt>Order total</dt><dd>{money(order.totalPrice)}</dd></div></dl>}
  <div className="parcel-collect"><span>{order.isPaid?"PAID · NOTHING TO COLLECT":"CASH TO COLLECT"}</span><strong>{money(collect)}</strong></div>
  {settings.instructions&&<p className="parcel-instructions">{settings.instructions}</p>}
  <footer><strong>FROM · {settings.senderName||"Manzeil"}</strong>{settings.senderPhone&&<span>{settings.senderPhone}</span>}{settings.senderAddress&&<p>{settings.senderAddress}</p>}<small>Order #{reference(order)}</small></footer>
 </article>;
}
const preferenceKeys=["senderName","senderPhone","senderAddress","courier","instructions","format","showItems","showPrices"];
const preferences=form=>Object.fromEntries(preferenceKeys.map(key=>[key,form[key]]));
export default function ParcelLabelEditor({order,onClose,onSaved}){
 const dialog=useRef(null),printTimer=useRef(null),baseline=useRef("");
 const [form,setForm]=useState({senderName:"Manzeil",senderPhone:"",senderAddress:"",courier:"",trackingNumber:"",instructions:"Handle with care. Fragrance inside.",format:order.orderItems.length>5?"receipt":"label",showPrices:order.orderItems.length>5,showItems:true,...order.parcelLabel});
 const [busy,setBusy]=useState(false),[ready,setReady]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState(""),[remember,setRemember]=useState(true);
 useEffect(()=>{
  const previousOverflow=document.body.style.overflow,controller=new AbortController();
  document.body.style.overflow="hidden";dialog.current?.showModal();
  api.get("/content",{signal:controller.signal}).then(({data})=>{
   const saved=data.data.parcelDefaults||{};
   const defaults={senderName:"Manzeil",senderPhone:data.data.phone||"",senderAddress:data.data.address||"",courier:"",instructions:"Handle with care. Fragrance inside.",format:"label",showPrices:false,showItems:true,...saved};
   baseline.current=JSON.stringify(preferences(defaults));
   setForm({...defaults,...(order.orderItems.length>5?{format:"receipt",showPrices:true}:{}),trackingNumber:"",...order.parcelLabel});
  }).catch(()=>{if(!controller.signal.aborted)setNotice("Saved sender details could not load. Check Edit details before printing.");}).finally(()=>{if(!controller.signal.aborted)setReady(true);});
  return()=>{controller.abort();clearTimeout(printTimer.current);document.body.style.overflow=previousOverflow;};
 },[]);
 const update=event=>setForm({...form,[event.target.name]:event.target.type==="checkbox"?event.target.checked:event.target.value});
 async function print(){
  if(busy||!ready)return;
  setBusy(true);setError("");setNotice("");
  try{
   const {data}=await api.put("/orders/"+order._id+"/parcel-label",form);
   onSaved(data.data);
   const current=JSON.stringify(preferences(form));
   if(remember&&current!==baseline.current){
    try{await api.put("/content",{parcelDefaults:preferences(form)});baseline.current=current;}
    catch{setNotice("This order is saved, but default sender details could not be remembered. Printing is still available.");}
   }
   printTimer.current=setTimeout(()=>window.print(),100);
  }catch(err){setError(err.response?.data?.message||"Could not prepare this order for printing. Please retry.");}
  finally{setBusy(false);}
 }
 return <>
  <dialog ref={dialog} className="parcel-editor parcel-quick" aria-labelledby="parcel-editor-title" onCancel={event=>{event.preventDefault();if(!busy)onClose();}}>
   <header className="parcel-editor-heading"><div><span className="ops-kicker">ORDER #{reference(order)}</span><h2 id="parcel-editor-title">Ready to print</h2><p>{order.shippingAddress?.fullName} · {order.shippingAddress?.city}</p></div><button aria-label="Close print preview" disabled={busy} onClick={onClose}><X size={20}/></button></header>
   <div className="parcel-format-switch" role="group" aria-label="Choose print format">{[["label","Parcel label","4 × 6 inch",Package],["receipt","Order receipt","A4 paper",FileText]].map(([value,title,note,Icon])=><button key={value} disabled={busy||!ready} aria-pressed={form.format===value} onClick={()=>setForm({...form,format:value,showPrices:value==="receipt"})}><Icon size={18}/><span><strong>{title}</strong><small>{note}</small></span>{form.format===value&&<Check size={15}/>}</button>)}</div>
   <div className="parcel-editor-layout" tabIndex={0} aria-label="Parcel preview and optional settings">
    {!ready&&<p role="status" className="parcel-ready-status">Preparing your saved details…</p>}
    {error&&<p role="alert" className="cms-error">{error}</p>}{notice&&<p role="status" className="parcel-quick-notice">{notice}</p>}
    <div className="parcel-preview"><ParcelDocument order={order} settings={form}/></div>
    <details className="parcel-edit-details"><summary><span>Edit details <small>Only if something needs changing</small></span><ChevronDown size={17}/></summary><fieldset disabled={busy||!ready}>
     <div className="parcel-edit-fields">{[["courier","Courier (optional)",100],["trackingNumber","Tracking number (this order only)",120],["senderName","Sender name",100],["senderPhone","Sender phone",40],["senderAddress","Return address",400],["instructions","Parcel instructions",300]].map(([key,label,max])=><label className={["senderAddress","instructions"].includes(key)?"parcel-edit-full":""} key={key}>{label}{["senderAddress","instructions"].includes(key)?<textarea name={key} rows={2} maxLength={max} value={form[key]} onChange={update}/>:<input name={key} maxLength={max} value={form[key]} onChange={update}/>}</label>)}</div>
     <div className="parcel-quick-options"><label className="ops-checkbox"><input name="showItems" type="checkbox" checked={form.showItems} onChange={update}/> Include item list</label><label className="ops-checkbox"><input name="showPrices" type="checkbox" checked={form.showPrices} onChange={update}/> Include price breakdown</label><label className="ops-checkbox"><input type="checkbox" checked={remember} onChange={event=>setRemember(event.target.checked)}/> Remember sender and layout for future orders</label></div><p className="ops-help">Customer details and collection amount are filled automatically. Staff names and internal notes are never printed.</p>
    </fieldset></details>
   </div>
   <footer className="parcel-quick-footer"><div><strong>{form.format==="receipt"?"A4 receipt":"100 × 150 mm label"}</strong><span>Print at 100% scale · headers/footers off</span></div><button className="ops-primary" disabled={busy||!ready} onClick={print}><Printer size={17}/>{busy?"Preparing…":form.format==="receipt"?"Print receipt":"Print label"}</button></footer>
  </dialog>
  {createPortal(<div className="parcel-print-root"><style media="print">{"@page { size: "+(form.format==="receipt"?"A4":"100mm 150mm")+"; margin: "+(form.format==="receipt"?"12mm":"4mm")+"; }"}</style><ParcelDocument order={order} settings={form}/></div>,document.body)}
 </>;
}
