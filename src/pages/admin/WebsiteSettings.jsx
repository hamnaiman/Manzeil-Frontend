import MediaLibrary from "./MediaLibrary.jsx";
import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";
const fields = [
  ["storyTitle", "Brand story heading", 140], ["storyText", "Brand story text", 3000, true],
  ["contactTitle", "Contact page heading", 140], ["contactIntro", "Contact introduction", 1000, true],
  ["email", "Contact email", 254], ["phone", "Phone", 60], ["address", "Address", 500, true], ["hours", "Opening hours", 200],
];
export default function WebsiteSettings() {
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  async function load() {
    setError("");
    try { const { data } = await api.get("/content"); setForm(data.data); }
    catch { setError("Could not load website settings. Check the backend connection."); }
  }
  useEffect(() => { load(); }, []);
  async function save(event) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try { const body = Object.fromEntries(fields.map(([key]) => [key, form[key] || ""])); const { data } = await api.put("/content", body); setForm(data.data); setMessage("Website settings saved."); }
    catch (err) { setError(err.response?.data?.message || "Could not save settings"); }
    finally { setBusy(false); }
  }
  return <section className="cms-page"><header><span className="section-pill">YOUR BRAND</span><h1>Website settings</h1><p>Manage the brand story and public contact information.</p></header>{error && <p className="cms-error" role="alert">{error} {!form && <button onClick={load}>Retry</button>}</p>}{message && <p className="cms-success" role="status">{message}</p>}{form ? <form className="cms-panel cms-fields" onSubmit={save}>{fields.map(([key, label, max, multiline]) => <label key={key}>{label}{multiline ? <textarea rows={4} maxLength={max} required={key === "storyText"} value={form[key] || ""} onChange={e => setForm({ ...form, [key]: e.target.value })} /> : <input type={key === "email" ? "email" : "text"} maxLength={max} required={["storyTitle", "contactTitle"].includes(key)} value={form[key] || ""} onChange={e => setForm({ ...form, [key]: e.target.value })} />}</label>)}<button disabled={busy} className="scent-button">{busy ? "Saving…" : "Save settings"}</button></form> : !error && <p>Loading…</p>}<MediaLibrary /></section>;
}
