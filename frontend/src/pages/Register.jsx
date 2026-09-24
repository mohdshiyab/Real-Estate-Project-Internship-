import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiPhone, FiBriefcase, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "seller" ? "seller" : "buyer";
  const redirect = searchParams.get("redirect") || "/";

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [agency, setAgency] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const newUser = await register({
        name,
        email,
        password,
        role,
        phone,
        agency: role === "seller" ? agency : "",
      });

      toast.success(`Account created as ${role === "seller" ? "Seller / Dealer" : "Buyer / Customer"}!`);
      if (redirect !== "/") {
        navigate(redirect);
      } else if (newUser.role === "seller") {
        navigate("/seller/dashboard");
      } else {
        navigate("/properties");
      }
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section py-16 min-h-[85vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-gold p-8 sm:p-10 max-w-lg w-full"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gold-gradient text-emerald-deep font-display font-bold text-2xl flex items-center justify-center mx-auto mb-3 shadow-gold">
            A
          </div>
          <div className="divider-gold mx-auto mb-3" />
          <h1 className="text-3xl font-display">Create Account</h1>
          <p className="text-white/60 text-sm mt-1">Join the Aurum Estates luxury network</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-6">
          <label className="label-luxe text-center block mb-2">I Want To</label>
          <div className="grid grid-cols-2 gap-2 p-1.5 glass rounded-xl">
            <button
              type="button"
              onClick={() => setRole("seller")}
              className={`py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${
                role === "seller"
                  ? "bg-gold-gradient text-emerald-deep shadow-gold"
                  : "text-white/70 hover:text-gold"
              }`}
            >
              {role === "seller" && <FiCheck className="text-sm" />} Sell / Dealer
            </button>
            <button
              type="button"
              onClick={() => setRole("buyer")}
              className={`py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${
                role === "buyer"
                  ? "bg-gold-gradient text-emerald-deep shadow-gold"
                  : "text-white/70 hover:text-gold"
              }`}
            >
              {role === "buyer" && <FiCheck className="text-sm" />} Buy / Customer
            </button>
          </div>
          <p className="text-[11px] text-center text-gold/70 mt-2">
            {role === "seller"
              ? "List your exclusive residences and view customer inquiries in your private dashboard."
              : "Discover luxury residences, filter properties by your criteria, and schedule viewings."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-luxe flex items-center gap-1.5">
              <FiUser className="text-gold" /> Full Name *
            </label>
            <input
              type="text"
              className="input-luxe"
              placeholder="Alexander Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label-luxe flex items-center gap-1.5">
              <FiMail className="text-gold" /> Email Address *
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
              <FiLock className="text-gold" /> Password (min 6 characters) *
            </label>
            <input
              type="password"
              className="input-luxe"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="label-luxe flex items-center gap-1.5">
              <FiPhone className="text-gold" /> Phone Number
            </label>
            <input
              type="tel"
              className="input-luxe"
              placeholder="+1 (555) 019-8833"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {role === "seller" && (
            <div>
              <label className="label-luxe flex items-center gap-1.5">
                <FiBriefcase className="text-gold" /> Real Estate Agency / Brokerage
              </label>
              <input
                type="text"
                className="input-luxe"
                placeholder="Vance Luxury Real Estate"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full mt-4 disabled:opacity-60"
          >
            {loading ? "Creating account..." : `Register as ${role === "seller" ? "Seller" : "Buyer"}`}
          </button>
        </form>

        <div className="text-center text-sm text-white/60 mt-6">
          Already have an account?{" "}
          <Link to={`/login${redirect !== "/" ? `?redirect=${redirect}` : ""}`} className="text-gold hover:underline">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
