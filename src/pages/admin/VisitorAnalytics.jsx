import React,{useEffect,useState} from "react";
import {Globe,Eye,Users,Download,RefreshCw} from "lucide-react";
import {ResponsiveContainer,AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip} from "recharts";
import api from "../../api/axios.js";
import "../../styles/visitor-analytics.css";
const months=Array.from({length:12},(_,i)=>new Intl.DateTimeFormat("en",{month:"long"}).format(new Date(2020,i,1)));
const countryFlag=code=>code==="ZZ"?"—":String.fromCodePoint(...code.split("").map(char=>127397+char.charCodeAt(0)));
export default function VisitorAnalytics(){
 const now=new Date();
 const [year,setYear]=useState(now.getFullYear()),[month,setMonth]=useState(String(now.getMonth()+1)),[data,setData]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState(""),[retry,setRetry]=useState(0);
 useEffect(()=>{
  const controller=new AbortController();setLoading(true);setError("");
  api.get("/visits/report",{params:{year,month},signal:controller.signal}).then(({data})=>setData(data.data)).catch(err=>{if(!controller.signal.aborted)setError(err.response?.data?.message||"Visitor report could not load.");}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
  return()=>controller.abort();
 },[year,month,retry]);
 function download(){
  if(!data)return;
  const rows=[["Year","Month","Country code","Country","Page views","Sessions","Share %"],...data.countries.map(row=>[year,month||"Full year",row.code,row.name,row.views,row.sessions,row.share])];
  const csv=rows.map(row=>row.map(value=>'"'+String(value).replaceAll('"','""')+'"').join(",")).join("\r\n");
  const url=URL.createObjectURL(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"})),link=document.createElement("a");
  link.href=url;link.download="manzeil-visitors-"+year+"-"+(month||"full-year")+".csv";link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 const summary=data?.summary;
 return <section className="visitor-analytics">
  <header className="visitor-heading"><div><span>MANZEIL / AUDIENCE</span><h1>Visitor analytics</h1><p>See where your audience comes from.</p></div><button disabled={loading||!data||!!error} onClick={download}><Download size={16}/> Export CSV</button></header>
  <div className="visitor-filters"><label>Year<input aria-label="Report year" type="number" min="2000" max={now.getFullYear()+1} value={year} onChange={event=>setYear(event.target.value)}/></label><label>Month<select value={month} onChange={event=>setMonth(event.target.value)}><option value="">Full year</option>{months.map((name,i)=><option key={name} value={String(i+1)}>{name}</option>)}</select></label><button disabled={loading} onClick={()=>setRetry(value=>value+1)}><RefreshCw size={15}/> Refresh report</button><span>Asia/Karachi · {month?months[Number(month)-1]:"Full year"} {year}</span></div>
  {error?<div className="cms-error" role="alert">{error} <button onClick={()=>setRetry(value=>value+1)}>Try again</button></div>:loading?<p role="status" className="visitor-loading">Loading visitor report…</p>:data&&<>
   <div className="visitor-stats">{[[Eye,"Page views",summary.views],[Users,"Sessions",summary.sessions],[Globe,"Countries",summary.countries]].map(([Icon,label,value])=><article key={label}><Icon size={20}/><span>{label}</span><strong>{value.toLocaleString()}</strong></article>)}</div>
   <div className="visitor-chart"><h2>{month?"Daily":"Monthly"} traffic</h2><p>Page views during the selected period</p><div role="img" aria-label={"Traffic chart: "+summary.views+" page views in selected period"} style={{height:260,minWidth:0}}><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.timeline} margin={{top:15,right:12,left:0,bottom:5}}><defs><linearGradient id="visitor-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#af8e60" stopOpacity={.35}/><stop offset="100%" stopColor="#af8e60" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee7dc"/><XAxis dataKey="date" tickFormatter={date=>month?date.slice(-2):months[Number(date.slice(-2))-1]?.slice(0,3)} tick={{fontSize:10}} minTickGap={18}/><YAxis allowDecimals={false} tick={{fontSize:10}} width={38}/><Tooltip/><Area isAnimationActive={false} type="monotone" dataKey="views" name="Page views" stroke="#9a7647" fill="url(#visitor-fill)" strokeWidth={2}/></AreaChart></ResponsiveContainer></div></div>
   <div className="visitor-countries"><h2>Visitors by country</h2>{!data.countries.length?<div className="visitor-empty"><Globe size={30}/><h3>No visits recorded in this period</h3><p>Choose another month or check back after people visit your storefront.</p></div>:<div className="visitor-table-scroll admin-table-scroll admin-visitors-scroll" role="region" aria-label="Visitors by country table, scroll horizontally for all columns" tabIndex={0}><table><thead><tr><th>Country</th><th>Page views</th><th>Sessions</th><th>Share</th></tr></thead><tbody>{data.countries.map(row=><tr key={row.code}><td><span className="visitor-flag" aria-hidden="true">{countryFlag(row.code)}</span>{row.name}<small>{row.code==="ZZ"?"Location unavailable":row.code}</small></td><td>{row.views.toLocaleString()}</td><td>{row.sessions.toLocaleString()}</td><td><div className="visitor-share"><span style={{width:row.share+"%"}}/></div>{row.share}%</td></tr>)}</tbody></table></div>}</div>
   <p className="visitor-footnote">Page views count page openings. Sessions are anonymous browser sessions and expire after 30 minutes of inactivity; they are not individual people. Country is estimated from IP; localhost, VPNs and older records may show Unknown. Admin pages and recognized bots are excluded. Browsers that block tracking may not be counted.</p>
  </>}
 </section>;
}

