import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiPlus } from "react-icons/fi";

const links = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/add", label: "List Property" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-ink/70 border-b border-white/5">
      <div className="section flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gold-gradient flex items-center justify-center text-emerald-deep font-display font-bold text-xl shadow-gold group-hover:scale-105 transition">
            A
          </div>
          <div className="leading-tight">
            <div className="font-display text-xl tracking-wide">
              Aurum <span className="gold-text">Estates</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/50">Luxury Living</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `text-sm tracking-wider uppercase transition relative ${
                  isActive ? "text-gold" : "text-white/80 hover:text-gold"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => navigate("/add")} className="btn-gold !py-2.5 !px-5 text-sm">
            <FiPlus /> Add Listing
          </button>
        </div>

        <button className="md:hidden text-2xl text-gold" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-white/5"
          >
            <div className="section py-4 flex flex-col gap-3">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `py-2 text-sm uppercase tracking-wider ${isActive ? "text-gold" : "text-white/80"}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
