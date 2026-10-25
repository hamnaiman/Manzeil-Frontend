import React,{useEffect,useRef,useState} from "react";
import {Plus,Printer,Package,ArrowLeft,ChevronLeft,ChevronRight,RefreshCw,Eye,X} from "lucide-react";
import api from "../../api/axios.js";
import ManualOrderForm from "./ManualOrderForm.jsx";
import ParcelLabelEditor from "./ParcelLabelEditor.jsx";
import "../../styles/order-operations.css";
import "../../styles/order-operations-polish.css";
import "../../styles/order-list.css";
const statuses=["pending","processing","shipped","delivered","cancelled"];
const sources=["website","whatsapp","instagram","facebook","phone","walk-in","other"];
const label=value=>({pending:"New",shipped:"Dispatched"}[value]||String(value||"").replaceAll("-"," ").replace(/\b\w/g,char=>char.toUpperCase()));
const money=value=>"Rs. "+Number(value||0).toLocaleString("en-PK",{maximumFractionDigits:2});
const id=order=>order._id.slice(-8).toUpperCase();
const date=order=>new Date(order.createdAt).toLocaleDateString("en-PK",{day:"numeric",month:"short",year:"numeric",timeZone:"Asia/Karachi"});
const actor=order=>order.createdByName||((order.source||"website")==="website"?"Website customer":"Legacy record");
function OrderDetails({order,onClose,onPrint,onChange,changing,error}){
 const dialog=useRef(null);
 useEffect(()=>{const previous=document.body.style.overflow;document.body.style.overflow="hidden";dialog.current.showModal();return()=>{document.body.style.overflow=previous;};},[]);
 const address=order.shippingAddress||{};
 return <dialog ref={dialog} className="order-detail-dialog" aria-labelledby="order-detail-title" onCancel={event=>{event.preventDefault();onClose();}}>
  <header className="order-detail-header"><div><span className="ops-kicker">ORDER DETAILS · {date(order)}</span><h2 id="order-detail-title">Order #{id(order)}</h2></div><button className="order-detail-close" aria-label="Close order details" onClick={onClose}><X size={20}/></button></header>
  <div className="order-detail-body">
   {error&&<p role="alert" className="cms-error">{error}</p>}
   <div className="order-detail-summary"><span className={"ops-status-badge status-"+order.orderStatus}>{label(order.orderStatus)}</span><span>{label(order.source||"website")}</span><span>{order.isPaid?"Paid":"Cash on delivery"}</span></div>
   <section className="order-detail-customer"><h3>Customer & delivery</h3><strong>{address.fullName}</strong><a href={"tel:"+address.phone}>{address.phone}</a><p>{address.address}</p><p>{address.city} {address.postalCode}</p></section>
   <section><h3>Order items</h3><table className="order-detail-items"><thead><tr><th>Product</th><th>Qty</th><th>Amount</th></tr></thead><tbody>{order.orderItems.map((item,index)=><tr key={index}><td>{item.name}<small>{money(item.price)} each</small></td><td>{item.quantity}</td><td>{money(item.price*item.quantity)}</td></tr>)}</tbody></table>
    <dl className="order-detail-totals"><div><dt>Subtotal</dt><dd>{money(order.itemsPrice)}</dd></div><div><dt>Delivery</dt><dd>{money(order.shippingPrice)}</dd></div>{order.discountAmount>0&&<div><dt>Discount</dt><dd>− {money(order.discountAmount)}</dd></div>}<div className="order-detail-grand"><dt>Total</dt><dd>{money(order.totalPrice)}</dd></div><div><dt>Collect on delivery</dt><dd>{money(order.isPaid?0:order.totalPrice)}</dd></div></dl>
   </section>
   <section className="order-detail-internal"><h3>Internal record <small>Not printed on receipt</small></h3><dl><div><dt>Added by</dt><dd>{actor(order)}</dd></div>{order.externalReference&&<div><dt>Reference</dt><dd>{order.externalReference}</dd></div>}{order.parcelLabel?.courier&&<div><dt>Courier</dt><dd>{order.parcelLabel.courier}</dd></div>}{order.parcelLabel?.trackingNumber&&<div><dt>Tracking</dt><dd>{order.parcelLabel.trackingNumber}</dd></div>}</dl>{order.internalNote&&<p>{order.internalNote}</p>}</section>
  </div>
  <footer className="order-detail-footer"><label>Order status<select disabled={changing===order._id} value={order.orderStatus} onChange={event=>onChange(order._id,event.target.value)}>{statuses.map(value=><option key={value} value={value}>{label(value)}</option>)}</select></label><button className="ops-primary" disabled={changing===order._id} onClick={()=>onPrint(order)}><Printer size={16}/> Label / receipt</button></footer>
 </dialog>;
}
export default function Orders(){
 const [orders,setOrders]=useState([]),[status,setStatus]=useState(""),[page,setPage]=useState(1),[pagination,setPagination]=useState({total:0,pages:1});
 const [error,setError]=useState(""),[message,setMessage]=useState(""),[loading,setLoading]=useState(true),[version,setVersion]=useState(0),[changing,setChanging]=useState("");
 const [manual,setManual]=useState(false),[selected,setSelected]=useState(null),[source,setSource]=useState(""),[details,setDetails]=useState(null);
 const heading=useRef(null),detailTrigger=useRef(null);
 useEffect(()=>{
  const controller=new AbortController();setLoading(true);setError("");
  api.get("/orders",{params:{status,page,limit:20,source},signal:controller.signal}).then(({data})=>{
   setOrders(data.data);setPagination(data.pagination);
   const pages=Math.max(1,data.pagination.pages);if(page>pages)setPage(pages);
  }).catch(err=>{if(!controller.signal.aborted)setError(err.response?.data?.message||"Orders could not load.");}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
  return()=>controller.abort();
 },[status,page,version,source]);
 useEffect(()=>{if(manual)heading.current?.focus({preventScroll:true});},[manual]);
 async function changeStatus(orderId,value){setChanging(orderId);setError("");try{const {data}=await api.put("/orders/"+orderId+"/status",{orderStatus:value});setOrders(current=>current.map(order=>order._id===orderId?data.data:order));setDetails(current=>current?._id===orderId?data.data:current);if(status)setVersion(current=>current+1);}catch(err){setError(err.response?.data?.message||"Status could not update.");}finally{setChanging("");}}
 function savedLabel(updated){setOrders(current=>current.map(order=>order._id===updated._id?updated:order));}
 function openManual(){setManual(true);setMessage("");heading.current?.scrollIntoView({behavior:"instant",block:"start"});}
 function closeDetails(){setDetails(null);requestAnimationFrame(()=>{if(detailTrigger.current?.isConnected)detailTrigger.current.focus();else heading.current?.focus();});}
 return <section className="order-operations">
  <header className="ops-heading"><div><span className="ops-kicker">MANZEIL / FULFILMENT</span><h1 ref={heading} tabIndex={-1}>{manual?"New manual order":"Orders"}</h1><p>{manual?"Enter the order, review the total and save.":"Manage orders, update their status and prepare parcels."}</p></div>{manual?<button className="ops-secondary" onClick={()=>setManual(false)}><ArrowLeft size={16}/> Back to orders</button>:<button className="ops-primary" onClick={openManual}><Plus size={17}/> Add manual order</button>}</header>
  {message&&<p role="status" className="cms-success">{message}</p>}
  {manual?<ManualOrderForm onCancel={()=>setManual(false)} onSaved={order=>{setManual(false);setMessage("Order #"+id(order)+" saved. Added by "+actor(order)+".");setPage(1);setStatus("");setSource("");setVersion(value=>value+1);setSelected(order);}}/>:<>
   <div className="order-list-workspace">
    <div className="order-list-filters"><div className="order-status-tabs" role="group" aria-label="Filter orders by status">{["",...statuses].map(value=><button key={value} aria-pressed={status===value} className={status===value?"is-active":""} onClick={()=>{setStatus(value);setPage(1);}}>{value?label(value):"All orders"}</button>)}</div><div className="order-list-tools"><label><span className="sr-only">Order source</span><select aria-label="Filter by order source" value={source} onChange={event=>{setSource(event.target.value);setPage(1);}}><option value="">All sources</option>{sources.map(value=><option key={value} value={value}>{label(value)}</option>)}</select></label><button aria-label="Refresh orders" disabled={loading} onClick={()=>setVersion(value=>value+1)}><RefreshCw size={17}/></button></div></div>
    <div className="order-list-caption" role="status"><span>{loading?"Loading orders…":pagination.total+" orders"}</span>{(status||source)&&<button onClick={()=>{setStatus("");setSource("");setPage(1);}}>Clear filters</button>}</div>
    {error&&!details&&<p className="cms-error" role="alert">{error} <button onClick={()=>setVersion(value=>value+1)}>Retry</button></p>}
    {loading?<div className="ops-loading" role="status">Loading your order list…</div>:!orders.length?<div className="ops-empty"><Package size={30}/><h2>No orders in this view</h2><p>Try another status or order source.</p></div>:<div className="admin-table-scroll admin-orders-scroll" role="region" aria-label="Orders list" tabIndex={0}><table className="order-list-table"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{orders.map(order=><tr key={order._id}><td><strong>#{id(order)}</strong><span className="order-mobile-customer">{order.shippingAddress?.fullName}</span><small>{date(order)}</small></td><td><strong>{order.shippingAddress?.fullName}</strong><small>{order.shippingAddress?.city}<span className="order-list-source"> · {label(order.source||"website")}</span></small></td><td><strong>{money(order.totalPrice)}</strong><small>{order.isPaid?"Paid":"COD"}</small></td><td><span className={"ops-status-badge status-"+order.orderStatus}>{label(order.orderStatus)}</span></td><td><button className="order-view-button" aria-label={"View details for order "+id(order)} onClick={event=>{detailTrigger.current=event.currentTarget;setDetails(order);}}><Eye size={16}/><span>View details</span></button></td></tr>)}</tbody></table></div>}
    {!loading&&pagination.total>0&&<nav className="ops-pagination" aria-label="Order pages"><span>Page {page} of {Math.max(1,pagination.pages)}</span><div><button aria-label="Previous order page" disabled={page<=1} onClick={()=>setPage(value=>value-1)}><ChevronLeft size={15}/> Previous</button><button aria-label="Next order page" disabled={page>=pagination.pages} onClick={()=>setPage(value=>value+1)}>Next <ChevronRight size={15}/></button></div></nav>}
   </div>
  </>}
  {details&&<OrderDetails order={details} onClose={closeDetails} changing={changing} error={error} onChange={changeStatus} onPrint={order=>{setDetails(null);setSelected(order);}}/>}
  {selected&&<ParcelLabelEditor key={selected._id} order={selected} onClose={()=>{setSelected(null);heading.current?.focus();}} onSaved={savedLabel}/>}
 </section>;
}


