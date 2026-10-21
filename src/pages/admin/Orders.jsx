import React,{useEffect,useRef,useState} from "react";
import {Plus,Printer,Package,ArrowLeft,UserRound,MapPin,SlidersHorizontal,ChevronLeft,ChevronRight,RefreshCw} from "lucide-react";
import api from "../../api/axios.js";
import ManualOrderForm from "./ManualOrderForm.jsx";
import ParcelLabelEditor from "./ParcelLabelEditor.jsx";
import "../../styles/order-operations.css";
const statuses=["pending","processing","shipped","delivered","cancelled"];
const sources=["website","whatsapp","instagram","facebook","phone","walk-in","other"];
const label=value=>String(value||"").replaceAll("-"," ").replace(/\b\w/g,char=>char.toUpperCase());
const money=value=>"Rs. "+Number(value||0).toLocaleString("en-PK",{maximumFractionDigits:2});
const id=order=>order._id.slice(-8).toUpperCase();
const date=order=>new Date(order.createdAt).toLocaleDateString("en-PK",{day:"numeric",month:"short",year:"numeric",timeZone:"Asia/Karachi"});
const actor=order=>order.createdByName||((order.source||"website")==="website"?"Website customer":"Legacy record");
function StatusSelect({order,changing,onChange}){
 return <select aria-label={"Status for order "+id(order)} disabled={changing===order._id} value={order.orderStatus} onChange={event=>onChange(order._id,event.target.value)}>{statuses.map(value=><option key={value} value={value}>{label(value)}</option>)}</select>;
}
function OrderCard({order,changing,onChange,onPrint}){
 return <article className="ops-order-card">
  <header><div><span className="ops-source">{label(order.source||"website")}</span><h2>#{id(order)}</h2><small>{date(order)}</small></div><span className={"ops-status-badge status-"+order.orderStatus}>{label(order.orderStatus)}</span></header>
  <div className="ops-card-customer"><UserRound size={18}/><div><strong>{order.shippingAddress?.fullName}</strong><a href={"tel:"+order.shippingAddress?.phone}>{order.shippingAddress?.phone}</a><span><MapPin size={12}/>{order.shippingAddress?.city}</span></div></div>
  <div className="ops-card-items">{order.orderItems.slice(0,2).map((item,index)=><p key={index}><span>{item.name}</span><b>× {item.quantity}</b></p>)}{order.orderItems.length>2&&<small>+ {order.orderItems.length-2} more items</small>}</div>
  <div className="ops-card-total"><div><span>Order total</span><strong>{money(order.totalPrice)}</strong></div><span className={order.isPaid?"ops-paid":"ops-cod"}>{order.isPaid?"Paid":"Cash on delivery"}</span></div>
  <p className="ops-card-collect">Collect on delivery <strong>{money(order.isPaid?0:order.totalPrice)}</strong></p>
  <details className="ops-card-details"><summary>Delivery & order details</summary><p>{order.shippingAddress?.address}</p><p>{order.shippingAddress?.city} {order.shippingAddress?.postalCode}</p><dl><div><dt>Items</dt><dd>{money(order.itemsPrice)}</dd></div><div><dt>Delivery</dt><dd>{money(order.shippingPrice)}</dd></div>{order.discountAmount>0&&<div><dt>Discount</dt><dd>− {money(order.discountAmount)}</dd></div>}</dl>{order.externalReference&&<p>Reference: {order.externalReference}</p>}{order.parcelLabel?.trackingNumber&&<p>{order.parcelLabel.courier} · {order.parcelLabel.trackingNumber}</p>}{order.internalNote&&<p className="ops-internal-note"><strong>Internal note</strong>{order.internalNote}</p>}</details>
  <div className="ops-recorded-by"><UserRound size={13}/><span>Added by <strong>{actor(order)}</strong><small>Internal record only</small></span></div>
  <footer><label>Update status<StatusSelect order={order} changing={changing} onChange={onChange}/></label><button className="ops-primary" onClick={()=>onPrint(order)}><Printer size={16}/> Label / receipt</button></footer>
 </article>;
}
export default function Orders(){
 const [orders,setOrders]=useState([]),[status,setStatus]=useState(""),[page,setPage]=useState(1),[pagination,setPagination]=useState({total:0,pages:1});
 const [error,setError]=useState(""),[message,setMessage]=useState(""),[loading,setLoading]=useState(true),[version,setVersion]=useState(0),[changing,setChanging]=useState("");
 const [manual,setManual]=useState(false),[selected,setSelected]=useState(null),[source,setSource]=useState("");
 const heading=useRef(null);
 useEffect(()=>{
  const controller=new AbortController();setLoading(true);setError("");
  api.get("/orders",{params:{status,page,limit:20,source},signal:controller.signal}).then(({data})=>{
   setOrders(data.data);setPagination(data.pagination);
   const pages=Math.max(1,data.pagination.pages);if(page>pages)setPage(pages);
  }).catch(err=>{if(!controller.signal.aborted)setError(err.response?.data?.message||"Orders could not load.");}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
  return()=>controller.abort();
 },[status,page,version,source]);
 useEffect(()=>{if(manual)heading.current?.focus({preventScroll:true});},[manual]);
 async function changeStatus(orderId,value){setChanging(orderId);setError("");try{const {data}=await api.put("/orders/"+orderId+"/status",{orderStatus:value});setOrders(current=>current.map(order=>order._id===orderId?data.data:order));if(status)setVersion(current=>current+1);}catch(err){setError(err.response?.data?.message||"Status could not update.");}finally{setChanging("");}}
 function savedLabel(updated){setOrders(current=>current.map(order=>order._id===updated._id?updated:order));}
 function openManual(){setManual(true);setMessage("");heading.current?.scrollIntoView({behavior:"instant",block:"start"});}
 return <section className="order-operations">
  <header className="ops-heading"><div><span className="ops-kicker">MANZEIL / FULFILMENT</span><h1 ref={heading} tabIndex={-1}>{manual?"New manual order":"Orders & parcels"}</h1><p>{manual?"Enter the order, review the total and save.":"Your website and social orders, ready for their next step."}</p></div>{manual?<button className="ops-secondary" onClick={()=>setManual(false)}><ArrowLeft size={16}/> Back to orders</button>:<button className="ops-primary" onClick={openManual}><Plus size={17}/> Add manual order</button>}</header>
  {message&&<p role="status" className="cms-success">{message}</p>}
  {manual?<ManualOrderForm onCancel={()=>setManual(false)} onSaved={order=>{setManual(false);setMessage("Order #"+id(order)+" saved. Added by "+actor(order)+". You can prepare its parcel below.");setPage(1);setStatus("");setSource("");setVersion(value=>value+1);setSelected(order);}}/>:<>
   <div className="ops-workspace-intro"><span><Package size={16}/> Order workspace</span><p>Customize a label or receipt directly from any order.</p><strong>{pagination.total} <small>orders</small></strong></div>
   <div className="ops-toolbar"><span className="ops-filter-icon" aria-hidden="true"><SlidersHorizontal size={17}/></span><label>Status<select value={status} onChange={event=>{setStatus(event.target.value);setPage(1);}}><option value="">All statuses</option>{statuses.map(value=><option key={value} value={value}>{label(value)}</option>)}</select></label><label>Order source<select value={source} onChange={event=>{setSource(event.target.value);setPage(1);}}><option value="">All sources</option>{sources.map(value=><option key={value} value={value}>{label(value)}</option>)}</select></label>{(status||source)&&<button className="ops-clear-filters" onClick={()=>{setStatus("");setSource("");setPage(1);}}>Clear filters</button>}<button className="ops-secondary ops-refresh" aria-label="Refresh orders" disabled={loading} onClick={()=>setVersion(value=>value+1)}><RefreshCw size={15}/><span>Refresh</span></button></div>
   {error&&<p className="cms-error" role="alert">{error} <button onClick={()=>setVersion(value=>value+1)}>Retry</button></p>}
   {loading?<div role="status" className="ops-loading">Loading orders…</div>:!orders.length?<div className="ops-empty"><Package size={32}/><h2>No orders in this view</h2><p>Change your filters or add an order received outside the website.</p><button className="ops-primary" onClick={openManual}><Plus size={15}/> Add manual order</button></div>:<>
    <div className="ops-mobile-cards">{orders.map(order=><OrderCard key={order._id} order={order} changing={changing} onChange={changeStatus} onPrint={setSelected}/>)}</div>
    <div className="ops-table-scroll ops-desktop-table" role="region" aria-label="Orders" tabIndex={0}><table><thead><tr><th>Order / source</th><th>Customer</th><th>Items & total</th><th>Added by · internal</th><th>Status</th><th>Parcel</th></tr></thead><tbody>{orders.map(order=><tr key={order._id}><td><strong className="ops-order-id">#{id(order)}</strong><span className="ops-source">{label(order.source||"website")}</span><small>{date(order)}</small></td><td><strong>{order.shippingAddress?.fullName}</strong><small>{order.shippingAddress?.phone}</small><small>{order.shippingAddress?.city}</small><details><summary>Delivery details</summary><p>{order.shippingAddress?.address}</p>{order.externalReference&&<p>Ref: {order.externalReference}</p>}</details></td><td>{order.orderItems.slice(0,2).map((item,index)=><p key={index}>{item.name} × {item.quantity}</p>)}{order.orderItems.length>2&&<small>+ {order.orderItems.length-2} more</small>}<strong>{money(order.totalPrice)}</strong><small>{order.isPaid?"Paid":"COD · Collect "+money(order.totalPrice)}</small>{order.internalNote&&<details><summary>Internal note</summary><p>{order.internalNote}</p></details>}</td><td><span className="ops-actor-name">{actor(order)}</span><small>Not printed</small></td><td><StatusSelect order={order} changing={changing} onChange={changeStatus}/></td><td><button className="ops-secondary" onClick={()=>setSelected(order)}><Printer size={15}/> Label / receipt</button>{order.parcelLabel?.trackingNumber&&<small>{order.parcelLabel.trackingNumber}</small>}</td></tr>)}</tbody></table></div>
   </>}
   {!loading&&pagination.total>0&&<nav className="ops-pagination" aria-label="Order pages"><span>Page {page} of {Math.max(1,pagination.pages)}</span><div><button aria-label="Previous order page" disabled={page<=1} onClick={()=>setPage(value=>value-1)}><ChevronLeft size={15}/> Previous</button><button aria-label="Next order page" disabled={page>=pagination.pages} onClick={()=>setPage(value=>value+1)}>Next <ChevronRight size={15}/></button></div></nav>}
  </>}
  {selected&&<ParcelLabelEditor key={selected._id} order={selected} onClose={()=>setSelected(null)} onSaved={savedLabel}/>}
 </section>;
}
import "../../styles/order-operations-polish.css";
