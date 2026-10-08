import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Clapperboard, Settings, Mail, ShoppingBag, ChartColumn, Menu, X, LogOut, ArrowUpRight } from "lucide-react";
import logo from "../assets/manzeil-logo.png";

const links = [
  ["/admin", "Overview", LayoutDashboard],
  ["/admin/products", "Products", Package],
  ["/admin/stories", "Stories & Videos", Clapperboard],
  ["/admin/website", "Website Settings", Settings],
  ["/admin/messages", "Contact Messages", Mail],
  ["/admin/orders", "Orders", ShoppingBag],
  ["/admin/reports", "Reports", ChartColumn],
];
export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    function escape(event) { if (event.key === "Escape" && open) { setOpen(false); toggle.current?.focus(); } }
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open]);
  const title = links.find(([path]) => path === location.pathname)?.[1] || "Dashboard";
  return <div className="admin-shell">
    <aside className="admin-sidebar print:hidden">
      <div className="admin-brand"><Link to="/" aria-label="Manzeil storefront"><img src={logo} alt="Manzeil" /></Link><span>STORE MANAGER</span><button ref={toggle} className="admin-menu-toggle" aria-label={open ? "Close admin menu" : "Open admin menu"} aria-expanded={open} aria-controls="admin-navigation" onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button></div>
      <div id="admin-navigation" className={open ? "admin-navigation is-open" : "admin-navigation"}>
        <nav aria-label="Administration">{links.map(([path, label, Icon]) => <NavLink key={path} to={path} end={path === "/admin"} className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}><Icon size={18} strokeWidth={1.6} /><span>{label}</span></NavLink>)}</nav>
        <div className="admin-sidebar-bottom"><Link to="/">View website <ArrowUpRight size={16} /></Link><button onClick={() => { localStorage.removeItem("adminToken"); navigate("/admin/login"); }}><LogOut size={16} /> Sign out</button></div>
      </div>
    </aside>
    <div className="admin-workspace"><header className="admin-topbar print:hidden"><div><span>MANZEIL / ADMIN</span><p>{title}</p></div><Link to="/">View store <ArrowUpRight size={15} /></Link></header><main className="admin-main"><div key={location.pathname} className="route-enter"><Outlet /></div></main></div>
  </div>;
}
