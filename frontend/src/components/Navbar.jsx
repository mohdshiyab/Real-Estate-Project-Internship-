import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiPlus,
  FiLogIn,
  FiLogOut,
  FiUser,
  FiHome,
  FiBookmark,
  FiGrid,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isSeller, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-ink/75 border-b border-white/5">
      <div className="section flex items-center justify-between py-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gold-gradient flex items-center justify-center text-emerald-deep font-display font-bold text-xl shadow-gold group-hover:scale-105 transition">
            A
          </div>
          <div className="leading-tight">
            <div className="font-display text-xl tracking-wide">
              Aurum <span className="gold-text">Estates</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/50">
              Luxury Living
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm tracking-wider uppercase transition ${
                isActive ? "text-gold" : "text-white/80 hover:text-gold"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/properties"
            className={({ isActive }) =>
              `text-sm tracking-wider uppercase transition ${
                isActive ? "text-gold" : "text-white/80 hover:text-gold"
              }`
            }
          >
            Properties
          </NavLink>

          {isSeller && (
            <NavLink
              to="/seller/dashboard"
              className={({ isActive }) =>
                `text-sm tracking-wider uppercase transition flex items-center gap-1.5 ${
                  isActive ? "text-gold" : "text-white/80 hover:text-gold"
                }`
              }
            >
              <FiGrid className="text-gold" /> Seller Dashboard
            </NavLink>
          )}

          {user && !isSeller && (
            <NavLink
              to="/buyer/dashboard"
              className={({ isActive }) =>
                `text-sm tracking-wider uppercase transition flex items-center gap-1.5 ${
                  isActive ? "text-gold" : "text-white/80 hover:text-gold"
                }`
              }
            >
              <FiBookmark className="text-gold" /> My Inquiries
            </NavLink>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {isSeller && (
                <button
                  onClick={() => navigate("/add")}
                  className="btn-gold !py-2 !px-4 text-xs"
                >
                  <FiPlus /> List Property
                </button>
              )}

              {/* User badge */}
              <div className="glass px-3 py-1.5 flex items-center gap-2 border border-gold/30">
                <div className="w-7 h-7 rounded-full bg-gold-gradient text-emerald-deep font-bold text-xs flex items-center justify-center">
                  {user.name?.[0] || "U"}
                </div>
                <div className="text-left text-xs leading-tight">
                  <div className="font-semibold text-white truncate max-w-[110px]">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-gold uppercase tracking-wider">
                    {isSeller ? "Dealer" : "Buyer"}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2.5 rounded-full border border-white/10 text-white/70 hover:text-red-300 hover:border-red-400/40 transition"
                title="Sign Out"
              >
                <FiLogOut />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost !py-2 !px-4 text-xs">
                <FiLogIn /> Sign In
              </Link>
              <Link to="/register" className="btn-gold !py-2 !px-4 text-xs">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-2xl text-gold"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-white/5 bg-ink/95 backdrop-blur-xl"
          >
            <div className="section py-5 flex flex-col gap-3">
              <NavLink
                to="/"
                end
                onClick={() => setOpen(false)}
                className="py-2 text-sm uppercase tracking-wider text-white/80 hover:text-gold"
              >
                Home
              </NavLink>
              <NavLink
                to="/properties"
                onClick={() => setOpen(false)}
                className="py-2 text-sm uppercase tracking-wider text-white/80 hover:text-gold"
              >
                Properties
              </NavLink>

              {isSeller && (
                <>
                  <NavLink
                    to="/seller/dashboard"
                    onClick={() => setOpen(false)}
                    className="py-2 text-sm uppercase tracking-wider text-gold flex items-center gap-2"
                  >
                    <FiGrid /> Seller Dashboard
                  </NavLink>
                  <NavLink
                    to="/add"
                    onClick={() => setOpen(false)}
                    className="py-2 text-sm uppercase tracking-wider text-white/80 hover:text-gold flex items-center gap-2"
                  >
                    <FiPlus /> List Property
                  </NavLink>
                </>
              )}

              {user && !isSeller && (
                <NavLink
                  to="/buyer/dashboard"
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm uppercase tracking-wider text-gold flex items-center gap-2"
                >
                  <FiBookmark /> My Inquiries
                </NavLink>
              )}

              <div className="pt-4 border-t border-white/10 mt-2">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm">{user.name}</div>
                      <div className="text-xs text-gold uppercase tracking-wider">
                        {isSeller ? "Seller / Dealer" : "Buyer / Customer"}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      className="btn-ghost !py-1.5 !px-3 text-xs text-red-300"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="btn-ghost flex-1 text-center text-xs"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="btn-gold flex-1 text-center text-xs"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
