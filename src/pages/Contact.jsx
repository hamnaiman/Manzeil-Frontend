import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Clock, ArrowUpRight } from "lucide-react";
import api from "../api/axios.js";
import Footer from "../components/Footer.jsx";
const blank = { name: "", email: "", subject: "", message: "" };
export default function Contact() {
  const [content, setContent] = useState(null);
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    api.get("/content", { signal: controller.signal }).then(({ data }) => setContent(data.data)).catch(() => { if (!controller.signal.aborted) setLoadError(true); });
    return () => controller.abort();
  }, []);
  async function send(event) {
    event.preventDefault(); setError(""); setSuccess(""); setBusy(true);
    try { const { data } = await api.post("/contact", form); setSuccess(data.message); setForm(blank); }
    catch (err) { setError(err.response?.data?.message || "Could not send your message. Please try again."); }
    finally { setBusy(false); }
  }
  return <main id="main-content" className="scent-home"><section className="contact-page">
    <div className="section-heading"><span className="section-pill">LET'S TALK</span><h1>{content?.contactTitle || "We would love to hear from you."}</h1><p>{content?.contactIntro || "A question about your fragrance or your order? We are here to help."}</p></div>
    <div className="contact-layout"><aside><span className="eyebrow">THE PERSONAL TOUCH</span><h2>A conversation<br />starts here.</h2>{loadError && <p role="status">Contact details are temporarily unavailable.</p>}{[[Mail, content?.email, "Email"], [Phone, content?.phone, "Phone"], [MapPin, content?.address, "Visit us"], [Clock, content?.hours, "Opening hours"]].map(([Icon, value, label]) => value && <div className="contact-detail" key={label}><Icon size={20} strokeWidth={1.2} /><div><h3>{label}</h3>{label === "Email" ? <a href={"mailto:" + value}>{value}</a> : <p>{value}</p>}</div></div>)}<p className="contact-note">For order enquiries, include your order number so we can help you more easily.</p></aside>
    <form onSubmit={send} className="contact-form cms-fields"><h2>Send us a note</h2>{error && <p className="cms-error" role="alert">{error}</p>}{success && <p className="cms-success" role="status">{success}</p>}<fieldset disabled={busy} className="cms-fields"><div className="cms-columns">{[["name", "Your name", 100], ["email", "Email address", 254]].map(([key, label, max]) => <label key={key}>{label}<input required autoComplete={key} type={key === "email" ? "email" : "text"} maxLength={max} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} /></label>)}</div><label>Subject<input required maxLength={150} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} /></label><label>Your message<textarea required rows={6} maxLength={4000} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></label><p className="cms-hint">Your details will only be used to respond to this enquiry.</p><button className="scent-button">{busy ? "Sending…" : "Send message"}<ArrowUpRight size={17} /></button></fieldset></form></div>
    </section><Footer /></main>;
}
