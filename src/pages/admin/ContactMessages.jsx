import React, { useEffect, useState } from "react";
import Reviews from './Reviews.jsx';
import ScentDemands from './ScentDemands.jsx';
import api from "../../api/axios.js";
export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [kind, setKind] = useState('message');
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  useEffect(() => {
    if(kind === "demand" || kind === "feedback") return;
    const controller = new AbortController();
    setLoading(true); setError("");
    api.get("/contact", { params: { status, page, kind }, signal: controller.signal }).then(({ data }) => { setMessages(data.data); setPages(data.pagination.pages); }).catch(err => { if (!controller.signal.aborted) setError(err.response?.data?.message || "Could not load messages"); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [status, page, version, kind]);
  async function update(id, value) {
    setBusy(true); setError("");
    try { await api.patch("/contact/" + id, { status: value }); setVersion(v => v + 1); }
    catch (err) { setError(err.response?.data?.message || "Could not update message"); }
    finally { setBusy(false); }
  }
  return <section className="cms-page"><header><span className="section-pill">CUSTOMER CARE</span><h1>{kind === "demand" ? "Scent Demand" : kind === "feedback" ? "Customer Feedback" : "Contact messages"}</h1><p>Messages sent through your website contact form.</p></header><div className="feedback-inbox-tabs" role="group" aria-label="Inbox type">{[["message","Contact messages"],["feedback","Customer Feedback"],["demand","Scent Demand"]].map(([value,label])=><button key={value} aria-pressed={kind===value} onClick={()=>{setKind(value);setPage(1);}}>{label}</button>)}</div>{kind==="demand"?<ScentDemands />:kind==="feedback"?<Reviews />:<><label className="cms-filter">Show <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}><option value="">All messages</option><option value="new">New</option><option value="read">Read</option><option value="resolved">Resolved</option></select></label>{error && <p className="cms-error" role="alert">{error} <button onClick={() => setVersion(v => v + 1)}>Retry</button></p>}{loading ? <p>Loading…</p> : messages.length ? messages.map(item => <article key={item._id} className="cms-panel"><div className="cms-message-header"><div><h2>{item.subject}</h2><p>{item.name} · <a href={"mailto:" + item.email}>{item.email}</a></p><small>{new Date(item.createdAt).toLocaleString()}</small></div><label>Status<select aria-label={"Status for " + item.subject} disabled={busy} value={item.status} onChange={e => update(item._id, e.target.value)}><option value="new">New</option><option value="read">Read</option><option value="resolved">Resolved</option></select></label></div>{item.kind==="feedback"&&<p className="feedback-inbox-rating" aria-label={item.rating+" out of 5 stars"}>{"★".repeat(item.rating||0)}{"☆".repeat(5-(item.rating||0))} <span>{item.rating}/5</span></p>}<p className="cms-message-body">{item.message}</p></article>) : <p>No messages in this view.</p>}<div className="cms-actions"><button disabled={page <= 1 || loading} onClick={() => setPage(p => p - 1)}>Previous</button><span>Page {page} of {Math.max(1, pages)}</span><button disabled={page >= pages || loading} onClick={() => setPage(p => p + 1)}>Next</button></div></>}</section>;
}
