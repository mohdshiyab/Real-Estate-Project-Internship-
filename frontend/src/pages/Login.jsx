import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiLogIn, FiUserCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please provide both email and password");
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login({ email, password });
      toast.success(`Welcome back, ${loggedUser.name}!`);
      if (redirect !== "/") {
        navigate(redirect);
      } else if (loggedUser.role === "seller" || loggedUser.role === "dealer") {
        navigate("/seller/dashboard");
      } else {
        navigate("/properties");
      }
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword("password123");
  };

  return (
    <div className="section py-16 min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-gold p-8 sm:p-10 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gold-gradient text-emerald-deep font-display font-bold text-2xl flex items-center justify-center mx-auto mb-3 shadow-gold">
            A
          </div>
          <div className="divider-gold mx-auto mb-3" />
          <h1 className="text-3xl font-display">Sign In</h1>
          <p className="text-white/60 text-sm mt-1">Access your Aurum Estates portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-luxe flex items-center gap-1.5">
              <FiMail className="text-gold" /> Email Address
            </label>
            <input
              type="email"
              className="input-luxe"
              placeholder="alexander@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label-luxe flex items-center gap-1.5">
              <FiLock className="text-gold" /> Password
            </label>
            <input
              type="password"
              className="input-luxe"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full mt-2 disabled:opacity-60"
          >
            <FiLogIn /> {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Quick Demo Logins for Pair Programming / Review */}
        <div className="mt-6 pt-5 border-t border-gold/20">
          <div className="text-[11px] uppercase tracking-[0.2em] text-gold/70 text-center mb-3">
            Quick Demo Login
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo("dealer@aurumestates.com")}
              className="btn-ghost text-xs !py-2 w-full text-center truncate"
              title="Dealer / Seller Login"
            >
              <FiUserCheck className="text-gold" /> Seller Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemo("buyer@aurumestates.com")}
              className="btn-ghost text-xs !py-2 w-full text-center truncate"
              title="Buyer / Customer Login"
            >
              <FiUserCheck className="text-gold" /> Buyer Demo
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-white/60 mt-6">
          Don't have an account?{" "}
          <Link to={`/register${redirect !== "/" ? `?redirect=${redirect}` : ""}`} className="text-gold hover:underline">
            Register here
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
