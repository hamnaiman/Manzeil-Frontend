import React, { useEffect, useRef, useState } from "react";
import api from "../../api/axios.js";
const empty = { title: "", note: "", tone: "rose", order: 0, published: false };
export default function Stories() {
  const [stories, setStories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [video, setVideo] = useState(null);
  const [poster, setPoster] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const formRef = useRef(null);
  async function load() {
    setLoading(true);
    try { const { data } = await api.get("/stories/admin"); setStories(data.data); }
    catch (err) { setError(err.response?.data?.message || "Could not load stories"); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  function reset() { setForm(empty); setEditing(null); setVideo(null); setPoster(null); formRef.current?.reset(); }
  async function save(event) {
    event.preventDefault(); setError(""); setMessage(""); setProgress(0);
    if (video && video.size > 60 * 1024 * 1024) return setError("Video must be 60 MB or smaller");
    if (poster && poster.size > 5 * 1024 * 1024) return setError("Cover must be 5 MB or smaller");
    setBusy(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      if (video) body.append("video", video);
      if (poster) body.append("poster", poster);
      await api.request({ method: editing ? "put" : "post", url: editing ? "/stories/" + editing._id : "/stories", data: body, onUploadProgress: (e) => setProgress(e.total ? Math.round(e.loaded / e.total * 100) : 0) });
      setMessage("Story saved. Published stories appear on the storefront."); reset(); await load();
    } catch (err) { setError(err.response?.data?.message || "Upload failed. Please try again."); }
    finally { setBusy(false); }
  }
  async function remove(story) {
    if (!window.confirm("Delete this story and its uploaded media?")) return;
    setBusy(true); setError(""); setMessage("");
    try { await api.delete("/stories/" + story._id); if (editing?._id === story._id) reset(); setMessage("Story deleted."); await load(); }
    catch (err) { setError(err.response?.data?.message || "Could not delete story"); }
    finally { setBusy(false); }
  }
  return <section className="cms-page">
    <header><span className="section-pill">STOREFRONT CONTENT</span><h1>Stories & videos</h1><p>Upload films, choose covers, arrange their order and publish when ready.</p></header>
    {error && <p className="cms-error" role="alert">{error}</p>}{message && <p className="cms-success" role="status">{message}</p>}
    <form ref={formRef} onSubmit={save} className="cms-panel">
      <h2>{editing ? "Edit story" : "Create a story"}</h2>
      <fieldset disabled={busy} className="cms-fields">
        <label>Title<input required maxLength={100} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label>
        <label>Short description<input maxLength={240} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} /></label>
        <div className="cms-columns"><label>Cover style<select value={form.tone} onChange={e => setForm({ ...form, tone: e.target.value })}><option value="rose">Warm ivory</option><option value="noir">Charcoal</option><option value="amber">Amber</option><option value="lavender">Stone</option></select></label><label>Display order<input type="number" min="0" max="999" required value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} /></label></div>
        <div className="cms-columns"><label>Video · MP4 or WebM, up to 60 MB<input type="file" accept="video/mp4,video/webm" onChange={e => setVideo(e.target.files[0] || null)} />{editing?.video?.url && <a href={editing.video.url} target="_blank" rel="noreferrer">View current video ↗</a>}</label><label>Cover · JPG, PNG or WebP, up to 5 MB<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setPoster(e.target.files[0] || null)} />{editing?.poster?.url && <img className="cms-thumbnail" src={editing.poster.url} alt="Current cover" />}</label></div>
        <p className="cms-hint">Leave the video empty for a coming-soon card. When editing, choosing a file replaces the current media.</p>
        <label className="cms-checkbox"><input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} /> Publish on the website</label>
        <div className="cms-actions"><button className="scent-button">{busy ? (progress < 100 ? "Uploading " + progress + "%" : "Processing media…") : "Save story"}</button>{editing && <button type="button" onClick={reset}>Cancel edit</button>}</div>
      </fieldset>
    </form>
    <div className="cms-panel"><h2>All stories</h2>{loading ? <p>Loading…</p> : !stories.length ? <p>No stories yet. Create your first story above.</p> : <div className="cms-story-grid">{stories.map(story => <article key={story._id} className="cms-story-card">{story.video?.url ? <video src={story.video.url} poster={story.poster?.url || undefined} controls preload="none" /> : story.poster?.url ? <img src={story.poster.url} alt={story.title} /> : <div className="cms-media-empty">Video placeholder</div>}<h3>{story.title}</h3><p>{story.published ? "Published" : "Draft"} · Position {story.order}</p><div className="cms-actions"><button disabled={busy} onClick={() => { formRef.current?.reset(); setEditing(story); setForm({ title: story.title, note: story.note, tone: story.tone, order: story.order, published: story.published }); setVideo(null); setPoster(null); formRef.current?.scrollIntoView({ behavior: "smooth" }); }}>Edit</button><button disabled={busy} onClick={() => remove(story)}>Delete</button></div></article>)}</div>}</div>
  </section>;
}
