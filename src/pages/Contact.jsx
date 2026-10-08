import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, ArrowUpRight, ArrowRight, Check, LoaderCircle, LockKeyhole, Sparkles, Plus } from "lucide-react";
import api from "../api/axios.js";
import Footer from "../components/Footer.jsx";
import "../styles/contact.css";

const blank = { name: "", email: "", subject: "", message: "" };
const topics = ["Find my fragrance", "My order", "Something else"];

export default function Contact() {
  const [content, setContent] = useState(null);
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [revision, setRevision] = useState(0);
  const successRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoadError(false);
    api.get("/content", { signal: controller.signal })
      .then(({ data }) => setContent(data.data))
      .catch(() => { if (!controller.signal.aborted) setLoadError(true); });
    return () => controller.abort();
  }, [revision]);
  useEffect(() => { if (success) successRef.current?.focus(); }, [success]);

  async function send(event) {
    event.preventDefault();
    if (busy) return;
    setError("");
    const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]));
    if (Object.values(payload).some(value => !value)) {
      setError("Please complete every field before sending your message.");
      return;
    }
    setBusy(true);
    try {
      const { data } = await api.post("/contact", payload);
      setSuccess(data.message || "Thank you. Your message has been received.");
      setForm(blank);
    } catch (err) {
      setError(err.response?.data?.message || "Your message could not be sent. Your draft is still here—please try again.");
    } finally { setBusy(false); }
  }

  const details = [
    { icon: Mail, value: content?.email, label: "Write to us", href: content?.email ? "mailto:" + content.email : undefined },
    { icon: Phone, value: content?.phone, label: "Give us a call", href: content?.phone ? "tel:" + content.phone.replace(/[^+0-9]/g, "") : undefined },
    { icon: MapPin, value: content?.address, label: "Find us" },
    { icon: Clock, value: content?.hours, label: "Our hours" },
  ];

  return <main id="main-content" className="scent-home contact-studio">
    <section className="contact-intro" aria-labelledby="contact-title">
      <Link to="/" className="contact-breadcrumb">MANZEIL <span>/</span> CONTACT</Link>
      <div className="contact-intro-row">
        <div><span className="contact-overline"><i /> A LITTLE MORE PERSONAL</span><h1 id="contact-title">{content?.contactTitle || "We would love to hear from you."}</h1></div>
        <p>{content?.contactIntro || "Finding your signature scent should feel personal. Tell us what is on your mind—we are here to help."}</p>
      </div>
    </section>

    <section className="contact-workbench" aria-label="Contact Manzeil">
      <aside className="contact-concierge">
        <div className="concierge-orbit" aria-hidden="true"><span /><span /></div>
        <div className="concierge-heading"><span className="contact-overline">THE MANZEIL EXPERIENCE</span><Sparkles size={24} strokeWidth={1} /><h2>Good conversations.<br /><em>Lasting impressions.</em></h2><p>A fragrance question, an order update, or simply a hello. We are listening.</p></div>
        <div className="concierge-details">
          {loadError && <p className="contact-details-error" role="status">Contact details could not load. <button onClick={() => setRevision(value => value + 1)}>Try again</button></p>}
          {details.map(({ icon: Icon, value, label, href }) => value && <div className="concierge-detail" key={label}><span className="concierge-icon"><Icon size={19} strokeWidth={1.3} /></span><div><h3>{label}</h3>{href ? <a href={href}>{value}<ArrowUpRight size={14} /></a> : <p>{value}</p>}</div></div>)}
        </div>
        <div className="concierge-signoff"><span className="concierge-monogram" aria-hidden="true">m.</span><div>JO TUM CHAHO<span>Every scent tells a story.</span></div></div>
      </aside>

      <div className="contact-form-panel">
        {success ? <div className="contact-confirmation" ref={successRef} tabIndex={-1} role="status"><span className="confirmation-check"><Check size={30} strokeWidth={1.4} /></span><span className="contact-overline">NOTE RECEIVED</span><h2>A little hello.<br /><em>A lovely beginning.</em></h2><p>{success}</p><div className="contact-confirmation-actions"><Link to="/#collection" className="contact-submit">Explore fragrances <ArrowUpRight size={17} /></Link><button type="button" onClick={() => { setSuccess(""); requestAnimationFrame(() => nameRef.current?.focus()); }}>Send another message <ArrowRight size={15} /></button></div></div> :
        <form onSubmit={send} aria-busy={busy}>
          <div className="contact-form-heading"><div><span className="contact-overline">YOUR WORDS, OUR ATTENTION</span><h2>Send us a note.</h2></div><span className="contact-envelope" aria-hidden="true"><Mail size={25} strokeWidth={1} /></span></div>
          <p className="contact-form-subtitle">Start with a topic, then tell us a little more.</p>
          {error && <div className="contact-send-error" role="alert">{error}</div>}
          <fieldset disabled={busy} className="contact-fields">
            <legend className="sr-only">Your contact information and message</legend>
            <div className="contact-topic-group"><span id="topic-label">I would like to talk about</span><div role="group" aria-labelledby="topic-label">{topics.map(topic => <button type="button" key={topic} aria-pressed={form.subject === topic} className={form.subject === topic ? "selected" : ""} onClick={() => setForm({ ...form, subject: topic })}>{topic}{form.subject === topic && <Check size={13} />}</button>)}</div></div>
            <div className="contact-field-pair">
              <label htmlFor="contact-name">Your name <span>*</span><input ref={nameRef} id="contact-name" name="name" required autoComplete="name" maxLength={100} placeholder="How should we address you?" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
              <label htmlFor="contact-email">Email address <span>*</span><input id="contact-email" name="email" required autoComplete="email" type="email" maxLength={254} placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
            </div>
            <label htmlFor="contact-subject">Subject <span>*</span><input id="contact-subject" name="subject" required maxLength={150} placeholder="A few words about your enquiry" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} /></label>
            <label htmlFor="contact-message">Your message <span>*</span><textarea id="contact-message" name="message" required rows={5} maxLength={4000} placeholder="Tell us a little more. For order enquiries, please include your order number." aria-describedby="message-count" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /><small id="message-count">{form.message.length.toLocaleString()} / 4,000</small></label>
            <div className="contact-send-row"><p><LockKeyhole size={14} /> Your details are used to respond to this enquiry.</p><button className="contact-submit" type="submit">{busy ? <>Sending your note <LoaderCircle size={17} className="contact-spinner" /></> : <>Send message <ArrowUpRight size={18} /></>}</button></div>
          </fieldset>
        </form>}
      </div>
    </section>

    <section className="contact-help" aria-labelledby="contact-help-title"><div><span className="contact-overline">BEFORE YOU ASK</span><h2 id="contact-help-title">A little guidance.</h2><p>A few things that make getting in touch easier.</p></div><div className="contact-questions">
      {[["Need help choosing a fragrance?", "Choose “Find my fragrance” above and tell us the scents you enjoy, who you are shopping for, and your budget."], ["Have a question about an order?", "Choose “My order” and include your order number and the email or phone number used at checkout. Please do not include payment card details."], ["Where can I explore the collection?", "Browse the collection to compare fragrances, view product details and choose your next signature scent."]].map(([question, answer], index) => <details key={question}><summary><span><small>0{index + 1}</small>{question}</span><Plus size={17} /></summary><p>{answer}{index === 2 && <Link to="/#collection">Explore the collection <ArrowUpRight size={14} /></Link>}</p></details>)}
    </div></section>
    <Footer />
  </main>;
}
